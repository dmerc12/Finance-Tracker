import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Field, { FieldControl } from './field';
import { Input } from '../input';

describe('Field', () => {
    it('renders the label and children', () => {
        render(
            <Field id="email" label="Email">
                <input />
            </Field>
        );
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('associates the label with the input via htmlFor', () => {
        render(
            <Field id="email" label="Email">
                <FieldControl>
                    <Input />
                </FieldControl>
            </Field>
        );
        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('id', 'email');
    });

    it('applies custom className to the wrapper', () => {
        const { container } = render(
            <Field id="email" label="Email" className="custom-class">
                <input />
            </Field>
        );
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('custom-class');
        expect(wrapper).toHaveClass('mb-4');
    });

    it('does not render error or description when neither is provided', () => {
        render(
            <Field id="email" label="Email">
                <FieldControl>
                    <Input />
                </FieldControl>
            </Field>
        );
        const input = screen.getByLabelText('Email');
        expect(input).not.toHaveAttribute('aria-describedby');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    describe('description', () => {
        it('renders the description with the correct id', () => {
            render(
                <Field id="email" label="Email" description="We'll never share your email">
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            const description = screen.getByText("We'll never share your email");
            expect(description).toBeInTheDocument();
            expect(description).toHaveAttribute('id', 'email-description');
        });

        it('adds aria-describedby pointing to the description', () => {
            render(
                <Field id="email" label="Email" description="Some help text">
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('aria-describedby', 'email-description');
        });

        it('does not set aria-invalid when there is no error', () => {
            render(
                <Field id="email" label="Email" description="Some help text">
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('aria-invalid', 'false');
        });
    });

    describe('error', () => {
        it('renders the error message with the correct id', () => {
            render(
                <Field id="email" label="Email" error="Email is required">
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            const error = screen.getByText('Email is required');
            expect(error).toBeInTheDocument();
            expect(error).toHaveAttribute('id', 'email-error');
        });

        it('adds aria-invalid=true and aria-describedby pointing to the error', () => {
            render(
                <Field id="email" label="Email" error="Email is required">
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('aria-invalid', 'true');
            expect(input).toHaveAttribute('aria-describedby', 'email-error');
        });

        it('adds data-error to the label', () => {
            render(
                <Field id="email" label="Email" error="Email is required">
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            const label = screen.getByText('Email');
            expect(label).toHaveAttribute('data-error', 'true');
        });

        it('hides the description when an error is present', () => {
            render(
                <Field
                    id="email"
                    label="Email"
                    description="We'll never share your email"
                    error="Email is required"
                >
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            expect(screen.queryByText("We'll never share your email")).not.toBeInTheDocument();
            expect(screen.queryByText('Email is required')).toBeInTheDocument();
        });

        it('does not set data-error when there is no error', () => {
            render(
                <Field id="email" label="Email">
                    <FieldControl>
                        <Input />
                    </FieldControl>
                </Field>
            );
            const label = screen.getByText('Email');
            expect(label).toHaveAttribute('data-error', 'false');
        });
    });

    describe('FieldControl', () => {
        it('throws when used outside of Field', () => {
            const consoleError = console.error;
            console.error = () => {};
            expect(() =>
                render(
                    <FieldControl>
                        <Input />
                    </FieldControl>
                )
            ).toThrow('Field components must be used within <Field>');
            console.error = consoleError;
        });

        it('forwards arbitrary props to the child element', () => {
            render(
                <Field id="email" label="Email">
                    <FieldControl>
                        <Input placeholder="you@example.com" data-testid="email-input" />
                    </FieldControl>
                </Field>
            );
            const input = screen.getByTestId('email-input');
            expect(input).toHaveAttribute('placeholder', 'you@example.com');
        });
    });
});
