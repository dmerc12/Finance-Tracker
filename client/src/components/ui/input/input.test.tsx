import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Input from './input';

describe('Input', () => {
    it('renders correctly with default props', () => {
        render(<Input type="text" />);
        const input = document.querySelector('[data-slot="input"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with custom type', () => {
        render(<Input type="email" />);
        const input = document.querySelector('[data-slot="input"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'email');
    });

    it('applies custom className', () => {
        render(<Input className="custom-class" />);
        const input = document.querySelector('[data-slot="input"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('custom-class');
    });

    it('passes through additional props', () => {
        render(<Input placeholder="Enter text" data-testid="input" />);
        const input = screen.getByTestId('input');
        expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('handles disabled state', () => {
        render(<Input disabled />);
        const input = document.querySelector('[data-slot="input"]');
        expect(input).toBeDisabled();
    });

    it('handles aria-invalid', () => {
        render(<Input aria-invalid="true" />);
        const input = document.querySelector('[data-slot="input"]');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });
});
