import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import AvatarImage from './avatar-image';
import Avatar from '../avatar';

describe('AvatarImage', () => {
    let srcSetterSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        srcSetterSpy = vi
            .spyOn(window.HTMLImageElement.prototype, 'src', 'set')
            .mockImplementation(function (this: HTMLImageElement, value: string) {
                this.setAttribute('src', value);
                queueMicrotask(() => {
                    this.dispatchEvent(new Event('load'));
                });
            });
    });

    afterEach(() => {
        srcSetterSpy.mockRestore();
    });

    it('renders the image with src and alt', async () => {
        render(
            <Avatar>
                <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
            </Avatar>
        );
        const img = await waitFor(() => {
            const element = document.querySelector('[data-slot="avatar-image"]');
            expect(element).toBeInTheDocument();
            return element;
        });
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
        expect(img).toHaveAttribute('alt', 'User');
    });

    it('applies custom className', async () => {
        render(
            <Avatar>
                <AvatarImage src="test.jpg" className="custom-class" alt="User" />
            </Avatar>
        );
        const img = await waitFor(() => {
            const element = document.querySelector('[data-slot="avatar-image"]');
            expect(element).toBeInTheDocument();
            return element;
        });
        expect(img).toHaveClass('custom-class');
        expect(img).toHaveClass('aspect-square', 'size-full');
    });

    it('forwards additional props', async () => {
        render(
            <Avatar>
                <AvatarImage src="test.jpg" data-testid="image" />
            </Avatar>
        );
        const img = await waitFor(() => {
            const element = document.querySelector('[data-testid="image"]');
            expect(element).toBeInTheDocument();
            return element;
        });
        expect(img).toHaveAttribute('data-testid', 'image');
    });
});
