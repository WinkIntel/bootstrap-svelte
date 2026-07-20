/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, test } from 'vitest';
import { ProgressBar } from '../index.js';

describe('ProgressBar.svelte', () => {
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

    test.each([
        [60, 0, 100, 0, 100, 60, '60%'],
        [15, 10, 20, 10, 20, 15, '50%'],
        [-1, 0, 100, 0, 100, 0, '0%'],
        [101, 0, 100, 0, 100, 100, '100%'],
        [10, 10, 10, 0, 100, 0, '0%'],
        [15, 20, 10, 0, 100, 0, '0%'],
        [Number.NaN, 0, 100, 0, 100, 0, '0%'],
        [10, Number.POSITIVE_INFINITY, 100, 0, 100, 0, '0%'],
        [10, 0, Number.NEGATIVE_INFINITY, 0, 100, 0, '0%']
    ])('normalizes now=%s, min=%s, max=%s into a finite accessible state', (valueNow, valueMin, valueMax, ariaMin, ariaMax, ariaNow, width) => {
        const { container } = render(ProgressBar, { props: { valueNow, valueMin, valueMax } });
        const progressElement = container.querySelector('div[role="progressbar"]');
        const barElement = progressElement?.querySelector('div.progress-bar');

        expect(progressElement).toHaveAttribute('aria-valuenow', String(ariaNow));
        expect(progressElement).toHaveAttribute('aria-valuemin', String(ariaMin));
        expect(progressElement).toHaveAttribute('aria-valuemax', String(ariaMax));
        expect(barElement).toHaveStyle(`width: ${width}`);
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

    test('renders with custom aria label', () => {
        const { container } = render(ProgressBar, {
            props: {
                ariaLabel: 'Download Progress'
            }
        });
        const progressElement = container.querySelector('div[role="progressbar"]');

        expect(progressElement).toHaveAttribute('aria-label', 'Download Progress');
    });

    test('uses a native aria-label when ariaLabel is absent', () => {
        const { container } = render(ProgressBar, {
            props: {
                'aria-label': 'Native progress label'
            }
        });
        const progressElement = container.querySelector('div[role="progressbar"]');

        expect(progressElement).toHaveAttribute('aria-label', 'Native progress label');
    });

    test('keeps owned accessibility semantics while preserving unrelated native attributes', () => {
        const { container } = render(ProgressBar, {
            props: {
                ariaLabel: 'Custom progress label',
                'aria-label': 'Native progress label',
                'aria-valuemin': 99,
                'aria-valuemax': 1,
                'aria-valuenow': 50,
                'data-testid': 'protected-progress',
                role: 'status',
                valueMax: 20,
                valueMin: 10,
                valueNow: 15
            }
        });
        const progressElement = container.querySelector('[data-testid="protected-progress"]');

        expect(progressElement).toHaveAttribute('aria-label', 'Custom progress label');
        expect(progressElement).toHaveAttribute('aria-valuemin', '10');
        expect(progressElement).toHaveAttribute('aria-valuemax', '20');
        expect(progressElement).toHaveAttribute('aria-valuenow', '15');
        expect(progressElement).toHaveAttribute('role', 'progressbar');
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
});
