import { describe, it, expect } from 'vitest';
import badgeVariants from './badgeVariants';

describe('badgeVariants', () => {
    it('returns base classes by default', () => {
        const classes = badgeVariants();
        expect(classes).toContain('inline-flex');
        expect(classes).toContain('items-center');
        expect(classes).toContain('rounded-md');
        expect(classes).toContain('border');
        expect(classes).toContain('px-2');
        expect(classes).toContain('py-0.5');
        expect(classes).toContain('text-xs');
        expect(classes).toContain('font-medium');
        expect(classes).toContain('whitespace-nowrap');
    });

    it('applies default variant when no variant is specified', () => {
        const classes = badgeVariants();
        expect(classes).toContain('bg-primary');
        expect(classes).toContain('text-primary-foreground');
    });

    it('applies secondary variant', () => {
        const classes = badgeVariants({ variant: 'secondary' });
        expect(classes).toContain('bg-secondary');
        expect(classes).toContain('text-secondary-foreground');
    });

    it('applies destructive variant', () => {
        const classes = badgeVariants({ variant: 'destructive' });
        expect(classes).toContain('bg-destructive');
        expect(classes).toContain('text-white');
        expect(classes).toContain('focus-visible:ring-destructive/20');
    });

    it('applies outline variant', () => {
        const classes = badgeVariants({ variant: 'outline' });
        expect(classes).toContain('text-foreground');
        expect(classes).toContain('[a&]:hover:bg-accent');
    });

    it('merges custom className', () => {
        const classes = badgeVariants({ className: 'custom-class' });
        expect(classes).toContain('custom-class');
        expect(classes).toContain('inline-flex');
    });

    it('combines variant and custom className', () => {
        const classes = badgeVariants({ variant: 'outline', className: 'my-custom' });
        expect(classes).toContain('text-foreground');
        expect(classes).toContain('my-custom');
    });
});
