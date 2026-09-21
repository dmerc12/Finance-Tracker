import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import api, { errorHandler } from './api';

const makeAxiosError = (status: number) =>
    new AxiosError('Request failed', String(status), undefined, undefined, {
        status,
        statusText: '',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: {},
    });

describe('api', () => {
    describe('api instance', () => {
        it('should have the correct baseURL and headers', () => {
            expect(api.defaults.baseURL).toMatch(/\/api$/);
            expect(api.defaults.headers['Content-Type']).toBe('application/json');
            expect(api.defaults.withCredentials).toBe(true);
        });
    });

    describe('api error handler', () => {
        let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleWarnSpy.mockRestore();
        });

        it('should log a warning and reject for 401 errors', async () => {
            const error = makeAxiosError(401);
            await expect(errorHandler(error)).rejects.toEqual(error);
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Unauthorized - user needs to log in again.'
            );
        });

        it('should just reject for non-401 errors (403)', async () => {
            const error = makeAxiosError(403);
            await expect(errorHandler(error)).rejects.toEqual(error);
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it('should just reject for non-Axios errors', async () => {
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
});
