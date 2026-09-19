import { svelte } from '@sveltejs/vite-plugin-svelte';
import { flushSync, hydrate, unmount } from 'svelte';
import { createServer } from 'vite';
import { expect, it } from 'vitest';
import LifecycleTest from './collapse-aria-lifecycle-test.svelte';

it('preserves server-rendered consumer ARIA through hydration and attachment cleanup', async () => {
    const server = await createServer({
        configFile: false,
        plugins: [svelte({ configFile: false })],
        server: { middlewareMode: true, hmr: false },
        appType: 'custom'
    });
    const props = { consumerControls: 'consumer-panel', consumerExpanded: 'false' as const, expanded: true };
    let body: string;
    try {
        const { default: ServerFixture } = await server.ssrLoadModule('/src/lib/Collapse/tests/collapse-aria-lifecycle-test.svelte');
        const { render: renderServer } = await server.ssrLoadModule('svelte/server');
        body = renderServer(ServerFixture, { props }).body;
    } finally {
        await server.close();
    }
    const target = document.createElement('div');
    target.innerHTML = body;
    document.body.appendChild(target);
    const element = target.querySelector('button')!;
    expect(element).toHaveAttribute('aria-expanded', 'false');
    const component = hydrate(LifecycleTest, { target, props, recover: false });
    try {
        flushSync();
        expect(target.querySelector('button')).toBe(element);
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('aria-expanded', 'true');
        flushSync(() => component.disableAttachment());
        expect(target.querySelector('button')).toBe(element);
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('aria-expanded', 'false');
    } finally {
        await unmount(component);
        target.remove();
    }
}, 15000);
