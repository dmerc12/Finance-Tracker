import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AlertTitle from './alert-title';

describe('AlertTitle', () => {
    it('renders children correctly', () => {
        render(<AlertTitle>Title</AlertTitle>);
        expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<AlertTitle className="custom-class">Title</AlertTitle>);
        const element = document.querySelector('[data-slot="alert-title"]');
        expect(element).toHaveClass('custom-class');
        expect(element).toHaveClass('font-medium');
    });

    it('passes through additional props', () => {
        render(
            <AlertTitle data-testid="title" aria-label="title">
                Title
            </AlertTitle>
        );
        const element = screen.getByTestId('title');
        expect(element).toHaveAttribute('aria-label', 'title');
    });
});
