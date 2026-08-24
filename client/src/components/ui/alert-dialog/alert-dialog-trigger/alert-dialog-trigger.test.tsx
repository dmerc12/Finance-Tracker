import { render, screen } from '@testing-library/react';
import AlertDialogTrigger from './alert-dialog-trigger';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog/alert-dialog.tsx';

describe('AlertDialogTrigger', () => {
    it('renders children', () => {
        render(
            <AlertDialog>
                <AlertDialogTrigger>Open</AlertDialogTrigger>
            </AlertDialog>
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog>
                <AlertDialogTrigger className="custom-class">Open</AlertDialogTrigger>
            </AlertDialog>
        );
        const trigger = screen.getByText('Open');
        expect(trigger).toHaveClass('custom-class');
    });

    it('forwards props', () => {
        render(
            <AlertDialog>
                <AlertDialogTrigger data-testid="trigger">Open</AlertDialogTrigger>
            </AlertDialog>
        );
        const trigger = screen.getByTestId('trigger');
        expect(trigger).toHaveAttribute('data-testid', 'trigger');
    });
});
