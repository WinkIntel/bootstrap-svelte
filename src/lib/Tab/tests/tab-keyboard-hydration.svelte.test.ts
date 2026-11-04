import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fireEvent } from '@testing-library/svelte';
import { resolve } from 'node:path';
import { flushSync, hydrate, unmount } from 'svelte';
import { createServer } from 'vite';
import { expect, it } from 'vitest';
import KeyboardTest from './tab-keyboard-test.svelte';

it.each(['a', ''])(
    'hydrates tab entry with initial selection %s and cleans up consumer refs',
    async (initial) => {
        const server = await createServer({
            configFile: false,
            plugins: [svelte({ configFile: false })],
            resolve: { alias: { $lib: resolve('src/lib') } },
            server: { middlewareMode: true, hmr: false },
            appType: 'custom'
        });
        const props = { initial };
        let body: string;
        try {
            const { default: ServerFixture } = await server.ssrLoadModule('/src/lib/Tab/tests/tab-keyboard-test.svelte');
            const { render } = await server.ssrLoadModule('svelte/server');
            body = render(ServerFixture, { props }).body;
        } finally {
            await server.close();
        }
        const target = document.createElement('div');
        target.innerHTML = body;
        document.body.appendChild(target);
        const first = target.querySelector<HTMLElement>('#key-a')!;
        expect(first).toHaveAttribute('tabindex', initial ? '0' : '-1');
        const component = hydrate(KeyboardTest, { target, props, recover: false });
        try {
            flushSync();
            expect(target.querySelector('#key-a')).toBe(first);
            expect(first).toHaveAttribute('tabindex', '0');
            expect(component.readRef()).toBe(target.querySelector('#key-c'));
            await fireEvent.keyDown(first, { key: 'End' });
            expect(target.querySelector('#key-c')).toHaveFocus();
            expect(target.querySelector('#key-c')).toHaveAttribute('aria-selected', 'true');
        } finally {
            await unmount(component);
            expect(component.readRef()).toBeNull();
            target.remove();
        }
    },
    20000
);
