import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen', () => {
    describe('rendering', () => {
        it('exposes a status role for assistive technology', () => {
            render(<LoadingScreen />);
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('announces a polite live region', () => {
            render(<LoadingScreen />);
            expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
        });

        it('renders scree-reader-only loading text', () => {
            render(<LoadingScreen />);
            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });

        it('renders exactly one status region', () => {
            render(<LoadingScreen />);
            expect(screen.getAllByRole('status')).toHaveLength(1);
        });
    });
});
