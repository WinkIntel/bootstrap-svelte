/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, waitFor } from '@testing-library/svelte/svelte5';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
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

    describe('collapse toggling', () => {
        // Accordion.Collapse wraps Collapse, whose transition reads the real
        // transition-duration/-delay off the element via getComputedStyle
        // (src/lib/Collapse/transition.ts:getTransitionDuration). This library
        // does not bundle Bootstrap's CSS (see CLAUDE.md), so under jsdom -- with
        // no stylesheet loaded -- that always resolves to 0, and Svelte's
        // css+tick transition never reaches its completion tick with a duration
        // of 0. Stub a realistic duration for accordion-collapse elements so the
        // transition actually runs to completion, the same way
        // Collapse/transition.svelte.test.ts already does for direct calls.
        let originalGetComputedStyle: typeof window.getComputedStyle;

        beforeEach(() => {
            originalGetComputedStyle = window.getComputedStyle;
            window.getComputedStyle = ((element: Element) => {
                const real = originalGetComputedStyle(element);
                if (!element.classList.contains('accordion-collapse')) {
                    return real;
                }
                return new Proxy(real, {
                    get(target, prop, receiver) {
                        if (prop === 'transitionDuration') return '0.35s';
                        if (prop === 'transitionDelay') return '0s';
                        return Reflect.get(target, prop, receiver);
                    }
                });
            }) as typeof window.getComputedStyle;
        });

        afterEach(() => {
            window.getComputedStyle = originalGetComputedStyle;
        });

        test('should toggle accordion items correctly', async () => {
            const user = userEvent.setup();
            const accordion = renderBasicAccordion();
            const button1 = accordion.getByTestId('button-1');
            const button2 = accordion.getByTestId('button-2');

            // Click the first button to collapse it (it starts expanded).
            await user.click(button1);

            expect(button1).toHaveClass('collapsed');
            await waitFor(() => expect(accordion.queryByTestId('collapse-1')).not.toBeInTheDocument());

            // Click the second button to expand it.
            await user.click(button2);

            expect(button2).not.toHaveClass('collapsed');
            await waitFor(() => expect(accordion.getByTestId('collapse-2')).toHaveClass('show'));
            expect(accordion.getByTestId('body-2')).toBeVisible();

            // Click it again and confirm it collapses back out of the DOM.
            await user.click(button2);

            expect(button2).toHaveClass('collapsed');
            await waitFor(() => expect(accordion.queryByTestId('collapse-2')).not.toBeInTheDocument());
        });

        test('should collapse the currently expanded item when a different item is expanded', async () => {
            const user = userEvent.setup();
            const accordion = renderBasicAccordion();
            const button2 = accordion.getByTestId('button-2');

            // Item 1 starts expanded; isMultiple defaults to false, so expanding
            // item 2 should collapse item 1 automatically, with no click on button1.
            await user.click(button2);

            await waitFor(() => expect(accordion.getByTestId('collapse-2')).toHaveClass('show'));
            await waitFor(() => expect(accordion.queryByTestId('collapse-1')).not.toBeInTheDocument());
        });
    });
});
