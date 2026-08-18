import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardAction from './card-action';

describe('CardAction', () => {
    it('renders children', () => {
        render(<CardAction>Action</CardAction>);
        expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<CardAction className="custom-class">Action</CardAction>);
        const action = screen.getByText('Action');
        expect(action).toHaveClass('custom-class');
        expect(action).toHaveClass('col-start-2', 'row-span-2', 'self-start', 'justify-self-end');
    });

    it('forwards props', () => {
        render(<CardAction data-testid="action">Action</CardAction>);
        const action = screen.getByTestId('action');
        expect(action).toHaveAttribute('data-testid', 'action');
    });
});
