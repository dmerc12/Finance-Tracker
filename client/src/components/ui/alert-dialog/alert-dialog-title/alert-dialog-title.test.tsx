import AlertDialogDescription from '../alert-dialog-description';
import AlertDialogContent from '../alert-dialog-content';
import { render, screen } from '@testing-library/react';
import AlertDialogTitle from './alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogTitle', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle className="custom-class">Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const title = screen.getByText('Title');
        expect(title).toHaveClass('custom-class');
        expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle data-testid="title">Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const title = screen.getByTestId('title');
        expect(title).toHaveAttribute('data-testid', 'title');
    });
});
