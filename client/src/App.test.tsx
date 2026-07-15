import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Look for the brand name in the header
        const brandLink = screen.getByRole('link', { name: /Finance Tracker/i });
        expect(brandLink).toBeInTheDocument();
    });
});
