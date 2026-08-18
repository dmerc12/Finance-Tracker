import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
    it('should merge class names with clsx', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
        expect(cn('foo', { bar: true })).toBe('foo bar');
        expect(cn({ foo: true }, { bar: true })).toBe('foo bar');
    });

    it('should merge Tailwind classes with tailwind-merge', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4');
        expect(cn('p-2', 'p-4')).toBe('p-4');
        expect(cn('text-center', 'text-left')).toBe('text-left');
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should handle empty and falsy inputs', () => {
        expect(cn()).toBe('');
        expect(cn(null, undefined, false)).toBe('');
    });

    it('should handle arrays and nested arrays', () => {
        expect(cn(['foo', 'bar'])).toBe('foo bar');
        expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });
});
