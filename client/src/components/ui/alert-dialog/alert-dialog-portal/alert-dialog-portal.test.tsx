import { render } from '@testing-library/react';
import AlertDialogPortal from './alert-dialog-portal';
import { describe, it, expect } from 'vitest';
import AlertDialog from '../alert-dialog';

describe('AlertDialogPortal', () => {
    it('renders children to the document.body when AlertDialog is open', () => {
        render(
            <AlertDialog open>
                <AlertDialogPortal>
                    <div id="portal-content">Portal Content</div>
                </AlertDialogPortal>
            </AlertDialog>
        );
        const portalElement = document.querySelector('#portal-content');
        expect(portalElement).toBeInTheDocument();
        expect(document.body.textContent).toContain('Portal Content');
    });

    it('does not render children to the document body when AlertDialog is closed', () => {
        render(
            <AlertDialog open={false}>
                <AlertDialogPortal>
                    <div id="portal-content">Portal Content</div>
                </AlertDialogPortal>
            </AlertDialog>
        );
        const portalElement = document.querySelector('#portal-content');
        expect(portalElement).not.toBeInTheDocument();
        expect(document.body.textContent).not.toContain('Portal Content');
    });
});
