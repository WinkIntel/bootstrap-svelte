import { render } from 'svelte/server';
import { expect, it } from 'vitest';
import Page from './+page.svelte';

it('renders the nested Scrollspy demo as navigation landmarks rather than invalid lists', () => {
    const html = render(Page).body;
    expect(html).toMatch(/<nav\b[^>]*id="navbar-example3"/);
    expect(html).not.toMatch(/<ul\b[^>]*id="navbar-example3"/);
    expect(html.match(/<nav\b[^>]*class="[^"]*ms-3/g)).toHaveLength(2);
});
