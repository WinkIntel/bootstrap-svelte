import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('animation mock (vitest-setup-client.ts)', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        element.remove();
        vi.useRealTimers();
    });

    it('returns an animation with playState "running"', () => {
        const animation = element.animate({}, 100);

        expect(animation.playState).toBe('running');
    });

    it('auto-finishes after the declared duration under fake timers, firing the finish event and resolving `finished`', async () => {
        vi.useFakeTimers();

        const animation = element.animate({}, 100);
        let finishEventFired = false;
        animation.addEventListener('finish', () => {
            finishEventFired = true;
        });

        vi.advanceTimersByTime(100);

        expect(animation.playState).toBe('finished');
        expect(finishEventFired).toBe(true);
        await expect(animation.finished).resolves.toBe(animation);
    });

    it('returns a distinct object for each animate() call', () => {
        const first = element.animate({}, 100);
        const second = element.animate({}, 100);

        expect(first).not.toBe(second);
    });

    it('cancel() before completion sets playState to "idle", fires cancel, resolves `finished`, and prevents a later finish', async () => {
        vi.useFakeTimers();

        const animation = element.animate({}, 100);
        let cancelEventFired = false;
        animation.addEventListener('cancel', () => {
            cancelEventFired = true;
        });
        let finishEventFired = false;
        animation.addEventListener('finish', () => {
            finishEventFired = true;
        });

        animation.cancel();

        expect(animation.playState).toBe('idle');
        expect(cancelEventFired).toBe(true);
        await expect(animation.finished).resolves.toBe(animation);

        vi.advanceTimersByTime(100);
        expect(finishEventFired).toBe(false);
    });

    it('getAnimations() includes running animations and excludes finished/cancelled ones', () => {
        vi.useFakeTimers();

        const running = element.animate({}, 100);
        expect(element.getAnimations()).toContain(running);

        const toCancel = element.animate({}, 100);
        toCancel.cancel();
        expect(element.getAnimations()).not.toContain(toCancel);

        vi.advanceTimersByTime(100);
        expect(element.getAnimations()).not.toContain(running);
    });
});
