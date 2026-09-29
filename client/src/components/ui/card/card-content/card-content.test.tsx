import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardContent from './card-content';

describe('CardContent', () => {
    it('renders children correctly', () => {
        render(<CardContent>Content</CardContent>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<CardContent className="custom-class">Content</CardContent>);
        const element = document.querySelector('[data-slot="card-content"]');
        expect(element).toHaveClass('custom-class');
    });

    it('passes through additional props', () => {
        render(
            <CardContent data-testid="content" aria-label="content">
                Content
            </CardContent>
        );
        const element = screen.getByTestId('content');
        expect(element).toHaveAttribute('aria-label', 'content');
    });
});
