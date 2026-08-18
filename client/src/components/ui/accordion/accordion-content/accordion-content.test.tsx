import { render, screen } from '@testing-library/react';
import AccordionContent from './accordion-content';
import AccordionItem from '../accordion-item';
import { describe, it, expect } from 'vitest';
import Accordion from '../accordion';

describe('AccordionContent', () => {
    it('renders children', () => {
        render(
            <Accordion type="single" defaultValue="item">
                <AccordionItem value="item">
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className to inner div', () => {
        render(
            <Accordion type="single" defaultValue="item">
                <AccordionItem value="item">
                    <AccordionContent className="custom-class">Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const content = screen.getByText('Content');
        expect(content).toHaveClass('custom-class');
        expect(content).toHaveClass('pt-0', 'pb-4');
    });

    it('applies base classes to the root element', () => {
        render(
            <Accordion type="single" defaultValue="item">
                <AccordionItem value="item">
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const contentRoot = document.querySelector('[data-slot="accordion-content"]');
        expect(contentRoot).toHaveClass('data-[state=closed]:animate-accordion-up');
        expect(contentRoot).toHaveClass('data-[state=open]:animate-accordion-down');
    });

    it('forwards props', () => {
        render(
            <Accordion type="single" defaultValue="item">
                <AccordionItem value="item">
                    <AccordionContent data-testid="content">Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-testid', 'content');
    });
});
