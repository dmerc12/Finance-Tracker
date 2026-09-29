import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./pages/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('./pages/register', () => ({ default: () => <div>Register Page</div> }));
vi.mock('./pages/Dashboard', () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock('./pages/Accounts', () => ({ default: () => <div>Accounts Page</div> }));
vi.mock('./pages/AccountDetails', () => ({ default: () => <div>AccountDetails Page</div> }));
vi.mock('./pages/Transactions', () => ({ default: () => <div>Transactions Page</div> }));
vi.mock('./pages/Analytics', () => ({ default: () => <div>Analytics Page</div> }));
vi.mock('./pages/Settings', () => ({ default: () => <div>Settings Page</div> }));
vi.mock('./pages/NotFound', () => ({ default: () => <div>Not Found Page</div> }));
vi.mock('./layouts/MainLayout', () => ({ default: () => <div>Main Layout</div> }));

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Default route renders MainLayout which is mocked
        expect(screen.getByText('Main Layout')).toBeInTheDocument();
    });
});
