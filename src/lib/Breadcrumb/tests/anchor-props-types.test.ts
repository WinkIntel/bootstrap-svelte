import { expectTypeOf, it } from 'vitest';
import type { Breadcrumb } from '$lib/index.js';

// These assertions and expected errors are enforced by pnpm check-types, not Vitest's runtime.
it('keeps anchor props limited to forwarded HTML attributes', () => {
    type AnchorProps = NonNullable<Breadcrumb.ItemProps['anchorProps']>;
    expectTypeOf<AnchorProps>().not.toHaveProperty('href');
    expectTypeOf<AnchorProps>().not.toHaveProperty('elementRef');
    expectTypeOf<AnchorProps>().not.toHaveProperty('children');
    expectTypeOf<Breadcrumb.ItemProps>().toHaveProperty('href');

    // @ts-expect-error The destination belongs to the top-level item prop.
    const href: AnchorProps = { href: '/library' };
    // @ts-expect-error A spread cannot provide a bindable reference to the anchor.
    const elementRef: AnchorProps = { elementRef: null };
    // @ts-expect-error The item owns its content; the anchor prop bag cannot replace it.
    const children: AnchorProps = { children: undefined };
    void href;
    void elementRef;
    void children;
});
