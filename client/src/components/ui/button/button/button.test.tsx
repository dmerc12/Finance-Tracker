import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './button';

describe('Button', () => {
    it('renders as a button by default', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByText('Click me');
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Click me</Button>);
        const button = screen.getByText('Click me');
        expect(button).toHaveClass('custom-class');
    });

    it('renders as a Slot when asChild is true', () => {
        render(
            <Button asChild>
                <a href="#">Link</a>
            </Button>
        );
        const link = screen.getByText('Link');
        expect(link.tagName).toBe('A');
        expect(link).toHaveClass('inline-flex');
    });

    it('applies variant classes', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByText('Delete');
        expect(button).toHaveClass('bg-destructive');
    });

    it('applies size classes', () => {
        render(<Button size="lg">Large</Button>);
        const button = screen.getByText('Large');
        expect(button).toHaveClass('h-10');
    });

    it('passes through additional props', () => {
        render(
            <Button type="submit" data-testid="btn">
                Submit
            </Button>
        );
        const button = screen.getByTestId('btn');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('disables the button', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByText('Disabled');
        expect(button).toBeDisabled();
    });
});
