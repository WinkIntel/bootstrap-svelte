import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';
import { flushSync, hydrate, tick, unmount } from 'svelte';
import { createServer } from 'vite';
import { afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest';
import Overlay from './overlay-initial-test.svelte';

const kinds = ['Modal', 'Offcanvas', 'Toast', 'Tooltip'] as const;
const html = new Map<string, string>();
beforeAll(async () => {
    const server = await createServer({
        configFile: false,
        plugins: [svelte({ configFile: false })],
        resolve: { alias: { $lib: resolve('src/lib') } },
        server: { middlewareMode: true, hmr: false },
        appType: 'custom'
    });
    try {
        const { default: Fixture } = await server.ssrLoadModule('/src/lib/common/tests/overlay-initial-test.svelte');
        const { render } = await server.ssrLoadModule('svelte/server');
        const onShow = vi.fn();
        const onShown = vi.fn();
        for (const kind of kinds) html.set(kind, render(Fixture, { props: { kind, onShow, onShown } }).body);
        expect(onShow).not.toHaveBeenCalled();
        expect(onShown).not.toHaveBeenCalled();
    } finally {
        await server.close();
    }
}, 30000);
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it.each(kinds)('hydrates initially shown %s once, releases on close and supports later opens', async (kind) => {
    const target = document.createElement('div');
    target.innerHTML = html.get(kind)!;
    document.body.append(target);
    const original = target.querySelector('[data-testid="overlay"]');
    const events: string[] = [];
    const instance = hydrate(Overlay, {
        target,
        recover: false,
        props: {
            kind,
            onShow: () => events.push('show'),
            onShown: () => events.push('shown'),
            onHide: () => events.push('hide'),
            onHidden: () => events.push('hidden')
        }
    });
    try {
        flushSync();
        await tick();
        if (kind === 'Modal') {
            expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
            expect(document.body).toHaveClass('modal-open');
        }
        await vi.advanceTimersByTimeAsync(400);
        expect(target.querySelector('[data-testid="overlay"]')).toBe(original);
        expect(events).toEqual(['show', 'shown']);
        flushSync(() => instance.hide());
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'shown', 'hide', 'hidden']);
        expect(target.querySelector('[data-testid="overlay"]')).toBeNull();
        expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        expect(document.body).not.toHaveClass('modal-open');
        flushSync(() => instance.show());
        await vi.advanceTimersByTimeAsync(400);
        expect(events).toEqual(['show', 'shown', 'hide', 'hidden', 'show', 'shown']);
    } finally {
        await unmount(instance);
        target.remove();
    }
    await vi.advanceTimersByTimeAsync(400);
    expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
    expect(document.body).not.toHaveClass('modal-open');
});
