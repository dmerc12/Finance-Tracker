import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Accordion from './accordion';

describe('Accordion', () => {
    it('renders children', () => {
        render(
            <Accordion type="single">
                <div>Content</div>
            </Accordion>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('forwards props', () => {
        render(
            <Accordion data-testid="accordion" type="single">
                <div>Content</div>
            </Accordion>
        );
        const accordion = screen.getByTestId('accordion');
        expect(accordion).toHaveAttribute('data-testid', 'accordion');
        expect(accordion).toHaveAttribute('data-orientation', 'vertical');
    });
});
