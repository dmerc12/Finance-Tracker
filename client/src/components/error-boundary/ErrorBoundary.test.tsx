import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { type ReactElement } from 'react';

/**
 * Toggled per-test so the throwing child can be flipped off for the recovery path.
 * Uses a module toggle rather than a one-shot counter because React 19's concurrent rendering
 * retries the initial render synchronously -
 * a counter would decrement on the first (concurrent) render and succeed on the retry,
 * bypassing the error boundary entirely.
 */
let shouldThrow = true;

const ThrowingChild = () => {
    if (shouldThrow) {
        throw new Error('boom');
    }
    return <div>recovered</div>;
};

const AlwaysThrow = () => {
    throw new Error('always throws');
};

const renderWithRouter = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ErrorBoundary', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        shouldThrow = true;
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('renders children when no error occurs', () => {
        renderWithRouter(
            <ErrorBoundary>
                <div>child content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('child content')).toBeInTheDocument();
        expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });

    it('renders the fallback UI when a child throws during render', () => {
        renderWithRouter(
            <ErrorBoundary>
                <AlwaysThrow />
            </ErrorBoundary>
        );
        expect(screen.queryByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute(
            'href',
            '/login'
        );
    });

    it('logs the caught error with the component stack', () => {
        renderWithRouter(
            <ErrorBoundary>
                <AlwaysThrow />
            </ErrorBoundary>
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'ErrorBoundary caught error',
            expect.any(Error),
            expect.objectContaining({ componentStack: expect.any(String) })
        );
    });

    it('recovers when the user clicks "Try again" and the child succeeds on retry', async () => {
        const user = userEvent.setup();
        renderWithRouter(
            <ErrorBoundary>
                <ThrowingChild />
            </ErrorBoundary>
        );
        expect(screen.queryByText(/something went wrong/i)).toBeInTheDocument();
        shouldThrow = false;
        await user.click(screen.getByRole('button', { name: /try again/i }));
        expect(screen.getByText('recovered')).toBeInTheDocument();
        expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });

    it('resets when resetKey changes', () => {
        const { rerender } = renderWithRouter(
            <ErrorBoundary resetKey="/accounts">
                <AlwaysThrow />
            </ErrorBoundary>
        );
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        rerender(
            <MemoryRouter>
                <ErrorBoundary resetKey="/login">
                    <div>recovered</div>
                </ErrorBoundary>
            </MemoryRouter>
        );
        expect(screen.getByText('recovered')).toBeInTheDocument();
        expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
});
