import '@testing-library/jest-dom';

/**
 * jsdom does not implement window.matchMedia, which Sonner and recharts
 * (and other theme-aware libraries) use at runtime. Provide a minimal
 * implementation that satisfies their queries.
 * Returned object mirrors MediaQueryList closely enough for library needs:
 *  - matches: false (light mode by default)
 *  - addEventListener / removeEventListener: no-ops
 *  - addListener / removeListener: no-ops (deprecated API)
 *  - dispatchEvent: no-op returning false
 */
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }) as MediaQueryList,
});
