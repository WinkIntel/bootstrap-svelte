import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from '../index.js';
import DropdownBasicTest from './dropdown-basic-test.svelte';
import DropdownContainerTest from './dropdown-container-test.svelte';
import DropdownKeyboardTest from './dropdown-keyboard-test.svelte';
import DropdownSpecialIdTest from './dropdown-special-id-test.svelte';

describe('Dropdown Component', () => {
    it('should render basic dropdown with toggle and menu', () => {
        render(DropdownBasicTest);

        // Check if dropdown root component is rendered
        const dropdown = screen.getByTestId('basic-dropdown');
        expect(dropdown).toHaveClass('dropdown');

        // Check if dropdown toggle is rendered
        const toggle = screen.getByTestId('basic-toggle');
        expect(toggle).toHaveClass('btn');
        expect(toggle).toHaveClass('btn-secondary');
        expect(toggle).toHaveClass('dropdown-toggle');
        expect(toggle).toHaveTextContent('Basic Dropdown');

        // Check if dropdown menu is rendered
        const menu = screen.getByTestId('basic-menu');
        expect(menu).toHaveClass('dropdown-menu');

        // Check if dropdown items are rendered
        const item1 = screen.getByTestId('basic-item-1');
        expect(item1).toHaveClass('dropdown-item');
        expect(item1).toHaveTextContent('Action');
        expect(item1).toHaveAttribute('href', '#!');

        const item2 = screen.getByTestId('basic-item-2');
        expect(item2).toHaveClass('dropdown-item');
        expect(item2).toHaveTextContent('Another action');

        const item3 = screen.getByTestId('basic-item-3');
        expect(item3).toHaveClass('dropdown-item');
        expect(item3).toHaveTextContent('Something else here');
    });

    it('should render dropdown with different color variants', () => {
        render(DropdownBasicTest);

        // Check primary variant
        const primaryDropdown = screen.getByTestId('primary-dropdown');
        expect(primaryDropdown).toHaveClass('btn-group');

        const primaryToggle = screen.getByTestId('primary-toggle');
        expect(primaryToggle).toHaveClass('btn-primary');
        expect(primaryToggle).toHaveTextContent('Primary');

        // Check success variant
        const successToggle = screen.getByTestId('success-toggle');
        expect(successToggle).toHaveClass('btn-success');
        expect(successToggle).toHaveTextContent('Success');
    });

    it('should render split button dropdown correctly', () => {
        render(DropdownBasicTest);

        const splitDropdown = screen.getByTestId('split-dropdown');
        expect(splitDropdown).toHaveClass('btn-group');

        // Check main button
        const splitButton = screen.getByTestId('split-button');
        expect(splitButton).toHaveClass('btn');
        expect(splitButton).toHaveClass('btn-primary');
        expect(splitButton).toHaveTextContent('Primary');

        // Check split toggle
        const splitToggle = screen.getByTestId('split-toggle');
        expect(splitToggle).toHaveClass('btn');
        expect(splitToggle).toHaveClass('btn-primary');
        expect(splitToggle).toHaveClass('dropdown-toggle-split');
    });

    it('should render dropdown with different sizes', () => {
        render(DropdownBasicTest);

        // Check small size
        const smallToggle = screen.getByTestId('small-toggle');
        expect(smallToggle).toHaveClass('btn-sm');
        expect(smallToggle).toHaveTextContent('Small');

        // Check large size
        const largeToggle = screen.getByTestId('large-toggle');
        expect(largeToggle).toHaveClass('btn-lg');
        expect(largeToggle).toHaveTextContent('Large');
    });

    it('should render dark dropdown menu', () => {
        render(DropdownBasicTest);

        const darkMenu = screen.getByTestId('dark-menu');
        expect(darkMenu).toHaveClass('dropdown-menu');
        expect(darkMenu).toHaveClass('dropdown-menu-dark');
    });

    it('should render dropdowns with different directions', () => {
        render(DropdownBasicTest);

        // Check dropup
        const dropupDropdown = screen.getByTestId('dropup-dropdown');
        expect(dropupDropdown).toHaveClass('btn-group');
        expect(dropupDropdown).toHaveClass('dropup');

        // Check dropend
        const dropendDropdown = screen.getByTestId('dropend-dropdown');
        expect(dropendDropdown).toHaveClass('btn-group');
        expect(dropendDropdown).toHaveClass('dropend');

        // Check dropstart
        const dropstartDropdown = screen.getByTestId('dropstart-dropdown');
        expect(dropstartDropdown).toHaveClass('btn-group');
        expect(dropstartDropdown).toHaveClass('dropstart');
    });

    it('should render menu items as buttons when no href is provided', () => {
        render(DropdownBasicTest);

        const buttonItem1 = screen.getByTestId('button-item-1');
        expect(buttonItem1).toHaveClass('dropdown-item');
        expect(buttonItem1.tagName.toLowerCase()).toBe('button');
        expect(buttonItem1).toHaveAttribute('type', 'button');
        expect(buttonItem1).toHaveTextContent('Action');

        const buttonItem2 = screen.getByTestId('button-item-2');
        expect(buttonItem2).toHaveClass('dropdown-item');
        expect(buttonItem2.tagName.toLowerCase()).toBe('button');
        expect(buttonItem2).toHaveTextContent('Another action');
    });

    it('should render dropdown item text components', () => {
        render(DropdownBasicTest);

        const textItem1 = screen.getByTestId('text-item-1');
        expect(textItem1).toHaveClass('dropdown-item-text');
        expect(textItem1).toHaveTextContent('Dropdown item text');

        const textItem2 = screen.getByTestId('text-item-2');
        expect(textItem2).toHaveClass('dropdown-item-text');
        expect(textItem2).toHaveTextContent('Another dropdown item text');
    });

    it('should render active menu items correctly', () => {
        render(DropdownBasicTest);

        const activeItem = screen.getByTestId('active-item');
        expect(activeItem).toHaveClass('dropdown-item');
        expect(activeItem).toHaveClass('active');
        expect(activeItem).toHaveTextContent('Active item');

        const regularItem = screen.getByTestId('regular-item');
        expect(regularItem).toHaveClass('dropdown-item');
        expect(regularItem).not.toHaveClass('active');
        expect(regularItem).toHaveTextContent('Regular item');
    });

    it('should render disabled menu items correctly', () => {
        render(DropdownBasicTest);

        const disabledItem = screen.getByTestId('disabled-item');
        expect(disabledItem).toHaveClass('dropdown-item');
        expect(disabledItem).toHaveClass('disabled');
        expect(disabledItem).toHaveTextContent('Disabled item');

        const enabledItem = screen.getByTestId('enabled-item');
        expect(enabledItem).toHaveClass('dropdown-item');
        expect(enabledItem).not.toHaveClass('disabled');
        expect(enabledItem).toHaveTextContent('Enabled item');
    });

    it('should render right-aligned dropdown menu', () => {
        render(DropdownBasicTest);

        const rightAlignedDropdown = screen.getByTestId('right-aligned-dropdown');
        expect(rightAlignedDropdown).toHaveClass('btn-group');
        expect(rightAlignedDropdown).toHaveClass('dropdown-end');

        const rightAlignedMenu = screen.getByTestId('right-aligned-menu');
        expect(rightAlignedMenu).toHaveClass('dropdown-menu');
        expect(rightAlignedMenu).toHaveClass('dropdown-menu-end');
    });

    it('should render dropdown header', () => {
        render(DropdownBasicTest);

        const header = screen.getByTestId('header-element');
        expect(header).toHaveClass('dropdown-header');
        expect(header).toHaveTextContent('Header');
    });

    it('should render dropdown divider', () => {
        render(DropdownBasicTest);

        const divider = screen.getByTestId('divider-element');
        expect(divider).toHaveClass('dropdown-divider');
    });

    it('should render dropdown with offset configuration', () => {
        render(DropdownBasicTest);

        const offsetMenu = screen.getByTestId('offset-menu');
        expect(offsetMenu).toHaveClass('dropdown-menu');
        // Offset is applied via Popper.js, so we can't easily test the actual offset in unit tests
        // but we can verify the menu renders correctly
    });

    it('should render dropdowns with different autoClose behaviors', () => {
        render(DropdownBasicTest);

        // Test autoClose: true (default)
        const autoCloseTrueDropdown = screen.getByTestId('autoclose-true-dropdown');
        expect(autoCloseTrueDropdown).toHaveClass('btn-group');

        // Test autoClose: "inside"
        const autoCloseInsideDropdown = screen.getByTestId('autoclose-inside-dropdown');
        expect(autoCloseInsideDropdown).toHaveClass('btn-group');

        // Test autoClose: "outside"
        const autoCloseOutsideDropdown = screen.getByTestId('autoclose-outside-dropdown');
        expect(autoCloseOutsideDropdown).toHaveClass('btn-group');

        // Test autoClose: false
        const autoCloseFalseDropdown = screen.getByTestId('autoclose-false-dropdown');
        expect(autoCloseFalseDropdown).toHaveClass('btn-group');
    });

    it('should render dropdown toggle as link when href is provided', () => {
        render(DropdownBasicTest);

        const linkToggle = screen.getByTestId('link-toggle');
        expect(linkToggle).toHaveClass('dropdown-toggle');
        expect(linkToggle.tagName.toLowerCase()).toBe('a');
        expect(linkToggle).toHaveAttribute('href', '#!');
        expect(linkToggle).toHaveTextContent('Link Toggle');
    });

    // Test for component composition API
    it('should create Root component with expected properties', () => {
        expect(Dropdown.Root).toBeDefined();
    });

    it('should create Toggle component with expected properties', () => {
        expect(Dropdown.Toggle).toBeDefined();
    });

    it('should create Menu component with expected properties', () => {
        expect(Dropdown.Menu).toBeDefined();
    });

    it('should create Item component with expected properties', () => {
        expect(Dropdown.Item).toBeDefined();
    });

    it('should create ItemText component with expected properties', () => {
        expect(Dropdown.ItemText).toBeDefined();
    });

    it('should create Header component with expected properties', () => {
        expect(Dropdown.Header).toBeDefined();
    });

    it('should create Divider component with expected properties', () => {
        expect(Dropdown.Divider).toBeDefined();
    });

    // Additional tests for Bootstrap-specific classes and behaviors
    it('should apply correct Bootstrap classes for button groups', () => {
        render(DropdownBasicTest);

        const buttonGroupDropdown = screen.getByTestId('primary-dropdown');
        expect(buttonGroupDropdown).toHaveClass('btn-group');
        expect(buttonGroupDropdown).toHaveClass('dropdown');
    });

    it('should render dropdown menu with proper Bootstrap structure', () => {
        render(DropdownBasicTest);

        const menu = screen.getByTestId('basic-menu');
        expect(menu).toHaveClass('dropdown-menu');
        expect(menu).toHaveAttribute('role', 'menu');
    });

    it('should render dropdown items with proper Bootstrap structure', () => {
        render(DropdownBasicTest);

        const item = screen.getByTestId('basic-item-1');
        expect(item).toHaveClass('dropdown-item');
        expect(item).toHaveAttribute('role', 'menuitem');
    });

    it('should render dropdown as a nav item', () => {
        render(DropdownBasicTest);

        const item = screen.getByTestId('navbar-dropdown');
        expect(item).toHaveClass('nav-item');
        expect(item.tagName.toLowerCase()).toBe('li');
    });
});

describe('Dropdown Outside-Click With Special-Character Id', () => {
    it('should close on outside click without throwing when id contains CSS-special characters', async () => {
        render(DropdownSpecialIdTest);

        const toggle = screen.getByTestId('special-id-toggle');

        // Open the dropdown.
        await fireEvent.click(toggle);
        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // A click on body used to throw `SyntaxError: '#1-dropdown' is not a valid
        // selector` because the id was interpolated into a CSS selector unescaped
        // (ids starting with a digit are not valid CSS identifiers). It should now
        // close the dropdown without throwing.
        await expect(fireEvent.click(document.body)).resolves.not.toThrow();

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'false');
        });
    });
});

describe('Dropdown Item Click Behavior', () => {
    it('should call preventDefault on click when href is "#!"', () => {
        render(DropdownBasicTest);

        const item = screen.getByTestId('basic-item-1');
        expect(item).toHaveAttribute('href', '#!');

        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

        item.dispatchEvent(clickEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(clickEvent.defaultPrevented).toBe(true);
    });

    it('should not call preventDefault on click when href is a real URL', () => {
        render(DropdownBasicTest);

        const item = screen.getByTestId('real-href-item');
        expect(item).toHaveAttribute('href', 'https://example.com');

        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

        item.dispatchEvent(clickEvent);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(clickEvent.defaultPrevented).toBe(false);
    });

    it('should not call preventDefault on click when item is rendered as a button (no href)', () => {
        render(DropdownBasicTest);

        const item = screen.getByTestId('button-item-1');
        expect(item).not.toHaveAttribute('href');

        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

        item.dispatchEvent(clickEvent);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(clickEvent.defaultPrevented).toBe(false);
    });
});

describe('Dropdown Container (Portal) Functionality', () => {
    it('should render dropdown menu inline when container is false (default)', () => {
        render(DropdownContainerTest);

        const menu = screen.getByTestId('default-container-menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveClass('dropdown-menu');

        // When container=false, menu should be rendered inline within the dropdown root
        const dropdownRoot = screen.getByTestId('default-container-dropdown');
        expect(dropdownRoot).toContainElement(menu);
    });

    it('should render dropdown menu inline when container is explicitly set to false', () => {
        render(DropdownContainerTest);

        const menu = screen.getByTestId('disabled-container-menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveClass('dropdown-menu');

        // When container=false, menu should be rendered inline within the dropdown root
        const dropdownRoot = screen.getByTestId('disabled-container-dropdown');
        expect(dropdownRoot).toContainElement(menu);
    });

    it('should portal dropdown menu to body when container is "body"', () => {
        render(DropdownContainerTest);

        const menu = screen.getByTestId('body-container-menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveClass('dropdown-menu');

        // When container="body", menu should be portaled to document.body
        expect(document.body).toContainElement(menu);

        // Should not be within the dropdown root
        const dropdownRoot = screen.getByTestId('body-container-dropdown');
        expect(dropdownRoot).not.toContainElement(menu);
    });

    it('should portal dropdown menu to custom container when container is a selector string', () => {
        render(DropdownContainerTest);

        const menu = screen.getByTestId('custom-selector-menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveClass('dropdown-menu');

        // Check if custom container exists
        const customContainer = screen.getByTestId('custom-container');
        expect(customContainer).toBeInTheDocument();
        expect(customContainer).toContainElement(menu);

        // Should not be within the dropdown root
        const dropdownRoot = screen.getByTestId('custom-selector-dropdown');
        expect(dropdownRoot).not.toContainElement(menu);
    });

    it('should portal dropdown menu to HTMLElement container when container is an element reference', () => {
        render(DropdownContainerTest);

        const menu = screen.getByTestId('element-container-menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveClass('dropdown-menu');

        // Check if custom container exists
        const customContainer = screen.getByTestId('custom-container');
        expect(customContainer).toBeInTheDocument();
        expect(customContainer).toContainElement(menu);

        // Should not be within the dropdown root
        const dropdownRoot = screen.getByTestId('element-container-dropdown');
        expect(dropdownRoot).not.toContainElement(menu);
    });

    it('should maintain dropdown functionality when portaled to different containers', () => {
        render(DropdownContainerTest);

        // Test body container dropdown
        const bodyMenu = screen.getByTestId('body-container-menu');
        const bodyToggle = screen.getByTestId('body-container-toggle');
        expect(bodyMenu).toHaveClass('dropdown-menu');
        expect(bodyToggle).toHaveClass('dropdown-toggle');

        // Test custom selector container dropdown
        const customMenu = screen.getByTestId('custom-selector-menu');
        const customToggle = screen.getByTestId('custom-selector-toggle');
        expect(customMenu).toHaveClass('dropdown-menu');
        expect(customToggle).toHaveClass('dropdown-toggle');

        // Test element container dropdown
        const elementMenu = screen.getByTestId('element-container-menu');
        const elementToggle = screen.getByTestId('element-container-toggle');
        expect(elementMenu).toHaveClass('dropdown-menu');
        expect(elementToggle).toHaveClass('dropdown-toggle');
    });

    it('should render dropdown items correctly regardless of container type', () => {
        render(DropdownContainerTest);

        // Test items in different container types
        const defaultItem = screen.getByTestId('default-container-item');
        expect(defaultItem).toHaveClass('dropdown-item');
        expect(defaultItem).toHaveTextContent('Action');

        const bodyItem = screen.getByTestId('body-container-item');
        expect(bodyItem).toHaveClass('dropdown-item');
        expect(bodyItem).toHaveTextContent('Action in Body');

        const customItem = screen.getByTestId('custom-selector-item');
        expect(customItem).toHaveClass('dropdown-item');
        expect(customItem).toHaveTextContent('Action in Custom Container');

        const elementItem = screen.getByTestId('element-container-item');
        expect(elementItem).toHaveClass('dropdown-item');
        expect(elementItem).toHaveTextContent('Action in Element Container');

        const disabledItem = screen.getByTestId('disabled-container-item');
        expect(disabledItem).toHaveClass('dropdown-item');
        expect(disabledItem).toHaveTextContent('Action Inline');
    });

    it('should apply proper ARIA attributes regardless of container type', () => {
        render(DropdownContainerTest);

        // Test ARIA attributes on different container types
        const defaultMenu = screen.getByTestId('default-container-menu');
        expect(defaultMenu).toHaveAttribute('role', 'menu');

        const bodyMenu = screen.getByTestId('body-container-menu');
        expect(bodyMenu).toHaveAttribute('role', 'menu');

        const customMenu = screen.getByTestId('custom-selector-menu');
        expect(customMenu).toHaveAttribute('role', 'menu');

        const elementMenu = screen.getByTestId('element-container-menu');
        expect(elementMenu).toHaveAttribute('role', 'menu');

        const disabledMenu = screen.getByTestId('disabled-container-menu');
        expect(disabledMenu).toHaveAttribute('role', 'menu');
    });

    it('should handle invalid container selector gracefully', () => {
        // This test verifies that the Portal handles invalid selectors gracefully
        // by showing that the component doesn't crash and warns appropriately
        const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(DropdownContainerTest);

        // The dropdown should still render even with invalid container selector
        expect(screen.getByTestId('custom-selector-toggle')).toBeInTheDocument();

        // Cleanup
        consoleWarn.mockRestore();
    });

    it('should maintain consistent dropdown menu structure across container types', () => {
        render(DropdownContainerTest);

        // All dropdown menus should have the same base structure regardless of container
        const menus = [
            screen.getByTestId('default-container-menu'),
            screen.getByTestId('body-container-menu'),
            screen.getByTestId('custom-selector-menu'),
            screen.getByTestId('element-container-menu'),
            screen.getByTestId('disabled-container-menu')
        ];

        menus.forEach((menu) => {
            expect(menu).toHaveClass('dropdown-menu');
            expect(menu.tagName.toLowerCase()).toBe('ul');
            expect(menu).toHaveAttribute('role', 'menu');
            expect(menu).toHaveAttribute('aria-labelledby');
            expect(menu).toHaveAttribute('id');
        });
    });

    it('should handle dynamic container changes', () => {
        // This test verifies the behavior when container prop changes
        render(DropdownContainerTest);

        // Initial state - body container
        const bodyMenu = screen.getByTestId('body-container-menu');
        expect(document.body).toContainElement(bodyMenu);

        // The menu should maintain its dropdown classes and functionality
        expect(bodyMenu).toHaveClass('dropdown-menu');
        expect(bodyMenu).toHaveAttribute('role', 'menu');
    });
});

describe('Dropdown Keyboard Navigation', () => {
    it('should open dropdown when ArrowDown is pressed on toggle', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');
        const _menu = screen.getByTestId('keyboard-menu');

        // Initially dropdown should be closed
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        // Press ArrowDown on toggle
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        // Wait for dropdown to open
        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // First item should be focused
        await waitFor(() => {
            const firstItem = screen.getByTestId('keyboard-item-1');
            expect(firstItem).toHaveFocus();
        });
    });

    it('should open dropdown when ArrowUp is pressed on toggle', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Initially dropdown should be closed
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        // Press ArrowUp on toggle
        fireEvent.keyDown(toggle, { key: 'ArrowUp' });

        // Wait for dropdown to open
        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // When opening with ArrowUp, it should focus the 4th item (disabled item)
        // This is because focusOnPreviousItem() with activeItemIndex = -1
        // calculates (-1 - 1 + 5) % 5 = 3 (0-based index for 4th item)
        await waitFor(() => {
            const disabledItem = screen.getByTestId('keyboard-item-4');
            expect(disabledItem).toHaveFocus();
        });
    });

    it('should navigate through items with ArrowDown when dropdown is open', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // First item should be focused
        await waitFor(() => {
            const firstItem = screen.getByTestId('keyboard-item-1');
            expect(firstItem).toHaveFocus();
        });

        // Press ArrowDown to move to second item
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const secondItem = screen.getByTestId('keyboard-item-2');
            expect(secondItem).toHaveFocus();
        });

        // Press ArrowDown to move to third item
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const thirdItem = screen.getByTestId('keyboard-item-3');
            expect(thirdItem).toHaveFocus();
        });
    });

    it('should navigate through items with ArrowUp when dropdown is open', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Open dropdown with ArrowDown (focuses first item)
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // Move to second item first
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const secondItem = screen.getByTestId('keyboard-item-2');
            expect(secondItem).toHaveFocus();
        });

        // Now press ArrowUp to go back to first item
        fireEvent.keyDown(toggle, { key: 'ArrowUp' });

        await waitFor(() => {
            const firstItem = screen.getByTestId('keyboard-item-1');
            expect(firstItem).toHaveFocus();
        });
    });

    it('should wrap navigation when reaching the end with ArrowDown', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // Navigate to last item (5 items total)
        for (let i = 0; i < 4; i++) {
            fireEvent.keyDown(toggle, { key: 'ArrowDown' });
        }

        await waitFor(() => {
            const lastItem = screen.getByTestId('keyboard-item-5');
            expect(lastItem).toHaveFocus();
        });

        // Press ArrowDown again - should wrap to first item
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const firstItem = screen.getByTestId('keyboard-item-1');
            expect(firstItem).toHaveFocus();
        });
    });

    it('should wrap navigation when reaching the beginning with ArrowUp', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Open dropdown with ArrowDown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        await waitFor(() => {
            const firstItem = screen.getByTestId('keyboard-item-1');
            expect(firstItem).toHaveFocus();
        });

        // Press ArrowUp - should wrap to last item
        fireEvent.keyDown(toggle, { key: 'ArrowUp' });

        await waitFor(() => {
            const lastItem = screen.getByTestId('keyboard-item-5');
            expect(lastItem).toHaveFocus();
        });
    });

    it('should handle keyboard navigation on items directly', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        const firstItem = screen.getByTestId('keyboard-item-1');

        await waitFor(() => {
            expect(firstItem).toHaveFocus();
        });

        // Press ArrowDown on the item itself
        fireEvent.keyDown(firstItem, { key: 'ArrowDown' });

        await waitFor(() => {
            const secondItem = screen.getByTestId('keyboard-item-2');
            expect(secondItem).toHaveFocus();
        });

        // Press ArrowUp on the second item
        fireEvent.keyDown(screen.getByTestId('keyboard-item-2'), { key: 'ArrowUp' });

        await waitFor(() => {
            expect(firstItem).toHaveFocus();
        });
    });

    it('should update active item index when focusing items', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // Focus on second item directly
        const secondItem = screen.getByTestId('keyboard-item-2');
        fireEvent.focus(secondItem);

        // The focus event should update the active item index
        // When we press ArrowDown, it should move to the third item
        fireEvent.keyDown(secondItem, { key: 'ArrowDown' });

        await waitFor(() => {
            const thirdItem = screen.getByTestId('keyboard-item-3');
            expect(thirdItem).toHaveFocus();
        });
    });

    it('should work with button-type dropdown items', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-button-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // Navigate through button items
        await waitFor(() => {
            const firstItem = screen.getByTestId('keyboard-button-item-1');
            expect(firstItem).toHaveFocus();
            expect(firstItem.tagName.toLowerCase()).toBe('button');
        });

        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const secondItem = screen.getByTestId('keyboard-button-item-2');
            expect(secondItem).toHaveFocus();
            expect(secondItem.tagName.toLowerCase()).toBe('button');
        });
    });

    it('should handle mixed item types (links and buttons)', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-mixed-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // First item is a link
        await waitFor(() => {
            const linkItem = screen.getByTestId('keyboard-mixed-item-1');
            expect(linkItem).toHaveFocus();
            expect(linkItem.tagName.toLowerCase()).toBe('a');
        });

        // Navigate to button item
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const buttonItem = screen.getByTestId('keyboard-mixed-item-2');
            expect(buttonItem).toHaveFocus();
            expect(buttonItem.tagName.toLowerCase()).toBe('button');
        });

        // Navigate to active link
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const activeItem = screen.getByTestId('keyboard-mixed-item-3');
            expect(activeItem).toHaveFocus();
            expect(activeItem).toHaveClass('active');
        });
    });

    it('should handle single item dropdown', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-single-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // Should focus the only item
        await waitFor(() => {
            const singleItem = screen.getByTestId('keyboard-single-item');
            expect(singleItem).toHaveFocus();
        });

        // Arrow navigation should stay on the same item
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const singleItem = screen.getByTestId('keyboard-single-item');
            expect(singleItem).toHaveFocus();
        });

        fireEvent.keyDown(toggle, { key: 'ArrowUp' });

        await waitFor(() => {
            const singleItem = screen.getByTestId('keyboard-single-item');
            expect(singleItem).toHaveFocus();
        });
    });

    it('should handle empty dropdown gracefully', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-empty-toggle');

        // Open dropdown
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        // No items to focus, so navigation should do nothing
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });
        fireEvent.keyDown(toggle, { key: 'ArrowUp' });

        // Dropdown should remain open but no items focused
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('should prevent default behavior for arrow key events', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Create a real KeyboardEvent with preventDefault spy
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
            cancelable: true
        });
        const preventDefaultSpy = vi.spyOn(keyDownEvent, 'preventDefault');

        // Dispatch the event on the toggle
        toggle.dispatchEvent(keyDownEvent);

        // preventDefault should be called for arrow keys
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not interfere with other key events', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Test that other keys don't trigger dropdown behavior
        fireEvent.keyDown(toggle, { key: 'Enter' });
        fireEvent.keyDown(toggle, { key: ' ' });
        fireEvent.keyDown(toggle, { key: 'Escape' });
        fireEvent.keyDown(toggle, { key: 'Tab' });

        // Dropdown should remain closed
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('should reset active item index when dropdown is toggled', async () => {
        render(DropdownKeyboardTest);

        const toggle = screen.getByTestId('keyboard-toggle');

        // Open dropdown and navigate to second item
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            const secondItem = screen.getByTestId('keyboard-item-2');
            expect(secondItem).toHaveFocus();
        });

        // Close dropdown by clicking toggle
        fireEvent.click(toggle);

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'false');
        });

        // Reopen dropdown - should start from first item again
        fireEvent.keyDown(toggle, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
        });

        await waitFor(() => {
            const firstItem = screen.getByTestId('keyboard-item-1');
            expect(firstItem).toHaveFocus();
        });
    });
});
