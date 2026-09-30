import { vi } from 'vitest';

/**
 * Shared mock functions registered globally in setup.ts.
 * Import these in test files to configure return values or make assertions.
 * Reset them in a global beforeEach - see test-utils.tsx.
 */
export const mockPost = vi.fn();
export const mockGet = vi.fn();
export const mockNavigate = vi.fn();
