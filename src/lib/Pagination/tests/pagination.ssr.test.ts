import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Fixture from './pagination-selection-test.svelte';

describe('Pagination declarative SSR', () => {
    test.each([false, true])('retains declarative active flags before interaction (stateful=%s)', (isStateful) => {
        const { body } = render(Fixture, { props: { multiple: true, isStateful } });
        // Two declarations in the first root and one in the independent root.
        expect(body.match(/class="page-item active"/g)).toHaveLength(3);
        expect(body.match(/aria-current="page"/g)).toHaveLength(3);
    });
});
