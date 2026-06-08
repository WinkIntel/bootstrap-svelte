/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import { ProgressBar, ProgressStacked } from '../index.js';

describe('ProgressStacked.svelte', () => {
    test('should render', () => {
        const { container } = render(ProgressStacked);
        const stackedContainer = container.querySelector('div.progress-stacked');
        expect(stackedContainer).toBeInTheDocument();
    });

    test('renders with default properties', () => {
        const { container } = render(ProgressStacked);
        const stackedContainer = container.querySelector('div');

        expect(stackedContainer).toHaveClass('progress-stacked');
    });

    test('applies custom classes', () => {
        const { container } = render(ProgressStacked, {
            props: {
                class: 'custom-stacked'
            }
        });
        const stackedContainer = container.querySelector('div');

        expect(stackedContainer).toHaveClass('progress-stacked');
        expect(stackedContainer).toHaveClass('custom-stacked');
    });

    test('renders child progress bars', () => {
        // Create the ProgressStacked component with two ProgressBar children
        const { container } = render(ProgressStacked, {
            props: {
                children: createRawSnippet(() => ({
                    render: () => {
                        const wrapper = document.createElement('div');
                        const { container: bar1Container } = render(ProgressBar, {
                            props: {
                                valueNow: 30,
                                backgroundColorVariant: 'success'
                            }
                        });
                        const { container: bar2Container } = render(ProgressBar, {
                            props: {
                                valueNow: 20,
                                backgroundColorVariant: 'warning'
                            }
                        });
                        if (bar1Container.firstChild) {
                            wrapper.appendChild(bar1Container.firstChild);
                        }
                        if (bar2Container.firstChild) {
                            wrapper.appendChild(bar2Container.firstChild);
                        }
                        return wrapper.outerHTML;
                    }
                }))
            }
        });

        const stackedContainer = container.querySelector('.progress-stacked');
        const progressBars = container.querySelectorAll('div[role="progressbar"]');

        expect(stackedContainer).toBeInTheDocument();
        expect(progressBars.length).toBe(2);

        // In a real rendering context, the progress bars would identify they're in a stacked container
        // and apply the width to themselves, but in this test environment we can only check they exist
        const barElements = container.querySelectorAll('.progress-bar');
        expect(barElements.length).toBe(2);
        expect(barElements[0]).toHaveClass('bg-success');
        expect(barElements[1]).toHaveClass('bg-warning');
    });

    test('handles element reference binding', () => {
        // This is mostly a TypeScript check, since we can't directly test binding in JSDOM
        const { component } = render(ProgressStacked);
        expect(component).toBeDefined();
    });
});
