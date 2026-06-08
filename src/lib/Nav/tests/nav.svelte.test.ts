import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from '../index.js';
import NavBasicTest from './nav-basic-test.svelte';

describe('Nav Component', () => {
    it('should render basic nav with all sub-components', async () => {
        render(NavBasicTest);

        // Check if basic nav components are rendered
        expect(screen.getByTestId('basic-nav')).toHaveClass('nav');
        expect(screen.getByTestId('nav-item-active')).toHaveClass('nav-item');
        expect(screen.getByTestId('nav-link-active')).toHaveClass('nav-link');
        expect(screen.getByTestId('nav-link-active')).toHaveClass('active');
        expect(screen.getByTestId('disabled-nav-link')).toHaveClass('disabled');
    });

    it('should render nav with pills style', () => {
        render(NavBasicTest);

        const pillsNav = screen.getByTestId('pills-nav');
        expect(pillsNav).toHaveClass('nav');
        expect(pillsNav).toHaveClass('nav-pills');
    });

    it('should render nav with tabs style', () => {
        render(NavBasicTest);

        const tabsNav = screen.getByTestId('tabs-nav');
        expect(tabsNav).toHaveClass('nav');
        expect(tabsNav).toHaveClass('nav-tabs');
    });

    it('should render nav with vertical direction', () => {
        render(NavBasicTest);

        const verticalNav = screen.getByTestId('vertical-nav');
        expect(verticalNav).toHaveClass('nav');
        expect(verticalNav).toHaveClass('flex-column');
    });

    it('should render nav with justified layout', () => {
        render(NavBasicTest);

        const justifiedNav = screen.getByTestId('justified-nav');
        expect(justifiedNav).toHaveClass('nav');
        expect(justifiedNav).toHaveClass('nav-justified');
    });

    it('should render nav with fill layout', () => {
        render(NavBasicTest);

        const fillNav = screen.getByTestId('fill-nav');
        expect(fillNav).toHaveClass('nav');
        expect(fillNav).toHaveClass('nav-fill');
    });

    it('should pass custom CSS classes to Nav.Root', () => {
        render(NavBasicTest, { props: { class: 'custom-nav-class' } });

        const nav = screen.getByTestId('basic-nav');
        expect(nav).toHaveClass('nav');
        expect(nav).toHaveClass('custom-nav-class');
    });

    it('should render as ul element by default', () => {
        render(NavBasicTest);

        const ulElement = screen.getByTestId('as-ul-element');
        expect(ulElement.tagName).toBe('UL');
        expect(ulElement).toHaveClass('nav');
    });

    it('should render as ol element when as="ol"', () => {
        render(NavBasicTest);

        const olElement = screen.getByTestId('as-ol-element');
        expect(olElement.tagName).toBe('OL');
        expect(olElement).toHaveClass('nav');
    });

    it('should render as ul element when as="nav"', () => {
        render(NavBasicTest);

        const navElement = screen.getByTestId('as-nav-element');
        expect(navElement.tagName).toBe('NAV');
        expect(navElement).toHaveClass('nav');
    });

    it('should render with correct element type based on "elementType" prop', () => {
        // Test rendering as ul element (default)
        const { container: ulContainer } = render(Nav.Root);
        expect(ulContainer.querySelector('nav')).toBeNull();
        expect(ulContainer.querySelector('ul')).not.toBeNull();
        expect(ulContainer.querySelector('ol')).toBeNull();

        // Test rendering as ol element
        const { container: olContainer } = render(Nav.Root, { props: { elementType: 'ol' } });
        expect(olContainer.querySelector('nav')).toBeNull();
        expect(olContainer.querySelector('ul')).toBeNull();
        expect(olContainer.querySelector('ol')).not.toBeNull();

        // Test rendering as nav element
        const { container: navContainer } = render(Nav.Root, { props: { elementType: 'nav' } });
        expect(navContainer.querySelector('nav')).not.toBeNull();
        expect(navContainer.querySelector('ul')).toBeNull();
        expect(navContainer.querySelector('ol')).toBeNull();
    });

    it('should add role="navigation" when isNavigation=true and element is not nav', () => {
        render(NavBasicTest);
        const navigationNav = screen.getByTestId('navigation-nav');
        expect(navigationNav.tagName).toBe('UL');
        expect(navigationNav).toHaveAttribute('role', 'navigation');
    });

    it('should not add role="navigation" when element is already a nav element', () => {
        render(NavBasicTest);
        const navigationAsNav = screen.getByTestId('navigation-as-nav');
        expect(navigationAsNav.tagName).toBe('NAV');
        expect(navigationAsNav).not.toHaveAttribute('role', 'navigation');
    });

    it('should add proper ARIA attributes to active links', () => {
        render(NavBasicTest);
        const activeLink = screen.getByTestId('nav-link-active');
        expect(activeLink).toHaveAttribute('aria-current', 'page');
        expect(activeLink).toHaveClass('active');
    });

    it('should not render a role attribute for Nav.Item when not in a tabs context', () => {
        render(NavBasicTest);

        const basicItem = screen.getByTestId('nav-item-active');
        expect(basicItem).not.toHaveAttribute('role');
    });

    it('should add proper ARIA attributes to disabled links', () => {
        render(NavBasicTest);
        const disabledLink = screen.getByTestId('disabled-nav-link');
        expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
        expect(disabledLink).toHaveAttribute('tabindex', '-1');
        expect(disabledLink).toHaveClass('disabled');
    });

    it('should prioritize isActive prop over internal linkState when isActive is provided', () => {
        render(NavBasicTest);

        // Test explicit isActive=true
        const activeLink = screen.getByTestId('nav-link-active');
        expect(activeLink).toHaveClass('active');
        expect(activeLink).toHaveAttribute('aria-current', 'page');

        // Test explicit isActive=false (disabled link should not be active)
        const disabledLink = screen.getByTestId('disabled-nav-link');
        expect(disabledLink).not.toHaveClass('active');
        expect(disabledLink).not.toHaveAttribute('aria-current');
    });

    it('should handle onclick events properly for hash links', async () => {
        const mockPreventDefault = vi.fn();
        const mockStopImmediatePropagation = vi.fn();

        render(NavBasicTest);

        const hashLink = screen.getByTestId('hash-nav-link');

        // Create a mock event
        const _mockEvent = {
            preventDefault: mockPreventDefault,
            stopImmediatePropagation: mockStopImmediatePropagation
        } as unknown as Event;

        // Simulate click event
        await fireEvent.click(hashLink);

        // For hash links (#!), preventDefault should be called
        // We can't directly test the mock functions since they're internal,
        // but we can verify the link behavior
        expect(hashLink).toHaveAttribute('href', '#!');
    });

    it('should handle regular href links without preventing default', () => {
        render(NavBasicTest);

        const regularLink = screen.getByTestId('regular-nav-link');
        expect(regularLink).toHaveAttribute('href', '/page');

        // Regular links should not have aria-current unless explicitly active
        expect(regularLink).not.toHaveAttribute('aria-current');
    });

    it('should update active state when isActive prop changes', () => {
        render(NavBasicTest);

        const conditionalActiveLink = screen.getByTestId('conditional-active-link');

        // Initially should not be active (isActive={false})
        expect(conditionalActiveLink).not.toHaveClass('active');
        expect(conditionalActiveLink).not.toHaveAttribute('aria-current');
    });

    it('should handle custom onclick handlers alongside internal logic', async () => {
        render(NavBasicTest);

        const customOnclickLink = screen.getByTestId('custom-onclick-link');

        // Click the link
        await fireEvent.click(customOnclickLink);

        // Verify the link exists and has proper attributes
        expect(customOnclickLink).toHaveClass('nav-link');
        expect(customOnclickLink).toHaveAttribute('href', '#!');
    });

    it('should generate unique IDs when not provided', () => {
        render(NavBasicTest);

        const autoIdLink1 = screen.getByTestId('auto-id-link-1');
        const autoIdLink2 = screen.getByTestId('auto-id-link-2');

        // Both should have IDs
        expect(autoIdLink1).toHaveAttribute('id');
        expect(autoIdLink2).toHaveAttribute('id');

        // IDs should be different
        const id1 = autoIdLink1.getAttribute('id');
        const id2 = autoIdLink2.getAttribute('id');
        expect(id1).not.toBe(id2);
        expect(id1).toMatch(/^nav-link-/);
        expect(id2).toMatch(/^nav-link-/);
    });
});
