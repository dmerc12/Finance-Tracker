import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { errorHandler } from './api';

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
            const error = { response: { status: 401 } };
            await expect(errorHandler(error)).rejects.equal(error);
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Unauthorized - user needs to log in again.'
            );
        });

        it('should just reject for non-401 errors (403)', async () => {
            const error = { response: { status: 403 } };
            await expect(errorHandler(error)).rejects.equal(error);
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it('should just reject for errors without response', async () => {
            const error = new Error('Network error');
            await expect(errorHandler(error)).rejects.equal(error);
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
    });
});
