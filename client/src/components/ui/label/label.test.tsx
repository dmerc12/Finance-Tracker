import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Label from './label';

describe('Label', () => {
    it('renders children correctly', () => {
        render(<Label>Email</Label>);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Label className="custom-class">Email</Label>);
        const label = document.querySelector('[data-slot="label"]');
        expect(label).toHaveClass('custom-class');
    });

    it('passes htmlFor attribute', () => {
        render(<Label htmlFor="email">Email</Label>);
        const label = screen.getByText('Email');
        expect(label).toHaveAttribute('for', 'email');
    });

    it('passes through additional props', () => {
        render(
            <Label data-testid="label" aria-label="label">
                Label
            </Label>
        );
        const label = screen.getByTestId('label');
        expect(label).toHaveAttribute('aria-label', 'label');
    });
});
