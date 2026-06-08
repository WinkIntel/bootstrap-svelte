/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/components/collapse/+page.svelte', () => {
    // Basic Example tests
    test('should render basic example section', () => {
        const { container } = render(Page);
        const basicSection = container.querySelector('#basic-example');
        expect(basicSection).toBeInTheDocument();

        const toggleButton = basicSection?.querySelector('button');
        expect(toggleButton).toBeInTheDocument();
        expect(toggleButton).toHaveTextContent('Expand Content');
    });

    // Horizontal Collapse tests
    describe('Horizontal Collapse', () => {
        test('should render horizontal collapse section', () => {
            const { container } = render(Page);
            const horizontalSection = container.querySelector('#horizontal-collapse');
            expect(horizontalSection).toBeInTheDocument();

            const toggleButton = horizontalSection?.querySelector('button');
            expect(toggleButton).toBeInTheDocument();
            expect(toggleButton).toHaveTextContent('Expand Content');
        });
    });

    // Multiple Targets tests
    describe('Multiple Targets', () => {
        test('should render multiple targets section with three buttons', () => {
            const { container } = render(Page);
            const multipleSection = container.querySelector('#multiple-targets');
            expect(multipleSection).toBeInTheDocument();

            const buttons = multipleSection?.querySelectorAll('button');
            expect(buttons?.length).toBe(3);

            expect(buttons?.[0]).toHaveTextContent('Toggle First Element');
            expect(buttons?.[1]).toHaveTextContent('Toggle Second Element');
            expect(buttons?.[2]).toHaveTextContent('Toggle Both Elements');
        });
    });

    // Events tests
    describe('Events section', () => {
        test('should render events section with event log', () => {
            const { container } = render(Page);
            const eventsSection = container.querySelector('#events');
            expect(eventsSection).toBeInTheDocument();

            const eventLog = eventsSection?.querySelector('.list-group');
            expect(eventLog).toBeInTheDocument();

            const clearButton = eventsSection?.querySelector('button.btn-outline-secondary');
            expect(clearButton).toBeInTheDocument();
            expect(clearButton).toHaveTextContent('Clear');
        });
    });

    // API Reference tests
    describe('API Reference', () => {
        test('should render API reference tables', () => {
            const { container } = render(Page);
            const apiSection = container.querySelector('#api');
            expect(apiSection).toBeInTheDocument();

            const tables = apiSection?.querySelectorAll('table');
            expect(tables?.length).toBe(2); // Props and Events tables

            // Check props table
            const propsRows = tables?.[0]?.querySelectorAll('tbody tr');
            expect(propsRows?.length).toBe(4);

            // Check events table
            const eventsRows = tables?.[1]?.querySelectorAll('tbody tr');
            expect(eventsRows?.length).toBe(4);
        });
    });

    // Playground section
    test('should render playground section', () => {
        const { container } = render(Page);
        const playgroundSection = container.querySelector('#playground');
        expect(playgroundSection).toBeInTheDocument();
    });
});
