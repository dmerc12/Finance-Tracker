import AlertDialogDescription from '../alert-dialog-description';
import { render, screen } from '@testing-library/react';
import AlertDialogContent from './alert-dialog-content';
import AlertDialogTitle from '../alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogContent', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    Content
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent className="custom-class">
                    Content
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const content = screen.getByText('Content');
        expect(content).toHaveClass('custom-class');
        expect(content).toHaveClass('bg-background', 'fixed', 'rounded-lg');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent data-testid="content">
                    Content
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-testid', 'content');
    });
});
