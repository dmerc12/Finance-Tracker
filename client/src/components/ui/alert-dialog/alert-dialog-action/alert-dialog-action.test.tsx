import AlertDialogDescription from '../alert-dialog-description';
import { render, screen } from '@testing-library/react';
import AlertDialogContent from '../alert-dialog-content';
import AlertDialogAction from './alert-dialog-action';
import AlertDialogTitle from '../alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogAction', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogAction>Action</AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogAction className="custom-class">Action</AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        );
        const action = screen.getByText('Action');
        expect(action).toHaveClass('custom-class');
        expect(action).toHaveClass('inline-flex');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogAction data-testid="action">Action</AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        );
        const action = screen.getByTestId('action');
        expect(action).toHaveAttribute('data-testid', 'action');
    });
});
