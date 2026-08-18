import { describe, it, expect } from 'vitest';
import alertVariants from './alertVariants';

describe('alertVariants', () => {
    it('returns base classes by default', () => {
        const classes = alertVariants();
        expect(classes).toContain('relative');
        expect(classes).toContain('w-full');
        expect(classes).toContain('rounded-lg');
        expect(classes).toContain('border');
        expect(classes).toContain('px-4');
        expect(classes).toContain('py-3');
        expect(classes).toContain('text-sm');
        expect(classes).toContain('grid');
    });

    it('applies default variant when no variant is specified', () => {
        const classes = alertVariants();
        expect(classes).toContain('bg-card');
        expect(classes).toContain('text-card-foreground');
    });

    it('applies destructive variant', () => {
        const classes = alertVariants({ variant: 'destructive' });
        expect(classes).toContain('text-destructive');
        expect(classes).toContain('bg-card');
        expect(classes).toContain('[&>svg]:text-current');
        expect(classes).toContain('*:data-[slot=alert-description]:text-destructive/90');
    });

    it('merges custom className', () => {
        const classes = alertVariants({ className: 'custom-class' });
        expect(classes).toContain('custom-class');
        expect(classes).toContain('relative');
    });

    it('combines variant and custom className', () => {
        const classes = alertVariants({
            variant: 'destructive',
            className: 'custom-class',
        });
        expect(classes).toContain('text-destructive');
        expect(classes).toContain('custom-class');
    });
});
