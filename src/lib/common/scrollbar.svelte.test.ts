/* eslint-disable @typescript-eslint/no-explicit-any -- test uses partial/mock typings */
import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as domModule from './dom.js';
import { acquireBodyScrollLock, disableBodyScrolling, getScrollbarWidth, releaseBodyScrollLock, resetBodyScrolling } from './scrollbar.js';

describe('scrollbar.ts', () => {
    let originalBody: HTMLElement;
    let isRTLMock: any;

    beforeEach(() => {
        // Create a clean body element for testing
        originalBody = document.body.cloneNode(true) as HTMLElement;
        document.body.innerHTML = '';

        // Mock isRTL function
        isRTLMock = vi.spyOn(domModule, 'isRTL');
        // Default to LTR
        isRTLMock.mockReturnValue(false);

        // Mock window innerWidth and document.documentElement.clientWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024
        });

        Object.defineProperty(document.documentElement, 'clientWidth', {
            writable: true,
            configurable: true,
            value: 1000
        });
    });

    afterEach(() => {
        // Restore the original body
        document.body = originalBody as unknown as HTMLBodyElement;
        vi.restoreAllMocks();
    });

    describe('getScrollbarWidth', () => {
        it('should calculate scrollbar width correctly', () => {
            const scrollbarWidth = getScrollbarWidth();
            expect(scrollbarWidth).toBe(24); // 1024 - 1000 = 24
        });

        it('should handle different window and document widths', () => {
            Object.defineProperty(window, 'innerWidth', { value: 900 });
            Object.defineProperty(document.documentElement, 'clientWidth', { value: 890 });

            const scrollbarWidth = getScrollbarWidth();
            expect(scrollbarWidth).toBe(10); // 900 - 890 = 10
        });
    });

    describe('disableBodyScrolling', () => {
        it('should set overflow to hidden', () => {
            const body = document.body;
            disableBodyScrolling(body);

            expect(body.style.overflow).toBe('hidden');
        });

        it('should add padding-right equal to scrollbar width in LTR mode', () => {
            isRTLMock.mockReturnValue(false);
            const body = document.body;
            // Set initial padding
            body.style.paddingRight = '10px';

            disableBodyScrolling(body);

            // Should be initial padding (10) + scrollbar width (24) = 34px
            expect(body.style.paddingRight).toBe('34px');
            // Left padding should remain unaffected
            expect(body.style.paddingLeft).toBe('');
        });

        it('should add padding-left equal to scrollbar width in RTL mode', () => {
            isRTLMock.mockReturnValue(true);
            const body = document.body;
            // Set initial padding
            body.style.paddingLeft = '10px';

            disableBodyScrolling(body);

            // Should be initial padding (10) + scrollbar width (24) = 34px
            expect(body.style.paddingLeft).toBe('34px');
            // Right padding should remain unaffected
            expect(body.style.paddingRight).toBe('');
        });

        it('should save initial values as data attributes in LTR mode', () => {
            isRTLMock.mockReturnValue(false);
            const body = document.body;
            body.style.overflow = 'auto';
            body.style.paddingRight = '5px';

            disableBodyScrolling(body);

            expect(body.getAttribute('data-scrollbar-initial-overflow-value')).toBe('auto');
            expect(body.getAttribute('data-scrollbar-initial-padding-value')).toBe('5px');
        });

        it('should save initial values as data attributes in RTL mode', () => {
            isRTLMock.mockReturnValue(true);
            const body = document.body;
            body.style.overflow = 'auto';
            body.style.paddingLeft = '5px';

            disableBodyScrolling(body);

            expect(body.getAttribute('data-scrollbar-initial-overflow-value')).toBe('auto');
            expect(body.getAttribute('data-scrollbar-initial-padding-value')).toBe('5px');
        });
    });

    describe('resetBodyScrolling', () => {
        it('should restore initial overflow and padding-right values in LTR mode', () => {
            isRTLMock.mockReturnValue(false);
            const body = document.body;
            // Setup initial state
            body.style.overflow = 'auto';
            body.style.paddingRight = '5px';

            // Disable scrolling first
            disableBodyScrolling(body);

            // Verify changed state
            expect(body.style.overflow).toBe('hidden');
            expect(body.style.paddingRight).toBe('29px'); // 5px + 24px

            // Reset scrolling
            resetBodyScrolling(body);

            // Should be restored to initial values
            expect(body.style.overflow).toBe('auto');
            expect(body.style.paddingRight).toBe('5px');
        });

        it('should restore initial overflow and padding-left values in RTL mode', () => {
            isRTLMock.mockReturnValue(true);
            const body = document.body;
            // Setup initial state
            body.style.overflow = 'auto';
            body.style.paddingLeft = '5px';

            // Disable scrolling first
            disableBodyScrolling(body);

            // Verify changed state
            expect(body.style.overflow).toBe('hidden');
            expect(body.style.paddingLeft).toBe('29px'); // 5px + 24px

            // Reset scrolling
            resetBodyScrolling(body);

            // Should be restored to initial values
            expect(body.style.overflow).toBe('auto');
            expect(body.style.paddingLeft).toBe('5px');
        });

        it('should do nothing if data attributes are not present', () => {
            const body = document.body;
            // Set some values without using disableBodyScrolling
            body.style.overflow = 'hidden';
            body.style.paddingRight = '20px';

            // Try to reset without data attributes
            resetBodyScrolling(body);

            // Values should remain unchanged
            expect(body.style.overflow).toBe('hidden');
            expect(body.style.paddingRight).toBe('20px');
        });

        it('should remove data attributes after reset', () => {
            const body = document.body;

            // Disable scrolling first
            disableBodyScrolling(body);

            // Verify data attributes exist
            expect(body.hasAttribute('data-scrollbar-initial-overflow-value')).toBe(true);
            expect(body.hasAttribute('data-scrollbar-initial-padding-value')).toBe(true);

            // Reset scrolling
            resetBodyScrolling(body);

            // Data attributes should be removed
            expect(body.hasAttribute('data-scrollbar-initial-overflow-value')).toBe(false);
            expect(body.hasAttribute('data-scrollbar-initial-padding-value')).toBe(false);
        });
    });

    describe('body scroll lock counting', () => {
        it('should lock on a single acquire and restore on the matching release', () => {
            const body = document.body;

            const acquireCount = acquireBodyScrollLock(body);

            expect(acquireCount).toBe(1);
            expect(body.style.overflow).toBe('hidden');
            expect(body.getAttribute('data-scrollbar-lock-count')).toBe('1');

            const releaseCount = releaseBodyScrollLock(body);

            expect(releaseCount).toBe(0);
            expect(body.style.overflow).toBe('');
            expect(body.hasAttribute('data-scrollbar-lock-count')).toBe(false);
        });

        it('should stay locked after the first of two releases and only restore after the second (regression case)', () => {
            const body = document.body;

            acquireBodyScrollLock(body);
            const secondAcquireCount = acquireBodyScrollLock(body);

            expect(secondAcquireCount).toBe(2);
            expect(body.style.overflow).toBe('hidden');
            expect(body.getAttribute('data-scrollbar-lock-count')).toBe('2');

            const firstReleaseCount = releaseBodyScrollLock(body);

            expect(firstReleaseCount).toBe(1);
            expect(body.style.overflow).toBe('hidden');
            expect(body.getAttribute('data-scrollbar-lock-count')).toBe('1');

            const secondReleaseCount = releaseBodyScrollLock(body);

            expect(secondReleaseCount).toBe(0);
            expect(body.style.overflow).toBe('');
            expect(body.hasAttribute('data-scrollbar-lock-count')).toBe(false);
        });

        it('should only capture the initial overflow value on the first acquire', () => {
            const body = document.body;
            body.style.overflow = 'scroll';

            acquireBodyScrollLock(body);
            acquireBodyScrollLock(body);

            expect(body.style.overflow).toBe('hidden');

            releaseBodyScrollLock(body);
            expect(body.style.overflow).toBe('hidden');

            releaseBodyScrollLock(body);
            expect(body.style.overflow).toBe('scroll');
        });

        it('should no-op when releasing with no lock held', () => {
            const body = document.body;

            const releaseCount = releaseBodyScrollLock(body);

            expect(releaseCount).toBe(0);
            expect(body.hasAttribute('data-scrollbar-lock-count')).toBe(false);
            expect(body.style.overflow).toBe('');
        });

        it('should restore only after the final release among three interleaved holders', () => {
            const body = document.body;

            acquireBodyScrollLock(body); // A
            acquireBodyScrollLock(body); // B
            acquireBodyScrollLock(body); // C

            expect(body.style.overflow).toBe('hidden');
            expect(body.getAttribute('data-scrollbar-lock-count')).toBe('3');

            releaseBodyScrollLock(body); // B releases
            expect(body.style.overflow).toBe('hidden');
            expect(body.getAttribute('data-scrollbar-lock-count')).toBe('2');

            releaseBodyScrollLock(body); // A releases
            expect(body.style.overflow).toBe('hidden');
            expect(body.getAttribute('data-scrollbar-lock-count')).toBe('1');

            releaseBodyScrollLock(body); // C releases
            expect(body.style.overflow).toBe('');
            expect(body.hasAttribute('data-scrollbar-lock-count')).toBe(false);
        });
    });
});
