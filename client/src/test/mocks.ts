import type { AxiosResponse } from 'axios';
import { vi } from 'vitest';

/**
 * Shared mock functions registered globally in setup.ts.
 * Import these in test files to configure return values or make assertions.
 * Reset them in a global beforeEach - see test-utils.tsx.
 */
export const mockPost = vi.fn();
export const mockGet = vi.fn();
export const mockNavigate = vi.fn();

/**
 * Stable stand-in for axios' {@code isAxiosError}.
 * Referenced by the {@code vi.mock('axios')} factory in each slice test file so tests can
 * control which error branch {@code getErrorData} takes.
 */
export const mockIsAxiosError = vi.fn();

/**
 * Minimal {@link AxiosResponse} shape sufficient for mocking {@code api.get}
 * and {@code api.post} in slice tests
 * @param data the response body to wrap
 * @returns an AxiosResponse with the given data and sensible defaults
 */
export function createAxiosResponse<T>(data: T): AxiosResponse<T> {
    return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    } as AxiosResponse<T>;
}
