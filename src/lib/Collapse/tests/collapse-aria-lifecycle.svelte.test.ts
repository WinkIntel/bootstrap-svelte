import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { collapseAria } from '../collapse-aria-attachment.svelte.js';
import LifecycleTest from './collapse-aria-lifecycle-test.svelte';

describe('collapseAria attribute ownership', () => {
    it.each(['button', 'div'])('restores consumer attributes through cleanup and reattachment on %s', (tag) => {
        const element = document.createElement(tag);
        element.setAttribute('aria-controls', 'consumer-panel');
        element.setAttribute('aria-expanded', 'false');
        element.setAttribute('role', 'button');
        const cleanup = collapseAria({ ariaControls: 'attachment-panel', ariaExpanded: true })(element);
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('aria-expanded', 'true');
        cleanup?.();
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('aria-expanded', 'false');
        expect(element).toHaveAttribute('role', 'button');
        const nextCleanup = collapseAria({ ariaControls: 'next-panel', ariaExpanded: false })(element);
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        nextCleanup?.();
        expect(element).toHaveAttribute('aria-expanded', 'false');
        expect(element).toHaveAttribute('role', 'button');
    });

    it.each([false, true])('preserves later consumer values (pre-existing attributes: %s)', (preExisting) => {
        const element = document.createElement('div');
        if (preExisting) {
            element.setAttribute('aria-controls', 'original-panel');
            element.setAttribute('aria-expanded', 'false');
            element.setAttribute('role', 'button');
        }
        const cleanup = collapseAria({ ariaControls: 'attachment-panel', ariaExpanded: true })(element);
        element.setAttribute('aria-controls', 'consumer-panel');
        element.setAttribute('aria-expanded', 'false');
        element.setAttribute('role', 'tab');
        cleanup?.();
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('aria-expanded', 'false');
        expect(element).toHaveAttribute('role', 'tab');
    });

    it('does not resurrect attributes removed by the consumer', () => {
        const element = document.createElement('div');
        element.setAttribute('aria-expanded', 'false');
        const cleanup = collapseAria({ ariaControls: 'panel', ariaExpanded: true })(element);
        for (const name of ['aria-controls', 'aria-expanded', 'role']) element.removeAttribute(name);
        cleanup?.();
        for (const name of ['aria-controls', 'aria-expanded', 'role']) expect(element).not.toHaveAttribute(name);
    });

    it('uses the final DOM value to determine ownership, including identical later writes', () => {
        const element = document.createElement('div');
        element.setAttribute('aria-expanded', 'false');
        const cleanup = collapseAria({ ariaControls: 'panel', ariaExpanded: true })(element);
        element.setAttribute('aria-controls', 'panel');
        element.setAttribute('aria-expanded', 'true');
        element.setAttribute('role', 'button');
        cleanup?.();
        expect(element).not.toHaveAttribute('aria-controls');
        expect(element).toHaveAttribute('aria-expanded', 'false');
        expect(element).not.toHaveAttribute('role');
    });

    it('restores empty pre-existing attributes without treating them as absent', () => {
        const element = document.createElement('div');
        for (const name of ['aria-controls', 'aria-expanded', 'role']) element.setAttribute(name, '');
        const cleanup = collapseAria({ ariaControls: 'panel', ariaExpanded: true })(element);
        cleanup?.();
        for (const name of ['aria-controls', 'aria-expanded', 'role']) expect(element).toHaveAttribute(name, '');
    });

    it('updates attachment-owned targets and expansion, then removes only the attachment', async () => {
        const { rerender } = render(LifecycleTest);
        const element = screen.getByTestId('control');
        expect(element).toHaveAttribute('aria-controls', 'panel-one');
        expect(element).toHaveAttribute('aria-expanded', 'false');
        await rerender({ target: 'panel-two', expanded: true });
        expect(screen.getByTestId('control')).toBe(element);
        expect(element).toHaveAttribute('aria-controls', 'panel-two');
        expect(element).toHaveAttribute('aria-expanded', 'true');
        await rerender({ enabled: false });
        expect(screen.getByTestId('control')).toBe(element);
        expect(element).not.toHaveAttribute('aria-controls');
        expect(element).not.toHaveAttribute('aria-expanded');
    });

    it('preserves consumer overrides and restores expanded state across reactive reattachments', async () => {
        const { rerender } = render(LifecycleTest, {
            consumerControls: 'consumer-panel',
            consumerExpanded: 'false',
            consumerRole: 'button',
            expanded: true
        });
        const element = screen.getByTestId('control');
        await rerender({ target: 'panel-two', expanded: false });
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('role', 'button');
        expect(element).toHaveAttribute('aria-expanded', 'false');
        await rerender({ expanded: true });
        expect(element).toHaveAttribute('aria-expanded', 'true');
        await rerender({ enabled: false });
        expect(screen.getByTestId('control')).toBe(element);
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('role', 'button');
        expect(element).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps a reactive consumer override after removal and re-enabling', async () => {
        const { rerender } = render(LifecycleTest, { expanded: true });
        const element = screen.getByTestId('control');
        await rerender({ consumerControls: 'consumer-panel', consumerExpanded: 'false', consumerRole: 'button' });
        await rerender({ enabled: false });
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('aria-expanded', 'false');
        expect(element).toHaveAttribute('role', 'button');
        await rerender({ enabled: true, target: 'panel-two', expanded: true });
        expect(element).toHaveAttribute('aria-controls', 'consumer-panel');
        expect(element).toHaveAttribute('aria-expanded', 'true');
        await rerender({ enabled: false });
        expect(element).toHaveAttribute('aria-expanded', 'false');
    });
});
