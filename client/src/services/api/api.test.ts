import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import api, { errorHandler, setAuthFailureHandler } from './api';
import {
    AxiosError,
    AxiosHeaders,
    type AxiosAdapter,
    type InternalAxiosRequestConfig,
} from 'axios';

const makeAxiosError = (status: number, config?: InternalAxiosRequestConfig) =>
    new AxiosError('Request failed', String(status), config, undefined, {
        status,
        statusText: '',
        headers: {},
        config: config ?? { headers: new AxiosHeaders() },
        data: {},
    });

describe('api', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    describe('api instance', () => {
        it('should have the correct baseURL and headers', () => {
            expect(api.defaults.baseURL).toMatch(/\/api$/);
            expect(api.defaults.headers['Content-Type']).toBe('application/json');
            expect(api.defaults.withCredentials).toBe(true);
        });
    });

    describe('errorHandler', () => {
        beforeEach(() => {
            consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleWarnSpy.mockRestore();
        });

        it('logs a warning and rejects for 401 errors', async () => {
            const error = makeAxiosError(401);
            await expect(errorHandler(error)).rejects.toEqual(error);
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Unauthorized - user needs to log in again.'
            );
        });

        it('just rejects for non-401 errors (403)', async () => {
            const error = makeAxiosError(403);
            await expect(errorHandler(error)).rejects.toEqual(error);
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it('just rejects for non-Axios errors', async () => {
            const error = new Error('Network error');
            await expect(errorHandler(error)).rejects.toEqual(error);
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it('should not warn when a non-Axios object happens to have status 401', async () => {
            const error = { response: { status: 401 } };
            await expect(errorHandler(error)).rejects.toEqual(error);
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
    });

    describe('401 refresh interceptor', () => {
        let authFailureHandler: Mock<() => void>;

        beforeEach(() => {
            consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            authFailureHandler = vi.fn<() => void>();
            setAuthFailureHandler(authFailureHandler);
        });

        afterEach(() => {
            consoleWarnSpy.mockRestore();
        });

        const withAdapter = async (
            adapter: AxiosAdapter,
            run: () => Promise<unknown>
        ): Promise<unknown> => {
            const previous = api.defaults.adapter;
            api.defaults.adapter = adapter;
            try {
                return await run();
            } finally {
                api.defaults.adapter = previous;
            }
        };
        type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

        it('refreshes and retries once on 401, then succeeds', async () => {
            let accountCallCount = 0;
            let refreshCallCount = 0;

            const adapter: AxiosAdapter = async (config) => {
                if (config.url === '/auth/refresh') {
                    refreshCallCount++;
                    return {
                        data: { message: 'Tokens refreshed' },
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                    };
                }
                accountCallCount++;
                if (accountCallCount === 1) {
                    throw makeAxiosError(401, config);
                }
                return {
                    data: { ok: true },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                };
            };

            const result = await withAdapter(adapter, () => api.get('/accounts'));
            expect((result as { data: unknown }).data).toEqual({ ok: true });
            expect(accountCallCount).toBe(2);
            expect(refreshCallCount).toBe(1);
            expect(authFailureHandler).not.toHaveBeenCalled();
        });

        it('single-flights the refresh across concurrent 401s', async () => {
            let refreshCallCount = 0;
            let refreshResolve: (() => void) | null = null;
            const refreshGate = new Promise<void>((resolve) => {
                refreshResolve = resolve;
            });

            const adapter: AxiosAdapter = async (config) => {
                if (config.url === '/auth/refresh') {
                    refreshCallCount++;
                    await refreshGate;
                    return {
                        data: {},
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                    };
                }
                const cfg = config as RetriableConfig;
                if (!cfg._retry) {
                    throw makeAxiosError(401, config);
                }
                return {
                    data: { ok: true },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                };
            };
            const promise = withAdapter(adapter, async () => {
                const p1 = api.get('/accounts');
                const p2 = api.get('/transactions');
                const p3 = api.get('/analytics');
                refreshResolve?.();
                return Promise.all([p1, p2, p3]);
            });
            await promise;
            expect(refreshCallCount).toBe(1);
        });

        it('invokes the auth failure handler when refresh itself fails', async () => {
            const adapter: AxiosAdapter = async (config) => {
                throw makeAxiosError(401, config);
            };

            await expect(withAdapter(adapter, () => api.get('/accounts'))).rejects.toBeInstanceOf(
                AxiosError
            );
            expect(authFailureHandler).toHaveBeenCalledTimes(1);
        });

        it('does not attempt a refresh for 401s on auth endpoints', async () => {
            let refreshCallCount = 0;
            const adapter: AxiosAdapter = async (config) => {
                if (config.url === '/auth/refresh') {
                    refreshCallCount++;
                }
                throw makeAxiosError(401, config);
            };
            await expect(
                withAdapter(adapter, () => api.post('/auth/login', {}))
            ).rejects.toBeInstanceOf(AxiosError);
            expect(refreshCallCount).toBe(0);
            expect(authFailureHandler).not.toHaveBeenCalled();
        });

        it('does not retry twice for the same request', async () => {
            let accountCallCount = 0;
            let refreshCallCount = 0;

            const adapter: AxiosAdapter = async (config) => {
                if (config.url === '/auth/refresh') {
                    refreshCallCount++;
                    return {
                        data: {},
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                    };
                }
                accountCallCount++;
                throw makeAxiosError(401, config);
            };
            await expect(withAdapter(adapter, () => api.get('/accounts'))).rejects.toBeInstanceOf(
                AxiosError
            );
            expect(accountCallCount).toBe(2);
            expect(refreshCallCount).toBe(1);
            expect(authFailureHandler).toHaveBeenCalledTimes(1);
        });
    });
});
