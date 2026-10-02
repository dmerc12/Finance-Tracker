import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Unauthorized from './Unauthorized';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/unauthorized']}>
            <Routes>
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </MemoryRouter>
    );

describe('Unauthorized page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders the heading', () => {
            renderPage();
            expect(screen.getByRole('heading', { name: /access denied/i })).toBeInTheDocument();
        });

        it('renders the explanatory message', () => {
            renderPage();
            expect(
                screen.getByText(/don't have permission to view this page/i)
            ).toBeInTheDocument();
        });

        it('renders the back-to-dashboard button', () => {
            renderPage();
            expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
        });
    });

    describe('navigation', () => {
        it('calls navigate("/") when the back button is clicked', async () => {
            const user = userEvent.setup();
            renderPage();
            await user.click(screen.getByRole('button', { name: /back to dashboard/i }));
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        it('does not navigate before the button is clicked', () => {
            renderPage();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
