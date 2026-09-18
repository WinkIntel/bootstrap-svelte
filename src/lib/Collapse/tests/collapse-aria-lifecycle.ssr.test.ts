import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import LifecycleTest from './collapse-aria-lifecycle-test.svelte';

describe('collapseAria SSR', () => {
    it('does not provide ARIA attributes without explicit markup', () => {
        const { body } = render(LifecycleTest, { props: { target: 'panel', expanded: true } });
        expect(body).not.toContain('aria-controls');
        expect(body).not.toContain('aria-expanded');
    });

    it('preserves explicitly rendered attributes before the attachment runs in the browser', () => {
        const { body } = render(LifecycleTest, {
            props: { consumerControls: 'consumer-panel', consumerExpanded: 'false', expanded: true }
        });
        expect(body).toContain('aria-controls="consumer-panel"');
        expect(body).toContain('aria-expanded="false"');
    });
});
