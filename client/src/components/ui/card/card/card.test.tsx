import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './card';

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card>Card content</Card>);
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Card className="custom-class">Content</Card>);
        const cardElement = document.querySelector('[data-slot="card"]');
        expect(cardElement).toHaveClass('custom-class');
    });

    it('passes through additional props', () => {
        render(
            <Card data-testid="card" aria-label="card">
                Content
            </Card>
        );
        const card = screen.getByTestId('card');
        expect(card).toHaveAttribute('aria-label', 'card');
    });
});
