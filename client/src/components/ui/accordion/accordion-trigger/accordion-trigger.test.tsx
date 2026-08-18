import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccordionContent from '../accordion-content';
import AccordionTrigger from './accordion-trigger';
import { describe, it, expect } from 'vitest';
import AccordionItem from '../accordion-item';
import Accordion from '../accordion';

describe('AccordionTrigger', () => {
    it('renders children', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item">
                    <AccordionTrigger className="custom-class">Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const trigger = document.querySelector('[data-slot="accordion-trigger"]');
        expect(trigger).toHaveClass('custom-class');
        expect(trigger).toHaveClass('flex');
    });

    it('renders ChevronDownIcon', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('lucide-chevron-down');
    });

    it('toggles content when clicked', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionItem value="item">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const trigger = screen.getByText('Trigger');
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
        await user.click(trigger);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('forwards props', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item">
                    <AccordionTrigger data-testid="trigger">Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
        const trigger = screen.getByTestId('trigger');
        expect(trigger).toHaveAttribute('data-testid', 'trigger');
    });
});
