import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

const baseProps = {
    title: 'Dashboard',
    sidebarOpen: true,
    onToggleSidebar: vi.fn(),
};

describe('Header', () => {
    describe('rendering', () => {
        it('renders the title', () => {
            render(<Header {...baseProps} />);
            expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
        });

        it('renders the welcome message with the provided user name', () => {
            render(<Header {...baseProps} userName="Ada" />);
            expect(screen.getByText(/welcome back, ada/i)).toBeInTheDocument();
        });

        it('falls back to "User" when no name is provided', () => {
            render(<Header {...baseProps} />);
            expect(screen.getByText(/welcome back, user/i)).toBeInTheDocument();
        });

        it('renders actions instead of the welcome block when actions are provided', () => {
            render(<Header {...baseProps} actions={<button>Add</button>} userName="Ada" />);
            expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
            expect(screen.queryByText(/welcome back/i)).not.toBeInTheDocument();
        });
    });

    describe('sidebar toggle', () => {
        it('shows the close icon when the sidebar is open', () => {
            render(<Header {...baseProps} sidebarOpen={true} />);
            expect(screen.getAllByRole('button')).toHaveLength(1);
        });

        it('calls onToggleSidebar when the toggle button is clicked', async () => {
            const onToggleSidebar = vi.fn();
            const user = userEvent.setup();
            render(<Header {...baseProps} onToggleSidebar={onToggleSidebar} />);
            await user.click(screen.getByRole('button'));
            expect(onToggleSidebar).toHaveBeenCalledTimes(1);
        });
    });
});
