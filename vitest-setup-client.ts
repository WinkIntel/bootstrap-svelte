import '@testing-library/jest-dom/vitest';
import { beforeAll, vi } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    enumerable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
});

// add more mocks here if you need them
beforeAll(() => {
    const animation = {
        pause: () => {},
        play: () => {},
        effect: {
            getComputedTiming: () => {
                return {};
            },
            getKeyframes: () => []
        },
        cancel: () => {},
        currentTime: 0
    } as unknown as Animation;

    Element.prototype.animate = () => animation;
    Element.prototype.getAnimations = () => [animation];
});
