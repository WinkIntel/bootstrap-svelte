/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { ProgressStacked } from '../index.js';
import ProgressStackedTest from './progress-stacked-test.svelte';

describe('ProgressStacked.svelte', () => {
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

    test('renders child ProgressBars in stacked mode with widths on their roots', () => {
        const { getByTestId } = render(ProgressStackedTest);
        const stacked = getByTestId('stacked-progress');
        const first = getByTestId('stacked-first');
        const second = getByTestId('stacked-second');

        expect(stacked).toHaveClass('progress-stacked');
        expect(first).toHaveStyle('width: 25%');
        expect(second).toHaveStyle('width: 50%');
        expect(first.querySelector('.progress-bar')).not.toHaveStyle('width: 25%');
        expect(second.querySelector('.progress-bar')).toHaveClass('bg-warning');
    });
});
