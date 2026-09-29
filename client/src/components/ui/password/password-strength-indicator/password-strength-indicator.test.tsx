import PasswordStrengthIndicator from './password-strength-indicator';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('PasswordStrengthIndicator', () => {
    it('renders nothing when strength is 0', () => {
        const { container } = render(<PasswordStrengthIndicator strength={0} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders nothing when strength is negative', () => {
        const { container } = render(<PasswordStrengthIndicator strength={-1} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders "Weak" for strength 1', () => {
        render(<PasswordStrengthIndicator strength={1} />);
        expect(screen.getByText('Password strength:')).toBeInTheDocument();
        expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    it('renders "Weak" for strength 2', () => {
        render(<PasswordStrengthIndicator strength={2} />);
        expect(screen.getByText('Password strength:')).toBeInTheDocument();
        expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    it('renders "Fair" for strength 3', () => {
        render(<PasswordStrengthIndicator strength={3} />);
        expect(screen.getByText('Password strength:')).toBeInTheDocument();
        expect(screen.getByText('Fair')).toBeInTheDocument();
    });

    it('renders "Good" for strength 4', () => {
        render(<PasswordStrengthIndicator strength={4} />);
        expect(screen.getByText('Password strength:')).toBeInTheDocument();
        expect(screen.getByText('Good')).toBeInTheDocument();
    });

    it('renders "Strong" for strength 5', () => {
        render(<PasswordStrengthIndicator strength={5} />);
        expect(screen.getByText('Password strength:')).toBeInTheDocument();
        expect(screen.getByText('Strong')).toBeInTheDocument();
    });

    it('renders "Very Strong" for strength 6', () => {
        render(<PasswordStrengthIndicator strength={6} />);
        expect(screen.getByText('Password strength:')).toBeInTheDocument();
        expect(screen.getByText('Very Strong')).toBeInTheDocument();
    });

    it('sets the progress bar aria attributes', () => {
        render(<PasswordStrengthIndicator strength={4} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).toHaveAttribute('aria-valuenow', '4');
        expect(progress).toHaveAttribute('aria-valuemin', '0');
        expect(progress).toHaveAttribute('aria-valuemax', '6');
        expect(progress).toHaveAttribute('aria-label', 'Password strength: Good');
    });

    it('applies the correct color for weak strength', () => {
        render(<PasswordStrengthIndicator strength={1} />);
        const progress = screen.getByRole('progressbar');
        const bar = progress.firstChild as HTMLElement;
        expect(bar).toHaveClass('bg-red-500');
    });

    it('applies the correct color for fair strength', () => {
        render(<PasswordStrengthIndicator strength={3} />);
        const progress = screen.getByRole('progressbar');
        const bar = progress.firstChild as HTMLElement;
        expect(bar).toHaveClass('bg-yellow-500');
    });

    it('applies the correct color for strong strength', () => {
        render(<PasswordStrengthIndicator strength={5} />);
        const progress = screen.getByRole('progressbar');
        const bar = progress.firstChild as HTMLElement;
        expect(bar).toHaveClass('bg-green-500');
    });

    it('applies the correct color for very strong strength', () => {
        render(<PasswordStrengthIndicator strength={6} />);
        const progress = screen.getByRole('progressbar');
        const bar = progress.firstChild as HTMLElement;
        expect(bar).toHaveClass('bg-green-600');
    });

    it('sets the bar width proportional to strength', () => {
        render(<PasswordStrengthIndicator strength={3} />);
        const progress = screen.getByRole('progressbar');
        const bar = progress.firstChild as HTMLElement;
        expect(bar).toHaveStyle({ width: '50%' });
    });
});
