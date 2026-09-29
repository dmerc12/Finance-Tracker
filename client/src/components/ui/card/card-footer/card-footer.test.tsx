import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardFooter from './card-footer';

describe('CardFooter', () => {
    it('renders children', () => {
        render(<CardFooter>Footer</CardFooter>);
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<CardFooter className="custom-class">Footer</CardFooter>);
        const footer = screen.getByText('Footer');
        expect(footer).toHaveClass('custom-class');
        expect(footer).toHaveClass('flex', 'px-6', 'pb-6');
    });

    it('forwards props', () => {
        render(<CardFooter data-testid="footer">Footer</CardFooter>);
        const footer = screen.getByTestId('footer');
        expect(footer).toHaveAttribute('data-testid', 'footer');
    });
});
