import AlertDialogDescription from './alert-dialog-description';
import AlertDialogContent from '../alert-dialog-content';
import { render, screen } from '@testing-library/react';
import AlertDialogTitle from '../alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogDescription', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription className="custom-class">
                        Description
                    </AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const desc = screen.getByText('Description');
        expect(desc).toHaveClass('custom-class');
        expect(desc).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription data-testid="desc">Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const desc = screen.getByTestId('desc');
        expect(desc).toHaveAttribute('data-testid', 'desc');
    });
});
