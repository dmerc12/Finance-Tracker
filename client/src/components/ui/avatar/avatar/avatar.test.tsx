import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Avatar from './avatar';

describe('Avatar', () => {
    it('renders children', () => {
        render(
            <Avatar>
                <span>Content</span>
            </Avatar>
        );
        const avatar = document.querySelector('[data-slot="avatar"]');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveTextContent('Content');
    });

    it('applies custom className', () => {
        render(
            <Avatar className="custom-class">
                <span>Content</span>
            </Avatar>
        );
        const avatar = document.querySelector('[data-slot="avatar"]');
        expect(avatar).toHaveClass('custom-class');
        expect(avatar).toHaveClass(
            'relative',
            'flex',
            'size-10',
            'shrink-0',
            'overflow-hidden',
            'rounded-full'
        );
    });

    it('forwards additional props', () => {
        render(
            <Avatar data-testid="avatar">
                <span>Content</span>
            </Avatar>
        );
        const avatar = document.querySelector('[data-slot="avatar"]');
        expect(avatar).toHaveAttribute('data-testid', 'avatar');
    });
});
