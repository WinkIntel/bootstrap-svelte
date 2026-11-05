import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fireEvent } from '@testing-library/svelte';
import { resolve } from 'node:path';
import { flushSync, hydrate, unmount } from 'svelte';
import { createServer } from 'vite';
import { beforeAll, expect, it } from 'vitest';
import KeyboardTest from './tab-keyboard-test.svelte';

const projectRoot = resolve(import.meta.dirname, '../../../..');
const cases = (['tab', 'nav'] as const).flatMap((kind) => [false, true].flatMap((bare) => ['a', ''].map((initial) => ({ kind, bare, initial }))));
const html = new Map<object, string>();
beforeAll(async () => {
    const server = await createServer({
        root: projectRoot,
        configFile: false,
        plugins: [svelte({ configFile: false })],
        resolve: { alias: { $lib: resolve(projectRoot, 'src/lib') } },
        // This one-shot SSR server cannot reload an invalidated dependency pre-bundle.
        ssr: { optimizeDeps: { noDiscovery: true, exclude: ['svelte'] } },
        server: { middlewareMode: true, hmr: false },
        appType: 'custom'
    });
    try {
        const { default: ServerFixture } = await server.ssrLoadModule(resolve(import.meta.dirname, 'tab-keyboard-test.svelte'));
        const { render } = await server.ssrLoadModule('svelte/server');
        for (const props of cases) html.set(props, render(ServerFixture, { props }).body);
    } finally {
        await server.close();
    }
}, 30000);

it.each(cases)(
    'hydrates $kind entry with bare=$bare and initial selection "$initial", cleaning up consumer refs',
    async (props) => {
        const { bare, initial } = props;
        const target = document.createElement('div');
        target.innerHTML = html.get(props)!;
        document.body.appendChild(target);
        const first = target.querySelector<HTMLElement>('#key-a')!;
        if (bare) expect(first).not.toHaveAttribute('tabindex');
        else expect(first).toHaveAttribute('tabindex', initial ? '0' : '-1');
        const component = hydrate(KeyboardTest, { target, props, recover: false });
        try {
            flushSync();
            expect(target.querySelector('#key-a')).toBe(first);
            if (bare) expect(first).not.toHaveAttribute('tabindex');
            else expect(first).toHaveAttribute('tabindex', '0');
            expect(component.readRef()).toBe(target.querySelector('#key-c'));
            await fireEvent.keyDown(first, { key: 'End' });
            if (bare) {
                expect(target.querySelector('#key-c')).not.toHaveFocus();
                expect(target.querySelector('#key-c')).not.toHaveAttribute('tabindex');
            } else {
                expect(target.querySelector('#key-c')).toHaveFocus();
                expect(target.querySelector('#key-c')).toHaveAttribute('aria-selected', 'true');
            }
        } finally {
            await unmount(component);
            expect(component.readRef()).toBeNull();
            target.remove();
        }
    },
    20000
);
