import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './badge';

describe('Badge', () => {
    it('renders as a span by default', () => {
        render(<Badge>New</Badge>);
        const badge = screen.getByText('New');
        expect(badge).toBeInTheDocument();
        expect(badge.tagName).toBe('SPAN');
    });

    it('renders as a Slot when asChild is true', () => {
        render(
            <Badge asChild>
                <a href="/">Link</a>
            </Badge>
        );
        const link = screen.getByText('Link');
        expect(link.tagName).toBe('A');
        expect(link).toHaveClass('inline-flex');
    });

    it('applies custom className', () => {
        render(<Badge className="custom-class">New</Badge>);
        const badge = screen.getByText('New');
        expect(badge).toHaveClass('custom-class');
        expect(badge).toHaveClass('inline-flex');
    });

    it('applies the default variant classes', () => {
        render(<Badge>New</Badge>);
        const badge = screen.getByText('New');
        expect(badge).toHaveClass('bg-primary');
        expect(badge).toHaveClass('text-primary-foreground');
    });

    it('applies the secondary variant classes', () => {
        render(<Badge variant="secondary">New</Badge>);
        const badge = screen.getByText('New');
        expect(badge).toHaveClass('bg-secondary');
    });

    it('applies the destructive variant classes', () => {
        render(<Badge variant="destructive">New</Badge>);
        const badge = screen.getByText('New');
        expect(badge).toHaveClass('bg-destructive');
        expect(badge).toHaveClass('text-white');
    });

    it('applies the outline variant classes', () => {
        render(<Badge variant="outline">New</Badge>);
        const badge = screen.getByText('New');
        expect(badge).toHaveClass('text-foreground');
    });

    it('forwards additional props', () => {
        render(
            <Badge data-testid="badge" aria-label="badge">
                New
            </Badge>
        );
        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('aria-label', 'badge');
    });
});
