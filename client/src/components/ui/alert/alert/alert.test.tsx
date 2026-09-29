import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Alert from './alert';

describe('Alert', () => {
    it('renders children correctly', () => {
        render(<Alert>Alert message</Alert>);
        expect(screen.getByText('Alert message')).toBeInTheDocument();
    });

    it('has role="alert" by default', () => {
        render(<Alert>Alert</Alert>);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Alert className="custom-class">Alert</Alert>);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('custom-class');
    });

    it('applies default variant classes', () => {
        render(<Alert>Alert</Alert>);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('bg-card');
    });

    it('applies destructive variant classes', () => {
        render(<Alert variant="destructive">Alert</Alert>);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('bg-card');
        expect(alert).toHaveClass('text-destructive');
    });

    it('passes through additional props', () => {
        render(
            <Alert data-testid="alert" aria-label="alert">
                Alert
            </Alert>
        );
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('aria-label', 'alert');
    });
});
