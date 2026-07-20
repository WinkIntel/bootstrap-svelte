import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { collapseIn, collapseOut, getTransitionDuration } from './transition.js';

describe('getTransitionDuration', () => {
    let originalGetComputedStyle: typeof window.getComputedStyle;

    beforeEach(() => {
        originalGetComputedStyle = window.getComputedStyle;
    });

    afterEach(() => {
        window.getComputedStyle = originalGetComputedStyle;
    });

    it.each([null, undefined])('returns 0 when element is %s', (element) => {
        expect(getTransitionDuration(element)).toBe(0);
    });

    it('returns 0 when both transitionDuration and transitionDelay are zero', () => {
        const element = document.createElement('div');
        window.getComputedStyle = vi.fn(
            () =>
                ({
                    transitionDuration: '0s',
                    transitionDelay: '0s'
                }) as CSSStyleDeclaration
        );

        expect(getTransitionDuration(element)).toBe(0);
    });

    it('correctly parses single value durations', () => {
        const element = document.createElement('div');
        window.getComputedStyle = vi.fn(
            () =>
                ({
                    transitionDuration: '0.2s',
                    transitionDelay: '0.1s'
                }) as CSSStyleDeclaration
        );

        expect(getTransitionDuration(element)).toBeCloseTo(300, 0);
    });

    it('uses first value from comma-separated durations', () => {
        const element = document.createElement('div');
        window.getComputedStyle = vi.fn(
            () =>
                ({
                    transitionDuration: '0.3s, 0.1s',
                    transitionDelay: '0.05s, 0s'
                }) as CSSStyleDeclaration
        );

        expect(getTransitionDuration(element)).toBe(350);
    });

    it.each([
        ['150ms', '25ms', 175],
        ['invalid', '0.1s', 100],
        ['0.2s', '', 200],
        ['-1s', 'Infinitys', 0]
    ])('normalizes malformed and millisecond timing values (%s, %s)', (transitionDuration, transitionDelay, expected) => {
        const element = document.createElement('div');
        window.getComputedStyle = vi.fn(() => ({ transitionDuration, transitionDelay }) as CSSStyleDeclaration);

        expect(getTransitionDuration(element)).toBe(expected);
    });
});

describe('collapseIn', () => {
    let element: HTMLElement;
    let originalGetComputedStyle: typeof window.getComputedStyle;

    beforeEach(() => {
        element = document.createElement('div');
        element.classList.add('collapse', 'show');
        originalGetComputedStyle = window.getComputedStyle;
        // Mock getComputedStyle to return a known duration
        window.getComputedStyle = vi.fn(
            () =>
                ({
                    transitionDuration: '0.35s',
                    transitionDelay: '0s'
                }) as CSSStyleDeclaration
        );
    });

    afterEach(() => {
        window.getComputedStyle = originalGetComputedStyle;
    });

    it('sets up vertical collapse correctly', () => {
        Object.defineProperty(element, 'scrollHeight', { value: 100, configurable: true });

        const transition = collapseIn(element, { isHorizontal: false });

        expect(element.classList.contains('collapsing')).toBe(true);
        expect(element.classList.contains('collapse')).toBe(false);
        expect(element.classList.contains('show')).toBe(false);
        expect(element.style.height).toBe('0px');
        expect(transition.duration).toBe(350);
    });

    it('keeps the rendered CSS timing aligned with an explicit duration and restores the prior timing', () => {
        element.style.transitionDuration = '2s';
        element.style.transitionDelay = '40ms';

        const transition = collapseIn(element, { isHorizontal: false, transitionDuration: 125 });

        expect(transition.duration).toBe(125);
        expect(element.style.transitionDuration).toBe('125ms');
        expect(element.style.transitionDelay).toBe('0ms');

        transition.tick?.(1, 0);

        expect(element.style.transitionDuration).toBe('2s');
        expect(element.style.transitionDelay).toBe('40ms');
    });

    it('preserves per-property CSS timing when no explicit duration is provided', () => {
        element.style.transitionDuration = '350ms, 800ms';
        element.style.transitionDelay = '0ms, 50ms';
        window.getComputedStyle = vi.fn(
            () =>
                ({
                    transitionDuration: '350ms, 800ms',
                    transitionDelay: '0ms, 50ms'
                }) as CSSStyleDeclaration
        );

        const transition = collapseIn(element, { isHorizontal: false });

        expect(transition.duration).toBe(350);
        expect(element.style.transitionDuration).toBe('350ms, 800ms');
        expect(element.style.transitionDelay).toBe('0ms, 50ms');
    });

    it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])('falls back to CSS timing for an invalid explicit duration (%s)', (transitionDuration) => {
        const transition = collapseIn(element, { isHorizontal: false, transitionDuration });

        expect(transition.duration).toBe(350);
        expect(element.style.transitionDuration).toBe('');
        expect(element.style.transitionDelay).toBe('');
    });

    it('finishes immediately when the explicit transition duration is zero', () => {
        const transition = collapseIn(element, { isHorizontal: false, transitionDuration: 0 });

        expect(transition.duration).toBe(0);
        expect(element).toHaveClass('collapse', 'show');
        expect(element).not.toHaveClass('collapsing');
        expect(element.style.transitionDuration).toBe('');
        expect(element.style.transitionDelay).toBe('');
    });

    it('updates height during transition tick (t < 1)', () => {
        Object.defineProperty(element, 'scrollHeight', { value: 100, configurable: true });

        const transition = collapseIn(element, { isHorizontal: false });
        transition.tick?.(0.5, 0.5);

        expect(element.style.height).toBe('100px');
    });

    it('finalizes vertical collapse at completion (t = 1)', () => {
        Object.defineProperty(element, 'scrollHeight', { value: 100, configurable: true });

        const transition = collapseIn(element, { isHorizontal: false });
        transition.tick?.(1, 0);

        expect(element.classList.contains('collapsing')).toBe(false);
        expect(element.classList.contains('collapse')).toBe(true);
        expect(element.classList.contains('show')).toBe(true);
        expect(element.style.height).toBe('');
    });

    it('sets up horizontal collapse correctly', () => {
        Object.defineProperty(element, 'scrollWidth', { value: 200, configurable: true });

        const _transition = collapseIn(element, { isHorizontal: true });

        expect(element.classList.contains('collapsing')).toBe(true);
        expect(element.style.width).toBe('0px');
    });

    it('updates width during horizontal transition tick', () => {
        Object.defineProperty(element, 'scrollWidth', { value: 200, configurable: true });

        const transition = collapseIn(element, { isHorizontal: true });
        transition.tick?.(0.5, 0.5);

        expect(element.style.width).toBe('200px');
    });

    it('finalizes horizontal collapse at completion', () => {
        Object.defineProperty(element, 'scrollWidth', { value: 200, configurable: true });

        const transition = collapseIn(element, { isHorizontal: true });
        transition.tick?.(1, 0);

        expect(element.classList.contains('collapse')).toBe(true);
        expect(element.classList.contains('show')).toBe(true);
        expect(element.style.width).toBe('');
    });
});

describe('collapseOut', () => {
    let element: HTMLElement;
    let originalGetComputedStyle: typeof window.getComputedStyle;

    beforeEach(() => {
        element = document.createElement('div');
        element.classList.add('collapse', 'show');
        originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = vi.fn(
            () =>
                ({
                    transitionDuration: '0.35s',
                    transitionDelay: '0s'
                }) as CSSStyleDeclaration
        );
    });

    afterEach(() => {
        window.getComputedStyle = originalGetComputedStyle;
    });

    it('sets up vertical collapse out correctly', () => {
        element.getBoundingClientRect = vi.fn(() => ({ height: 100 }) as DOMRect);

        const transition = collapseOut(element, { isHorizontal: false });

        expect(element.style.height).toBe('100px');
        expect(element.classList.contains('collapsing')).toBe(true);
        expect(element.classList.contains('collapse')).toBe(false);
        expect(element.classList.contains('show')).toBe(false);
        expect(transition.duration).toBe(350);
    });

    it('keeps horizontal rendered CSS timing aligned with an explicit duration and restores it at completion', () => {
        element.style.transitionDuration = '2s';
        element.style.transitionDelay = '40ms';
        element.getBoundingClientRect = vi.fn(() => ({ width: 200 }) as DOMRect);

        const transition = collapseOut(element, { isHorizontal: true, transitionDuration: 125 });

        expect(transition.duration).toBe(125);
        expect(element.style.transitionDuration).toBe('125ms');
        expect(element.style.transitionDelay).toBe('0ms');

        transition.tick?.(0, 1);

        expect(element.style.transitionDuration).toBe('2s');
        expect(element.style.transitionDelay).toBe('40ms');
    });

    it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])('falls back to CSS timing for an invalid explicit duration (%s)', (transitionDuration) => {
        expect(collapseOut(element, { isHorizontal: false, transitionDuration }).duration).toBe(350);
    });

    it('finishes immediately when the explicit transition duration is zero', () => {
        element.getBoundingClientRect = vi.fn(() => ({ height: 100 }) as DOMRect);
        const transition = collapseOut(element, { isHorizontal: false, transitionDuration: 0 });

        expect(transition.duration).toBe(0);
        expect(element).toHaveClass('collapse');
        expect(element).not.toHaveClass('collapsing', 'show');
        expect(element.style.transitionDuration).toBe('');
        expect(element.style.transitionDelay).toBe('');
    });

    it('clears dimension during transition (t > 0)', () => {
        element.getBoundingClientRect = vi.fn(() => ({ height: 100 }) as DOMRect);

        const transition = collapseOut(element, { isHorizontal: false });
        transition.tick?.(0.5, 0.5);

        expect(element.style.height).toBe('');
    });

    it('finalizes collapse out at completion (t = 0)', () => {
        element.getBoundingClientRect = vi.fn(() => ({ height: 100 }) as DOMRect);

        const transition = collapseOut(element, { isHorizontal: false });
        transition.tick?.(0, 1);

        expect(element.classList.contains('collapsing')).toBe(false);
        expect(element.classList.contains('collapse')).toBe(true);
        expect(element.classList.contains('show')).toBe(false);
    });

    it('sets up horizontal collapse out correctly', () => {
        element.getBoundingClientRect = vi.fn(() => ({ width: 200 }) as DOMRect);

        const _transition = collapseOut(element, { isHorizontal: true });

        expect(element.style.width).toBe('200px');
        expect(element.classList.contains('collapsing')).toBe(true);
    });

    it('clears width during horizontal transition', () => {
        element.getBoundingClientRect = vi.fn(() => ({ width: 200 }) as DOMRect);

        const transition = collapseOut(element, { isHorizontal: true });
        transition.tick?.(0.5, 0.5);

        expect(element.style.width).toBe('');
    });

    it('finalizes horizontal collapse out at completion', () => {
        element.getBoundingClientRect = vi.fn(() => ({ width: 200 }) as DOMRect);

        const transition = collapseOut(element, { isHorizontal: true });
        transition.tick?.(0, 1);

        expect(element.classList.contains('collapse')).toBe(true);
        expect(element.classList.contains('show')).toBe(false);
    });
});
