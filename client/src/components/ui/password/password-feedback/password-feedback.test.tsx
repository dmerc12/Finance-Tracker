import { render, screen } from '@testing-library/react';
import PasswordFeedback from './password-feedback';
import { describe, it, expect } from 'vitest';

describe('PasswordFeedback', () => {
    it('renders nothing when password is empty', () => {
        const { container } = render(<PasswordFeedback password="" strength={0} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders the alert with a title', () => {
        render(<PasswordFeedback password="abc" strength={2} />);
        expect(screen.getByText(/password requirements/i)).toBeInTheDocument();
    });

    it('renders the strength indicator', () => {
        render(<PasswordFeedback password="abc" strength={2} />);
        expect(screen.getByText(/password requirements/i)).toBeInTheDocument();
        expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    it('renders a requirements list with six items', () => {
        render(<PasswordFeedback password="abc" strength={2} />);
        const list = screen.getByRole('list', { name: /password requirements/i });
        expect(list).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });

    describe('requirement states', () => {
        it('marks met requirements as "met"', () => {
            render(<PasswordFeedback password="abcdefgh" strength={3} />);
            const lengthItem = screen.getByText(/at least 8 characters/i).closest('li');
            expect(lengthItem).toHaveTextContent('met');
        });

        it('marks unmet requirements as "not met"', () => {
            render(<PasswordFeedback password="abcdefgh" strength={3} />);
            const uppercaseItem = screen.getByText(/one uppercase letter/i).closest('li');
            expect(uppercaseItem).toHaveTextContent('not met');
        });

        it('flags personalInfo when password overlaps a name', () => {
            render(<PasswordFeedback password="Dyl123!@" strength={5} firstName="Dylan" />);
            const personalItem = screen
                .getByText(/not similar to your name or email/i)
                .closest('li');
            expect(personalItem).toHaveTextContent('not met');
        });

        it('marks all requirements met for a fully strong password', () => {
            render(<PasswordFeedback password="Abc123!@" strength={6} />);
            for (const item of screen.getAllByRole('listitem')) {
                expect(item).toHaveTextContent('met');
            }
        });
    });

    describe('accessibility', () => {
        it('uses role="status" (polite) rather than role="alert"', () => {
            render(<PasswordFeedback password="abc" strength={2} />);
            expect(screen.getByRole('status')).toBeInTheDocument();
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('exposes per-item status via sr-only text', () => {
            render(<PasswordFeedback password="abcdefgh" strength={3} />);
            const lengthItem = screen.getByText(/at least 8 characters/i).closest('li');
            expect(lengthItem?.querySelector('.sr-only')).toHaveTextContent('met');
            const uppercaseItem = screen.getByText(/one uppercase letter/i).closest('li');
            expect(uppercaseItem?.querySelector('.sr-only')).toHaveTextContent('not met');
        });

        it('labels the requirements list', () => {
            render(<PasswordFeedback password="abc" strength={2} />);
            expect(
                screen.getByRole('list', { name: /password requirements/i })
            ).toBeInTheDocument();
        });
    });

    describe('reactivity', () => {
        it('updates item states as the password changes', () => {
            const { rerender } = render(<PasswordFeedback password="abc" strength={2} />);
            const uppercase = () => screen.getByText(/one uppercase letter/i).closest('li');
            expect(uppercase()).toHaveTextContent('not met');
            rerender(<PasswordFeedback password="abcA" strength={3} />);
            expect(uppercase()).toHaveTextContent('met');
        });

        it('flips personalInfo when a name is added that overlaps the password', () => {
            const { rerender } = render(<PasswordFeedback password="Dyl123!@" strength={6} />);
            const personal = () =>
                screen.getByText(/not similar to your name or email/i).closest('li');
            expect(personal()).toHaveTextContent('met');
            rerender(<PasswordFeedback password="Dyl123!@" strength={5} firstName="Dylan" />);
            expect(personal()).toHaveTextContent('not met');
        });
    });
});
