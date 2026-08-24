import AlertDialogDescription from '../alert-dialog-description';
import { render, screen } from '@testing-library/react';
import AlertDialogContent from '../alert-dialog-content';
import AlertDialogOverlay from './alert-dialog-overlay';
import AlertDialogTitle from '../alert-dialog-title';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogOverlay', () => {
    it('renders children', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogOverlay>Overlay</AlertDialogOverlay>
                </AlertDialogContent>
            </AlertDialog>
        );
        expect(screen.getByText('Overlay')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogOverlay className="custom-class">Overlay</AlertDialogOverlay>
                </AlertDialogContent>
            </AlertDialog>
        );
        const overlay = screen.getByText('Overlay');
        expect(overlay).toHaveClass('custom-class');
        expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black/50');
    });

    it('forwards props', () => {
        render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogTitle>Title</AlertDialogTitle>
                    <AlertDialogDescription>Description</AlertDialogDescription>
                    <AlertDialogOverlay data-testid="overlay">Overlay</AlertDialogOverlay>
                </AlertDialogContent>
            </AlertDialog>
        );
        const overlay = screen.getByTestId('overlay');
        expect(overlay).toHaveAttribute('data-testid', 'overlay');
    });
});
