/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte/svelte5';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import type { Accordion } from '../index.js';
import AccordionBasicTest from './accordion-basic-test.svelte';

const renderBasicAccordion = (props: Accordion.RootProps = {}) => {
    return render(AccordionBasicTest, {
        props: {
            ...props
        }
    });
};

describe('Accordion-Basic.svelte', () => {
    test('should render with default properties', () => {
        const accordion = renderBasicAccordion();
        const root = accordion.getByTestId('root');
        expect(root).toBeInTheDocument();
        expect(root).toHaveClass('accordion');
        expect(root).not.toHaveClass('accordion-flush');
    });

    test('should render with flush styling when isFlush is true', () => {
        const accordion = renderBasicAccordion({ isFlush: true });
        const root = accordion.getByTestId('root');
        expect(root).toBeInTheDocument();
        expect(root).toHaveClass('accordion');
        expect(root).toHaveClass('accordion-flush');
    });

    test('should have the first item expanded by default', () => {
        const accordion = renderBasicAccordion();
        const collapse1 = accordion.getByTestId('collapse-1');

        expect(collapse1).toHaveClass('show');
        expect(() => accordion.getByTestId('collapse-2')).toThrow();
        expect(() => accordion.getByTestId('collapse-3')).toThrow();
    });

    test('should correctly render accordion headers and buttons', () => {
        const accordion = renderBasicAccordion();

        // Check headers
        const header1 = accordion.getByTestId('header-1');

        expect(header1).toBeInTheDocument();

        // Check buttons
        const button1 = accordion.getByTestId('button-1');

        expect(button1).toBeInTheDocument();
        expect(button1).toHaveClass('accordion-button');
        expect(button1).not.toHaveClass('collapsed');
    });

    test('should correctly render accordion bodies', () => {
        const accordion = renderBasicAccordion();

        const body1 = accordion.getByTestId('body-1');

        expect(body1).toBeInTheDocument();
        expect(body1).toHaveClass('accordion-body');

        // Check content is rendered correctly (test for first item)
        expect(body1).toContainHTML("<strong>This is the first item's accordion body.</strong>");
    });

    test('should toggle accordion items correctly', async () => {
        const user = userEvent.setup();
        const accordion = renderBasicAccordion();
        const button1 = accordion.getByTestId('button-1');
        const button2 = accordion.getByTestId('button-2');

        // Click the first button to collapse it
        await user.click(button1);

        // Check that the first item is collapsed
        expect(button1).toHaveClass('collapsed');
        // NOTE: The collapse cannot be tested here because the DOM is not syncing properly.

        // Click the second button to expand it
        await user.click(button2);

        // Check that the second item is expanded
        expect(button2).not.toHaveClass('collapsed');
        // NOTE: The collapse cannot be tested here because the DOM is not syncing properly.
    });
});
