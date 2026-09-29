import AlertDialogDescription from '../alert-dialog-description';
import { render, screen } from '@testing-library/react';
import AlertDialogContent from '../alert-dialog-content';
import AlertDialogHeader from './alert-dialog-header';
import AlertDialogTitle from '../alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogHeader', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>Header</AlertDialogHeader>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader className="custom-class">Header</AlertDialogHeader>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const header = screen.getByText('Header');
        expect(header).toHaveClass('custom-class');
        expect(header).toHaveClass('flex', 'flex-col', 'gap-2', 'text-center');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader data-testid="header">Header</AlertDialogHeader>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        );
        const header = screen.getByTestId('header');
        expect(header).toHaveAttribute('data-testid', 'header');
    });
});
