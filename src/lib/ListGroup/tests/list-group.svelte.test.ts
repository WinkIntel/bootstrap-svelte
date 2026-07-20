import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import { ListGroup } from '../index.js';
import ListGroupBasicTest from './list-group-basic-test.svelte';

describe('ListGroup Component', () => {
    it('should render basic list group with items', async () => {
        render(ListGroupBasicTest);

        // Check if basic list group components are rendered
        const listGroup = screen.getByTestId('basic-list-group');
        expect(listGroup).toHaveClass('list-group');
        expect(listGroup.tagName).toBe('UL');

        // Check for list group items
        const activeItem = screen.getByTestId('list-group-item-2');
        expect(activeItem).toHaveClass('list-group-item');
        expect(activeItem).toHaveClass('active');

        // Check if we have the right number of items
        const items = listGroup.querySelectorAll('.list-group-item');
        expect(items.length).toBe(5);
    });

    it('should render list group with different styles (flush, numbered)', () => {
        render(ListGroupBasicTest);

        // Flush list group
        const flushListGroup = screen.getByTestId('list-group-flush');
        expect(flushListGroup).toHaveClass('list-group');
        expect(flushListGroup).toHaveClass('list-group-flush');

        // Numbered list group (should use ol element)
        const numberedListGroup = screen.getByTestId('list-group-numbered');
        expect(numberedListGroup).toHaveClass('list-group');
        expect(numberedListGroup).toHaveClass('list-group-numbered');
        expect(numberedListGroup.tagName).toBe('OL');
    });

    it('should render combined flush and numbered list group correctly', () => {
        render(ListGroupBasicTest);

        const combinedListGroup = screen.getByTestId('list-group-combined');
        expect(combinedListGroup).toHaveClass('list-group');
        expect(combinedListGroup).toHaveClass('list-group-flush');
        expect(combinedListGroup).toHaveClass('list-group-numbered');
        expect(combinedListGroup.tagName).toBe('OL');
    });

    it('should render horizontal list groups with different breakpoints', () => {
        render(ListGroupBasicTest);

        // Horizontal on all breakpoints (xs)
        const horizontalXsListGroup = screen.getByTestId('list-group-horizontal-xs');
        expect(horizontalXsListGroup).toHaveClass('list-group');
        expect(horizontalXsListGroup).toHaveClass('list-group-horizontal');

        // Horizontal on md and up
        const horizontalMdListGroup = screen.getByTestId('list-group-horizontal-md');
        expect(horizontalMdListGroup).toHaveClass('list-group');
        expect(horizontalMdListGroup).toHaveClass('list-group-horizontal-md');
    });

    it('should render list group items with different color variants', () => {
        render(ListGroupBasicTest);

        // Test each color variant
        const colorVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

        colorVariants.forEach((variant) => {
            const item = screen.getByTestId(`list-group-item-${variant}`);
            expect(item).toHaveClass('list-group-item');
            expect(item).toHaveClass(`list-group-item-${variant}`);
        });
    });

    it('should render active items with color variants correctly', () => {
        render(ListGroupBasicTest);

        // Active primary item
        const activePrimaryItem = screen.getByTestId('list-group-item-active-primary');
        expect(activePrimaryItem).toHaveClass('list-group-item');
        expect(activePrimaryItem).toHaveClass('list-group-item-primary');
        expect(activePrimaryItem).toHaveClass('active');

        // Active success item
        const activeSuccessItem = screen.getByTestId('list-group-item-active-success');
        expect(activeSuccessItem).toHaveClass('list-group-item');
        expect(activeSuccessItem).toHaveClass('list-group-item-success');
        expect(activeSuccessItem).toHaveClass('active');
    });

    it('should render action items correctly', () => {
        render(ListGroupBasicTest);

        // Check the list group with actions
        const actionListGroup = screen.getByTestId('list-group-action');
        expect(actionListGroup).toHaveClass('list-group');

        // Active link item
        const activeLinkItem = screen.getByTestId('list-group-action-1');
        expect(activeLinkItem).toHaveClass('list-group-item');
        expect(activeLinkItem).toHaveClass('list-group-item-action');
        expect(activeLinkItem).toHaveClass('active');
        expect(activeLinkItem.tagName).toBe('A');
        expect(activeLinkItem).toHaveAttribute('id');
        expect(activeLinkItem.id).toMatch(/^list-group-item-action-/);

        // Normal link item
        const normalLinkItem = screen.getByTestId('list-group-action-2');
        expect(normalLinkItem).toHaveClass('list-group-item');
        expect(normalLinkItem).toHaveClass('list-group-item-action');
        expect(normalLinkItem.tagName).toBe('A');
        expect(normalLinkItem).toHaveAttribute('id', 'custom-list-group-action-id');

        // Disabled link item
        const disabledLinkItem = screen.getByTestId('list-group-action-3');
        expect(disabledLinkItem).toHaveClass('list-group-item');
        expect(disabledLinkItem).toHaveClass('list-group-item-action');
        expect(disabledLinkItem).toHaveClass('disabled');
        expect(disabledLinkItem.tagName).toBe('A');
        expect(disabledLinkItem).toHaveAttribute('aria-disabled', 'true');

        // Button item
        const buttonItem = screen.getByTestId('list-group-action-4');
        expect(buttonItem).toHaveClass('list-group-item');
        expect(buttonItem).toHaveClass('list-group-item-action');
        expect(buttonItem.tagName).toBe('BUTTON');

        // Disabled button item
        const disabledButtonItem = screen.getByTestId('list-group-action-5');
        expect(disabledButtonItem).toHaveClass('list-group-item');
        expect(disabledButtonItem).toHaveClass('list-group-item-action');
        expect(disabledButtonItem).toHaveClass('disabled');
        expect(disabledButtonItem.tagName).toBe('BUTTON');
        expect(disabledButtonItem).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render list group with badges correctly', () => {
        render(ListGroupBasicTest);

        const listGroupWithBadges = screen.getByTestId('list-group-badges');
        expect(listGroupWithBadges).toHaveClass('list-group');

        // Check first item with badge
        const itemWithBadge1 = screen.getByTestId('list-group-badge-item-1');
        expect(itemWithBadge1).toHaveClass('list-group-item');
        expect(itemWithBadge1).toHaveClass('d-flex');
        expect(itemWithBadge1).toHaveClass('justify-content-between');

        // Check badge
        const badge1 = screen.getByTestId('badge-1');
        expect(badge1).toHaveClass('badge');
        expect(badge1).toHaveClass('rounded-pill');
        expect(badge1.textContent).toBe('14');

        // Check second item with badge
        const badge2 = screen.getByTestId('badge-2');
        expect(badge2.textContent).toBe('2');
    });

    it('should render list group with custom content correctly', () => {
        render(ListGroupBasicTest);

        const listGroupWithCustomContent = screen.getByTestId('list-group-custom-content');
        expect(listGroupWithCustomContent).toHaveClass('list-group');

        // Check custom content item
        const customContentItem = screen.getByTestId('list-group-custom-item-1');
        expect(customContentItem).toHaveClass('list-group-item');
        expect(customContentItem).toHaveClass('list-group-item-action');
        expect(customContentItem).toHaveClass('active');

        // Check if custom content is rendered
        const paragraph = screen.getByTestId('custom-content-paragraph');
        expect(paragraph).toBeInTheDocument();
        expect(paragraph.textContent).toBe('Some placeholder content in a paragraph.');

        // Check for heading and small text
        expect(customContentItem.querySelector('h5')).toBeInTheDocument();
        expect(customContentItem.querySelectorAll('small').length).toBe(2);
    });

    it('should render list group with form elements correctly', () => {
        render(ListGroupBasicTest);

        const listGroupWithFormElements = screen.getByTestId('list-group-form-elements');
        expect(listGroupWithFormElements).toHaveClass('list-group');

        // Check checkbox item
        const checkboxItem = screen.getByTestId('list-group-checkbox-item');
        expect(checkboxItem).toHaveClass('list-group-item');

        const checkbox = screen.getByTestId('checkbox-input');
        expect(checkbox).toHaveAttribute('type', 'checkbox');
        expect(checkbox).toHaveClass('form-check-input');

        // Check radio item
        const radioItem = screen.getByTestId('list-group-radio-item');
        expect(radioItem).toHaveClass('list-group-item');

        const radio = screen.getByTestId('radio-input');
        expect(radio).toHaveAttribute('type', 'radio');
        expect(radio).toHaveClass('form-check-input');
    });

    it('keeps disabled empty-href anchors inert without a navigable href', () => {
        const onclick = vi.fn();
        const { container } = render(ListGroup.ItemAction, {
            props: {
                href: '',
                isDisabled: true,
                onclick,
                'aria-disabled': 'false',
                tabindex: 4,
                type: 'text/html',
                children: createRawSnippet(() => ({ render: () => 'Disabled action' }))
            }
        });

        const action = container.querySelector<HTMLAnchorElement>('a');
        expect(action).not.toBeNull();
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        action?.dispatchEvent(event);

        expect(action?.tagName).toBe('A');
        expect(action).not.toHaveAttribute('href');
        expect(action).toHaveAttribute('aria-disabled', 'true');
        expect(action).toHaveAttribute('tabindex', '-1');
        expect(action).toHaveAttribute('type', 'text/html');
        expect(event.defaultPrevented).toBe(true);
        expect(onclick).not.toHaveBeenCalled();
    });

    it('rerenders between button and empty-href anchor without stale attributes', async () => {
        const children = createRawSnippet(() => ({ render: () => 'Polymorphic action' }));
        const { container, rerender } = render(ListGroup.ItemAction, { props: { children } });

        expect(container.querySelector('button')).toHaveAttribute('type', 'button');

        await rerender({ children, href: '' });
        const anchor = container.querySelector('a');
        expect(anchor).toHaveAttribute('href', '');
        expect(anchor).not.toHaveAttribute('type');

        await rerender({ children, href: undefined });
        const button = container.querySelector('button');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).not.toHaveAttribute('href');
    });

    it('uses native disabled button behavior while enabled actions retain their handlers', () => {
        const disabledOnclick = vi.fn();
        const enabledOnclick = vi.fn();
        const { unmount } = render(ListGroup.ItemAction, {
            props: { isDisabled: true, onclick: disabledOnclick, role: 'menuitem', tabindex: 4, type: 'submit' }
        });

        const disabledAction = screen.getByRole('menuitem');
        disabledAction.click();
        expect(disabledAction).toBeDisabled();
        expect(disabledAction).toHaveAttribute('type', 'button');
        expect(disabledAction).toHaveAttribute('tabindex', '-1');
        expect(disabledAction).toHaveAttribute('role', 'menuitem');
        expect(disabledOnclick).not.toHaveBeenCalled();

        unmount();
        render(ListGroup.ItemAction, { props: { onclick: enabledOnclick } });
        screen.getByRole('button').click();
        expect(enabledOnclick).toHaveBeenCalledTimes(1);
    });
});
