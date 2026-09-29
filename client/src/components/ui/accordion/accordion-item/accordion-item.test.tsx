import { render, screen } from '@testing-library/react';
import AccordionItem from './accordion-item';
import { describe, it, expect } from 'vitest';
import Accordion from '../accordion';

describe('AccordionItem', () => {
    it('renders children', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item">Content</AccordionItem>
            </Accordion>
        );
        const item = screen.getByText('Content');
        expect(item).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item" className="custom-class">
                    Content
                </AccordionItem>
            </Accordion>
        );
        const element = document.querySelector('[data-slot="accordion-item"]');
        expect(element).toHaveClass('custom-class');
        expect(element).toHaveClass('border-b');
    });

    it('forwards props', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item" data-testid="item">
                    Content
                </AccordionItem>
            </Accordion>
        );
        const item = screen.getByTestId('item');
        expect(item).toHaveAttribute('data-testid', 'item');
    });
});
