import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import NavPlayground from './NavPlayground.svelte';

it('keeps the playground preview and generated markup valid when switching list and nav elements', async () => {
    const { container } = render(NavPlayground);
    const element = screen.getByLabelText('Element Type');
    await fireEvent.change(element, { target: { value: 'nav' } });
    const nav = container.querySelector('nav.nav');
    expect(nav).not.toBeNull();
    expect(nav?.querySelectorAll('li')).toHaveLength(0);
    expect(nav?.querySelectorAll(':scope > a')).toHaveLength(3);
    expect(container.querySelector('pre')?.textContent).not.toContain('<Nav.Item>');

    await fireEvent.change(screen.getByLabelText('Item Style'), { target: { value: 'tabs' } });
    expect(nav).not.toHaveAttribute('role');
    expect(nav).toHaveClass('nav-tabs');

    await fireEvent.change(element, { target: { value: 'ol' } });
    const list = container.querySelector('ol.nav');
    expect(list?.querySelectorAll(':scope > li')).toHaveLength(3);
    expect(list).not.toHaveAttribute('role');
    expect(container.querySelector('pre')?.textContent).toContain('<Nav.Item>');
});
