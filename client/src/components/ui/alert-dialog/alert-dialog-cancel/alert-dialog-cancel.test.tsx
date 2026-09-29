import AlertDialogDescription from '../alert-dialog-description';
import { render, screen } from '@testing-library/react';
import AlertDialogContent from '../alert-dialog-content';
import AlertDialogCancel from './alert-dialog-cancel';
import AlertDialogTitle from '../alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogCancel', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogCancel className="custom-class">Cancel</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
        );
        const cancel = screen.getByText('Cancel');
        expect(cancel).toHaveClass('custom-class');
        expect(cancel).toHaveClass('border');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogCancel data-testid="cancel">Action</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
        );
        const cancel = screen.getByTestId('cancel');
        expect(cancel).toHaveAttribute('data-testid', 'cancel');
    });
});
