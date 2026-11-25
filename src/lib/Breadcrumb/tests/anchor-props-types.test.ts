import { expectTypeOf, it } from 'vitest';
import type { Breadcrumb } from '$lib/index.js';

it('keeps href on Breadcrumb.Item rather than anchorProps', () => {
    expectTypeOf<NonNullable<Breadcrumb.ItemProps['anchorProps']>>().not.toHaveProperty('href');
    expectTypeOf<Breadcrumb.ItemProps>().toHaveProperty('href');
});
