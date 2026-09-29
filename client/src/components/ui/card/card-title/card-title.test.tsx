import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardTitle from './card-title';

describe('CardTitle', () => {
    it('renders children', () => {
        render(<CardTitle>Title</CardTitle>);
        expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<CardTitle className="custom-class">Title</CardTitle>);
        const title = screen.getByText('Title');
        expect(title).toHaveClass('custom-class');
        expect(title).toHaveClass('leading-none');
    });

    it('forwards props', () => {
        render(<CardTitle data-testid="title">Title</CardTitle>);
        const title = screen.getByTestId('title');
        expect(title).toHaveAttribute('data-testid', 'title');
    });
});
