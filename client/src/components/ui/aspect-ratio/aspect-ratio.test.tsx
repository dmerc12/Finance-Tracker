import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AspectRatio from './aspect-ratio';

describe('AspectRatio', () => {
    it('renders children', () => {
        render(
            <AspectRatio>
                <div>Content</div>
            </AspectRatio>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AspectRatio className="custom-class">
                <div>Content</div>
            </AspectRatio>
        );
        const element = document.querySelector('[data-slot="aspect-ratio"]');
        expect(element).toHaveClass('custom-class');
    });

    it('forwards additional props', () => {
        render(
            <AspectRatio data-testid="aspect-ratio" ratio={16 / 9}>
                <div>Content</div>
            </AspectRatio>
        );
        const element = screen.getByTestId('aspect-ratio');
        expect(element).toHaveAttribute('data-testid', 'aspect-ratio');
    });
});
