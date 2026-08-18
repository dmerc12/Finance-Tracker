import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardHeader from './card-header';

describe('CardHeader', () => {
    it('renders children', () => {
        render(<CardHeader>Header</CardHeader>);
        expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<CardHeader className="custom-class">Header</CardHeader>);
        const header = screen.getByText('Header');
        expect(header).toHaveClass('custom-class');
        expect(header).toHaveClass('px-6', 'pt-6');
    });

    it('forwards props', () => {
        render(<CardHeader data-testid="header">Header</CardHeader>);
        const header = screen.getByTestId('header');
        expect(header).toHaveAttribute('data-testid', 'header');
    });
});
