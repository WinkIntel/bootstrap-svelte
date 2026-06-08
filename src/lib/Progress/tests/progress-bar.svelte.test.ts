/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import { ProgressBar } from '../index.js';

describe('ProgressBar.svelte', () => {
    test('should render', () => {
        const { container } = render(ProgressBar);
        const progressElement = container.querySelector('div[role="progressbar"]');
        expect(progressElement).toBeInTheDocument();
    });

    test('renders with default properties', () => {
        const { container } = render(ProgressBar);
        const progressElement = container.querySelector('div[role="progressbar"]');
        const barElement = progressElement?.querySelector('div.progress-bar');

        // Check essential properties
        expect(progressElement).toHaveClass('progress');
        expect(progressElement).toHaveAttribute('aria-label', 'Progress Bar');
        expect(progressElement).toHaveAttribute('aria-valuemin', '0');
        expect(progressElement).toHaveAttribute('aria-valuemax', '100');
        expect(progressElement).toHaveAttribute('aria-valuenow', '0');
        expect(barElement).toBeInTheDocument();
        expect(barElement).toHaveClass('progress-bar');
        expect(barElement).toHaveStyle('width: 0%');
    });

    test('renders with custom progress value', () => {
        const { container } = render(ProgressBar, {
            props: {
                valueNow: 60
            }
        });
        const progressElement = container.querySelector('div[role="progressbar"]');
        const barElement = progressElement?.querySelector('div.progress-bar');

        expect(progressElement).toHaveAttribute('aria-valuenow', '60');
        expect(barElement).toHaveStyle('width: 60%');
    });

    test('renders with background color variant', () => {
        const { container } = render(ProgressBar, {
            props: {
                backgroundColorVariant: 'success',
                valueNow: 25
            }
        });
        const barElement = container.querySelector('div.progress-bar');

        expect(barElement).toHaveClass('bg-success');
        expect(barElement).toHaveAttribute('data-bs-theme', 'dark');
    });

    test('renders with striped style', () => {
        const { container } = render(ProgressBar, {
            props: {
                barProps: {
                    isStriped: true
                },
                valueNow: 40
            }
        });
        const barElement = container.querySelector('div.progress-bar');

        expect(barElement).toHaveClass('progress-bar-striped');
        expect(barElement).not.toHaveClass('progress-bar-animated');
    });

    test('renders with animated striped style', () => {
        const { container } = render(ProgressBar, {
            props: {
                barProps: {
                    isStriped: true,
                    isAnimated: true
                },
                valueNow: 75
            }
        });
        const barElement = container.querySelector('div.progress-bar');

        expect(barElement).toHaveClass('progress-bar-striped');
        expect(barElement).toHaveClass('progress-bar-animated');
    });

    test('renders with custom min and max values', () => {
        const { container } = render(ProgressBar, {
            props: {
                valueMin: 10,
                valueMax: 200,
                valueNow: 150
            }
        });
        const progressElement = container.querySelector('div[role="progressbar"]');

        expect(progressElement).toHaveAttribute('aria-valuemin', '10');
        expect(progressElement).toHaveAttribute('aria-valuemax', '200');
        expect(progressElement).toHaveAttribute('aria-valuenow', '150');
    });

    test('renders with custom aria label', () => {
        const { container } = render(ProgressBar, {
            props: {
                ariaLabel: 'Download Progress'
            }
        });
        const progressElement = container.querySelector('div[role="progressbar"]');

        expect(progressElement).toHaveAttribute('aria-label', 'Download Progress');
    });

    test('renders with children content', () => {
        const { container } = render(ProgressBar, {
            props: {
                valueNow: 50,
                children: createRawSnippet(() => ({
                    render: () => '50%'
                }))
            }
        });
        const barElement = container.querySelector('div.progress-bar');

        expect(barElement).toHaveTextContent('50%');
    });

    test('applies custom class to progress container', () => {
        const { container } = render(ProgressBar, {
            props: {
                class: 'custom-progress'
            }
        });
        const progressElement = container.querySelector('div[role="progressbar"]');

        expect(progressElement).toHaveClass('progress');
        expect(progressElement).toHaveClass('custom-progress');
    });

    test('applies custom styles to progress container', () => {
        const { container } = render(ProgressBar, {
            props: {
                style: 'height: 10px; margin-top: 20px;'
            }
        });
        const progressElement = container.querySelector('div[role="progressbar"]');

        expect(progressElement).toHaveAttribute('style');
        expect(progressElement?.getAttribute('style')).toContain('height: 10px');
        expect(progressElement?.getAttribute('style')).toContain('margin-top: 20px');
    });

    test('applies custom class to bar element', () => {
        const { container } = render(ProgressBar, {
            props: {
                barProps: {
                    class: 'custom-bar'
                }
            }
        });
        const barElement = container.querySelector('div.progress-bar');

        expect(barElement).toHaveClass('progress-bar');
        expect(barElement).toHaveClass('custom-bar');
    });

    test('handles element reference binding', () => {
        // This is mostly a TypeScript check, since we can't directly test binding in JSDOM
        const { component } = render(ProgressBar);
        expect(component).toBeDefined();
    });
});
