import { render } from '@testing-library/react';
import AvatarFallback from './avatar-fallback';
import { describe, it, expect } from 'vitest';
import Avatar from '../avatar';

describe('AvatarFallback', () => {
    it('renders children', () => {
        render(
            <Avatar>
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
        );
        const fallback = document.querySelector('[data-slot="avatar-fallback"]');
        expect(fallback).toBeInTheDocument();
        expect(fallback).toHaveTextContent('JD');
    });

    it('applies custom className', () => {
        render(
            <Avatar>
                <AvatarFallback className="custom-class">JD</AvatarFallback>
            </Avatar>
        );
        const fallback = document.querySelector('[data-slot="avatar-fallback"]');
        expect(fallback).toHaveClass('custom-class');
        expect(fallback).toHaveClass(
            'bg-muted',
            'flex',
            'size-full',
            'items-center',
            'justify-center',
            'rounded-full'
        );
    });

    it('forwards additional props', () => {
        render(
            <Avatar>
                <AvatarFallback data-testid="fallback">JD</AvatarFallback>
            </Avatar>
        );
        const fallback = document.querySelector('[data-slot="avatar-fallback"]');
        expect(fallback).toHaveAttribute('data-testid', 'fallback');
    });
});
