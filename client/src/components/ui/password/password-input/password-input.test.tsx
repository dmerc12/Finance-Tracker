import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PasswordInput from './password-input';

describe('PasswordInput', () => {
    const defaultProps = {
        id: 'password',
        name: 'password',
        label: 'Password',
        value: '',
        onChange: vi.fn(),
    };

    it('renders label and input', () => {
        render(<PasswordInput {...defaultProps} />);
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders as type="password" by default', () => {
        render(<PasswordInput {...defaultProps} />);
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('toggles visibility when the eye button is clicked', async () => {
        const user = userEvent.setup();
        render(<PasswordInput {...defaultProps} />);
        const input = screen.getByLabelText('Password');
        const button = screen.getByRole('button', { name: /show password/i });
        // Initially hidden
        expect(input).toHaveAttribute('type', 'password');
        expect(button).toHaveAttribute('aria-label', 'Show Password');
        // Click to show
        await user.click(button);
        expect(input).toHaveAttribute('type', 'text');
        expect(button).toHaveAttribute('aria-label', 'Hide Password');
        // Click to hide again
        await user.click(button);
        expect(input).toHaveAttribute('type', 'password');
        expect(button).toHaveAttribute('aria-label', 'Show Password');
    });

    it('calls onChange when the user types', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<PasswordInput {...defaultProps} onChange={onChange} />);
        await user.type(screen.getByLabelText('Password'), 'abc');
        expect(onChange).toHaveBeenCalled();
    });

    it('forwards the value to the input', () => {
        render(<PasswordInput {...defaultProps} value="mySecret" />);
        expect(screen.getByLabelText('Password')).toHaveValue('mySecret');
    });

    it('applies the autoComplete prop', () => {
        render(<PasswordInput {...defaultProps} autoComplete="current-password" />);
        expect(screen.getByLabelText('Password')).toHaveAttribute(
            'autocomplete',
            'current-password'
        );
    });

    it('defaults autoComplete to new-password', () => {
        render(<PasswordInput {...defaultProps} />);
        expect(screen.getByLabelText('Password')).toHaveAttribute('autoComplete', 'new-password');
    });

    it('does not render error message when no error is passed', () => {
        render(<PasswordInput {...defaultProps} />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'false');
    });

    it('renders error message and sets aria attributes when error is passed', () => {
        render(<PasswordInput {...defaultProps} error="Password is required" />);
        const input = screen.getByLabelText('Password');
        const error = screen.getByText('Password is required');
        expect(error).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', 'password-error');
        expect(error).toHaveAttribute('id', 'password-error');
    });

    it('applies the red border class when there is an error', () => {
        render(<PasswordInput {...defaultProps} error="Error" />);
        expect(screen.getByLabelText('Password')).toHaveClass('border-red-500');
    });

    it('does not apply the red border class when there is no error', () => {
        render(<PasswordInput {...defaultProps} />);
        expect(screen.getByLabelText('Password')).not.toHaveClass('border-red-500');
    });
});
