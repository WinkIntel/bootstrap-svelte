/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/components/accordion/+page.svelte', () => {
    // Basic Example tests
    describe('Basic Example', () => {
        test('should render basic accordion', () => {
            const { container } = render(Page);
            const accordion = container.querySelector('#basic-example .accordion');
            expect(accordion).toBeInTheDocument();
            expect(accordion).toHaveClass('accordion');
        });

        test('should render accordion items in basic example', () => {
            const { container } = render(Page);
            const accordionItems = container.querySelectorAll('#basic-example .accordion-item');
            expect(accordionItems.length).toBeGreaterThanOrEqual(3);

            // Check first item which should be expanded by default
            const firstItem = accordionItems[0];
            expect(firstItem).toHaveClass('accordion-item');

            const firstButton = firstItem?.querySelector('.accordion-button');
            expect(firstButton).toBeInTheDocument();
            expect(firstButton).not.toHaveClass('collapsed');
            expect(firstButton).toHaveTextContent('Accordion Item #1');

            const firstCollapse = firstItem?.querySelector('.accordion-collapse');
            expect(firstCollapse).toBeInTheDocument();
            expect(firstCollapse).toHaveClass('show');

            const firstBody = firstCollapse?.querySelector('.accordion-body');
            expect(firstBody).toBeInTheDocument();
            expect(firstBody).toContainHTML("<strong>This is the first item's accordion body.</strong>");
        });
    });

    // Always Open Example tests
    describe('Always Open Example', () => {
        test('should render always open accordion with isMultiple prop', () => {
            const { container } = render(Page);
            const accordion = container.querySelector('#always-open .accordion');
            expect(accordion).toBeInTheDocument();

            // Test if accordion items can be expanded simultaneously
            const accordionItems = container.querySelectorAll('#always-open .accordion-item');
            expect(accordionItems.length).toBeGreaterThanOrEqual(2);

            // First item should be expanded by default (isExpanded={true} prop)
            const firstButton = accordionItems[0]?.querySelector('.accordion-button');
            expect(firstButton).not.toHaveClass('collapsed');

            const firstCollapse = accordionItems[0]?.querySelector('.accordion-collapse');
            expect(firstCollapse).toHaveClass('show');

            // Check for text about isMultiple prop
            const firstBody = firstCollapse?.querySelector('.accordion-body');
            expect(firstBody).toContainHTML('isMultiple');
        });
    });

    // Flush Example tests
    describe('Flush Example', () => {
        test('should render flush accordion with isFlush prop', () => {
            const { container } = render(Page);
            const accordion = container.querySelector('#flush .accordion');
            expect(accordion).toBeInTheDocument();
            expect(accordion).toHaveClass('accordion-flush');

            const accordionItems = container.querySelectorAll('#flush .accordion-item');
            expect(accordionItems.length).toBeGreaterThanOrEqual(2);

            // First item should be expanded
            const firstCollapse = accordionItems[0]?.querySelector('.accordion-collapse');
            expect(firstCollapse).toHaveClass('show');

            // Check for text about flush accordion
            const firstBody = firstCollapse?.querySelector('.accordion-body');
            expect(firstBody).toContainHTML("This is the first item's accordion body.");
        });
    });

    // Custom Styling Example tests
    describe('Custom Styling Example', () => {
        test('should render custom styled dark theme accordion', () => {
            const { container } = render(Page);
            const darkThemeWrapper = container.querySelector('#custom-styling .bg-dark');
            expect(darkThemeWrapper).toBeInTheDocument();

            const accordionItems = darkThemeWrapper?.querySelectorAll('.accordion-item');
            expect(accordionItems?.length).toBeGreaterThanOrEqual(2);

            // Check custom styling classes
            expect(accordionItems?.[0]).toHaveClass('bg-dark');
            expect(accordionItems?.[0]).toHaveClass('text-white');

            const button = accordionItems?.[0]?.querySelector('.accordion-button');
            expect(button).toHaveClass('text-white');
            expect(button).toHaveClass('bg-dark');
            expect(button).toHaveTextContent('Dark Theme Item #1');
        });
    });

    // API Reference tests
    describe('API Reference', () => {
        test('should render API reference section', () => {
            const { container } = render(Page);
            const apiSection = container.querySelector('#api');
            expect(apiSection).toBeInTheDocument();

            // Check if all sub-components are documented
            const componentHeadings = apiSection?.querySelectorAll('h3.h5');
            expect(componentHeadings?.length).toBeGreaterThanOrEqual(6); // Root, Item, Header, Button, Collapse, Body

            // Check if prop tables exist
            const tables = apiSection?.querySelectorAll('table');
            expect(tables?.length).toBeGreaterThanOrEqual(6);

            // Check for CSS classes section
            const cssClassesHeading = apiSection?.querySelector('h3.h5:nth-of-type(7)');
            expect(cssClassesHeading).toBeInTheDocument();
            expect(cssClassesHeading).toHaveTextContent('CSS Classes');
        });
    });

    // Playground section tests
    describe('Playground', () => {
        test('should render accordion playground', () => {
            const { container } = render(Page);
            const playgroundSection = container.querySelector('#playground');
            expect(playgroundSection).toBeInTheDocument();

            // Check if the AccordionPlayground component is rendered
            const playground = playgroundSection?.querySelector(':scope > div');
            expect(playground).toBeInTheDocument();
        });
    });
});
