import { render, screen } from '@testing-library/react';
import AlertDescription from './alert-description';
import { describe, it, expect } from 'vitest';

describe('AlertDescription', () => {
    it('renders children correctly', () => {
        render(<AlertDescription>Description text</AlertDescription>);
        expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<AlertDescription className="custom-class">Description</AlertDescription>);
        const element = document.querySelector('[data-slot="alert-description"]');
        expect(element).toHaveClass('custom-class');
        expect(element).toHaveClass('text-muted-foreground');
    });

    it('passes through additional props', () => {
        render(
            <AlertDescription data-testid="desc" aria-label="description">
                Description
            </AlertDescription>
        );
        const element = screen.getByTestId('desc');
        expect(element).toHaveAttribute('aria-label', 'description');
    });
});
