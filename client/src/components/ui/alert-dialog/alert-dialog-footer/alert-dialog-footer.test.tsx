import AlertDialogDescription from '../alert-dialog-description';
import { render, screen } from '@testing-library/react';
import AlertDialogContent from '../alert-dialog-content';
import AlertDialogFooter from './alert-dialog-footer';
import AlertDialogTitle from '../alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogFooter', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogFooter>Footer</AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogFooter className="custom-class">Footer</AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
        const footer = screen.getByText('Footer');
        expect(footer).toHaveClass('custom-class');
        expect(footer).toHaveClass('flex', 'flex-col-reverse', 'gap-2');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogFooter data-testid="footer">Footer</AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
        const footer = screen.getByTestId('footer');
        expect(footer).toHaveAttribute('data-testid', 'footer');
    });
});
