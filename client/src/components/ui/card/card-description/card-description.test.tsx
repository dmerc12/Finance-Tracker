import { render, screen } from '@testing-library/react';
import CardDescription from './card-description';
import { describe, it, expect } from 'vitest';

describe('CardDescription', () => {
    it('renders children', () => {
        render(<CardDescription>Description</CardDescription>);
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<CardDescription className="custom-class">Description</CardDescription>);
        const desc = screen.getByText('Description');
        expect(desc).toHaveClass('custom-class');
        expect(desc).toHaveClass('text-muted-foreground');
    });

    it('forwards props', () => {
        render(<CardDescription data-testid="desc">Description</CardDescription>);
        const desc = screen.getByTestId('desc');
        expect(desc).toHaveAttribute('data-testid', 'desc');
    });
});
