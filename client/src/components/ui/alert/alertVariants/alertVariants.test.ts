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

    describe('variants', () => {
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

        it('applies info variant', () => {
            const classes = alertVariants({ variant: 'info' });
            expect(classes).toContain('bg-primary/5');
            expect(classes).toContain('border-primary/20');
            expect(classes).toContain('[&>svg]:text-primary');
            expect(classes).toContain('*:data-[slot=alert-description]:text-muted-foreground');
        });
    });

    describe('className merging', () => {
        it('merges custom className with default variant', () => {
            const classes = alertVariants({ className: 'custom-class' });
            expect(classes).toContain('custom-class');
            expect(classes).toContain('relative');
        });

        it('combines destructive variant with custom className', () => {
            const classes = alertVariants({
                variant: 'destructive',
                className: 'custom-class',
            });
            expect(classes).toContain('text-destructive');
            expect(classes).toContain('custom-class');
        });

        it('combines info variant with custom className', () => {
            const classes = alertVariants({
                variant: 'info',
                className: 'custom-class',
            });
            expect(classes).toContain('bg-primary/5');
            expect(classes).toContain('custom-class');
        });
    });
});
