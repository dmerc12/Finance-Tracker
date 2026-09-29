import { describe, it, expect } from 'vitest';
import buttonVariants from './buttonVariants';

describe('buttonVariants', () => {
    it('returns base classes by default', () => {
        const classes = buttonVariants();
        expect(classes).toContain('inline-flex');
        expect(classes).toContain('rounded-md');
    });

    it('applies variant classes', () => {
        const classes = buttonVariants({ variant: 'destructive' });
        expect(classes).toContain('bg-destructive');
    });

    it('applies size classes', () => {
        const classes = buttonVariants({ size: 'lg' });
        expect(classes).toContain('h-10');
    });

    it('combines variant and size', () => {
        const classes = buttonVariants({ variant: 'outline', size: 'sm' });
        expect(classes).toContain('border');
        expect(classes).toContain('h-8');
    });

    it('merges custom className', () => {
        const classes = buttonVariants({ className: 'custom' });
        expect(classes).toContain('custom');
    });
});
