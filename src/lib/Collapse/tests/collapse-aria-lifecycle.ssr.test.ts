import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import LifecycleTest from './collapse-aria-lifecycle-test.svelte';

describe('collapseAria SSR', () => {
    it('does not provide ARIA attributes without explicit markup', () => {
        const { body } = render(LifecycleTest, { props: { target: 'panel', expanded: true } });
        expect(body).not.toContain('aria-controls');
        expect(body).not.toContain('aria-expanded');
    });
});
