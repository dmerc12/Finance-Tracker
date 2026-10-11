import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UserManagement from './UserManagement';

describe('UserManagement page', () => {
    it('renders the heading and placeholder message', () => {
        render(<UserManagement />);
        expect(screen.getByRole('heading', { name: /user management/i })).toBeInTheDocument();
        expect(screen.getByText(/admin tools/i)).toBeInTheDocument();
    });
});
