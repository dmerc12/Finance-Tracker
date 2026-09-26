import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toaster from './sonner';

vi.mock('sonner', () => ({
    Toaster: vi.fn(() => <div data-testid="sonner-toaster" />),
}));

import { Toaster as SonnerToaster } from 'sonner';

describe('Toaster', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the sonner Toaster', () => {
        render(<Toaster />);
        expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument();
    });

    it('passes the "system" theme, className, and style to sonner', () => {
        render(<Toaster />);
        const call = vi.mocked(SonnerToaster).mock.calls[0];
        const props = call[0];
        expect(props).toMatchObject({
            theme: 'system',
            className: 'toaster group',
            style: {
                '--normal-bg': 'var(--popover)',
                '--normal-text': 'var(--popover-foreground)',
                '--normal-border': 'var(--border)',
            },
        });
    });

    it('forwards additional props to sonner', () => {
        render(<Toaster position="top-right" richColors closeButton />);
        const props = vi.mocked(SonnerToaster).mock.calls[0][0];
        expect(props).toMatchObject({
            position: 'top-right',
            richColors: true,
            closeButton: true,
        });
    });

    it('lets caller props override defaults', () => {
        render(<Toaster theme="dark" className="custom" />);
        const props = vi.mocked(SonnerToaster).mock.calls[0][0];
        expect(props.theme).toBe('dark');
        expect(props.className).toBe('custom');
    });
});
