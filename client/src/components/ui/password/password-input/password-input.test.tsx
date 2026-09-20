import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Field, FieldControl } from '../../field';
import PasswordInput from './password-input';

describe('PasswordInput', () => {
    const defaultProps = {
        name: 'password',
        value: '',
        onChange: vi.fn(),
    };

    const renderInField = (props: Partial<typeof defaultProps> = {}, error?: string) =>
        render(
            <Field id="password" label="Password" error={error}>
                <FieldControl>
                    <PasswordInput {...defaultProps} {...props} />
                </FieldControl>
            </Field>
        );

    it('renders the input associated with the label', () => {
        renderInField();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders as type="password" by default', () => {
        renderInField();
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('toggles visibility when the eye button is clicked', async () => {
        const user = userEvent.setup();
        renderInField();
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
        renderInField({ onChange });
        await user.type(screen.getByLabelText('Password'), 'abc');
        expect(onChange).toHaveBeenCalled();
    });

    it('forwards the value to the input', () => {
        renderInField({ value: 'mySecret' });
        expect(screen.getByLabelText('Password')).toHaveValue('mySecret');
    });

    it('sets aria-invalid and aria-describedby when there is an error', () => {
        renderInField({}, 'Password is required');
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', 'password-error');
    });

    it('does not set aria-describedby when there is no error', () => {
        renderInField();
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('aria-invalid', 'false');
        expect(input).not.toHaveAttribute('aria-describedby');
    });
});
