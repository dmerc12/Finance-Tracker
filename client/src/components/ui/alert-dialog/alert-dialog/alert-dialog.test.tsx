import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AlertDialog from './alert-dialog';

describe('AlertDialog', () => {
    it('renders children', () => {
        render(<AlertDialog>Dialog</AlertDialog>);
        expect(screen.getByText('Dialog')).toBeInTheDocument();
    });
});
