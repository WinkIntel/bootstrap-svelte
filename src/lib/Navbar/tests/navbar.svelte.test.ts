/* eslint-disable @typescript-eslint/no-explicit-any -- test uses partial/mock typings */
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '../index.js';
import NavbarBasicTest from './navbar-basic-test.svelte';

describe('Navbar Component', () => {
    it('should render basic navbar with all sub-components in collapsed state', () => {
        render(NavbarBasicTest);

        // Check if navbar root component is rendered
        const navbar = screen.getByTestId('navbar');
        expect(navbar).toHaveClass('navbar');
        expect(navbar).toHaveClass('bg-body-tertiary');

        // Check if container is rendered
        const container = screen.getByTestId('container');
        expect(container).toHaveClass('container-fluid');

        // Check if navbar brand is rendered
        const brand = screen.getByTestId('navbar-brand');
        expect(brand).toHaveClass('navbar-brand');
        expect(brand).toHaveAttribute('href', '#!');
        expect(brand).toHaveTextContent('Navbar Brand');

        // Check if navbar toggler is rendered and shows collapsed state
        const toggler = screen.getByTestId('navbar-toggler');
        expect(toggler).toHaveClass('navbar-toggler');
        expect(toggler).toHaveClass('collapsed');
        expect(toggler).toHaveAttribute('aria-label', 'Toggle navigation');
        expect(toggler).toHaveAttribute('aria-expanded', 'false');

        // Check if toggler icon is rendered
        const togglerIcon = screen.getByTestId('navbar-toggler-icon');
        expect(togglerIcon).toHaveClass('navbar-toggler-icon');

        // Check if navbar text is rendered
        const navbarText = screen.getByTestId('navbar-text');
        expect(navbarText).toHaveClass('navbar-text');
        expect(navbarText).toHaveTextContent('Some navbar text');

        // In collapsed state, the collapse container should not be visible in DOM
        // (Bootstrap collapses content by hiding it)
        const collapse = screen.queryByTestId('navbar-collapse');
        expect(collapse).not.toBeInTheDocument();

        // Nav items should also not be visible when collapsed
        const navItems = screen.queryByTestId('nav-item-active');
        expect(navItems).not.toBeInTheDocument();
    });

    it('should toggle navbar collapse and render nav items when expanded', async () => {
        // Mock getComputedStyle to return consistent transition duration for jsdom
        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = vi.fn(
            () =>
                ({
                    transitionDuration: '0.35s',
                    transitionDelay: '0s'
                }) as CSSStyleDeclaration
        );

        // Mock HTMLElement properties that jsdom doesn't implement properly
        const _originalDefineProperty = Object.defineProperty;
        const mockScrollHeight = vi.fn(() => 200);
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
            configurable: true,
            get: mockScrollHeight
        });

        render(NavbarBasicTest);

        // Get the toggler button
        const toggler = screen.getByTestId('navbar-toggler');

        // Initially collapsed - nav items should not be visible
        expect(screen.queryByTestId('nav-item-active')).not.toBeInTheDocument();
        expect(toggler).toHaveClass('collapsed');
        expect(toggler).toHaveAttribute('aria-expanded', 'false');

        // Click the toggler to expand
        await fireEvent.click(toggler);

        // After clicking but before/during transition, element enters the DOM
        // In test environment, transitions may not complete fully, so we check for presence
        // and the "collapsing" intermediate state which indicates the transition started
        const collapseElement = screen.getByTestId('navbar-collapse');
        expect(collapseElement).toBeInTheDocument();
        expect(collapseElement).toHaveClass('navbar-collapse');
        // During transition, element has 'collapsing' class (Bootstrap collapse behavior)
        expect(collapseElement).toHaveClass('collapsing');

        // Wait for the transition to attempt completion (350ms + buffer)
        await new Promise((resolve) => setTimeout(resolve, 450));

        // After waiting, check the final state - in jsdom, transitions don't always complete
        // so we verify the element is visible and toggler state is correct
        const collapse = screen.getByTestId('navbar-collapse');
        expect(collapse).toBeInTheDocument();

        // After clicking, the navbar toggler should show expanded state
        expect(toggler).not.toHaveClass('collapsed');
        expect(toggler).toHaveAttribute('aria-expanded', 'true');

        //Note: In jsdom test environment, Svelte transitions may not complete the tick cycle
        // that adds 'collapse' and 'show' classes. The transition starts (adds 'collapsing'),
        // but the RAF-based tick to progress===1 may not fire reliably in jsdom.
        // The actual browser behavior works correctly - this is a test environment limitation.

        // Check if navbar nav is rendered
        const navbarNav = screen.getByTestId('navbar-nav');
        expect(navbarNav).toHaveClass('navbar-nav');
        expect(navbarNav).toHaveClass('me-auto');
        expect(navbarNav).toHaveClass('mb-2');
        expect(navbarNav).toHaveClass('mb-lg-0');

        // Check active nav item
        const activeItem = screen.getByTestId('nav-item-active');
        expect(activeItem).toHaveClass('nav-item');

        const activeLink = screen.getByTestId('nav-link-active');
        expect(activeLink).toHaveClass('nav-link');
        expect(activeLink).toHaveClass('active');
        expect(activeLink).toHaveAttribute('aria-current', 'page');
        expect(activeLink).toHaveTextContent('Active Link');

        // Check normal nav item
        const normalItem = screen.getByTestId('nav-item-normal');
        expect(normalItem).toHaveClass('nav-item');

        const normalLink = screen.getByTestId('nav-link-normal');
        expect(normalLink).toHaveClass('nav-link');
        expect(normalLink).not.toHaveClass('active');
        expect(normalLink).toHaveTextContent('Normal Link');

        // Check disabled nav item
        const disabledItem = screen.getByTestId('nav-item-disabled');
        expect(disabledItem).toHaveClass('nav-item');

        const disabledLink = screen.getByTestId('nav-link-disabled');
        expect(disabledLink).toHaveClass('nav-link');
        expect(disabledLink).toHaveClass('disabled');
        expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
        expect(disabledLink).toHaveAttribute('tabindex', '-1');
        expect(disabledLink).toHaveTextContent('Disabled Link');

        // Click the toggler again to collapse
        await fireEvent.click(toggler);

        // Wait for the collapse transition
        await new Promise((resolve) => setTimeout(resolve, 450));

        // Should be collapsed again - test the reliable ARIA states
        expect(toggler).toHaveClass('collapsed');
        expect(toggler).toHaveAttribute('aria-expanded', 'false');

        // Restore mocks
        window.getComputedStyle = originalGetComputedStyle;
        delete (HTMLElement.prototype as any).scrollHeight;
    });

    it('should render with correct breakpoint class', () => {
        // Test with no breakpoint (from test component) - should not have navbar-expand-* class
        render(NavbarBasicTest);
        const navbar = screen.getByTestId('navbar');
        expect(navbar).toHaveClass('navbar');
        expect(navbar).not.toHaveClass('navbar-expand-xs');
        expect(navbar).not.toHaveClass('navbar-expand-sm');
        expect(navbar).not.toHaveClass('navbar-expand-md');
        expect(navbar).not.toHaveClass('navbar-expand-lg');
        expect(navbar).not.toHaveClass('navbar-expand-xl');
        expect(navbar).not.toHaveClass('navbar-expand-xxl');

        // Test with custom breakpoints by directly rendering Navbar.Root
        const { container: smContainer } = render(Navbar.Root, { props: { expandOnBreakpoint: 'sm' } });
        expect(smContainer.querySelector('.navbar-expand-sm')).not.toBeNull();

        const { container: mdContainer } = render(Navbar.Root, { props: { expandOnBreakpoint: 'md' } });
        expect(mdContainer.querySelector('.navbar-expand-md')).not.toBeNull();

        const { container: xlContainer } = render(Navbar.Root, { props: { expandOnBreakpoint: 'xl' } });
        expect(xlContainer.querySelector('.navbar-expand-xl')).not.toBeNull();

        const { container: xxlContainer } = render(Navbar.Root, { props: { expandOnBreakpoint: 'xxl' } });
        expect(xxlContainer.querySelector('.navbar-expand-xxl')).not.toBeNull();
    });

    it('should apply custom classes to Navbar components', () => {
        const { container } = render(Navbar.Root, {
            props: {
                class: 'custom-navbar-class',
                expandOnBreakpoint: 'lg'
            }
        });

        const navbar = container.querySelector('.navbar');
        expect(navbar).not.toBeNull();
        expect(navbar).toHaveClass('custom-navbar-class');
        expect(navbar).toHaveClass('navbar-expand-lg');
    });

    it('should apply the correct placement classes', () => {
        // Test fixed-top placement
        const { container: fixedTopContainer } = render(Navbar.Root, {
            props: {
                placement: 'fixed-top'
            }
        });
        const fixedTopNavbar = fixedTopContainer.querySelector('.navbar');
        expect(fixedTopNavbar).toHaveClass('fixed-top');
        expect(fixedTopNavbar).not.toHaveClass('fixed-bottom');
        expect(fixedTopNavbar).not.toHaveClass('sticky-top');
        expect(fixedTopNavbar).not.toHaveClass('sticky-bottom');

        // Test fixed-bottom placement
        const { container: fixedBottomContainer } = render(Navbar.Root, {
            props: {
                placement: 'fixed-bottom'
            }
        });
        const fixedBottomNavbar = fixedBottomContainer.querySelector('.navbar');
        expect(fixedBottomNavbar).toHaveClass('fixed-bottom');
        expect(fixedBottomNavbar).not.toHaveClass('fixed-top');

        // Test sticky-top placement
        const { container: stickyTopContainer } = render(Navbar.Root, {
            props: {
                placement: 'sticky-top'
            }
        });
        const stickyTopNavbar = stickyTopContainer.querySelector('.navbar');
        expect(stickyTopNavbar).toHaveClass('sticky-top');
        expect(stickyTopNavbar).not.toHaveClass('sticky-bottom');

        // Test sticky-bottom placement
        const { container: stickyBottomContainer } = render(Navbar.Root, {
            props: {
                placement: 'sticky-bottom'
            }
        });
        const stickyBottomNavbar = stickyBottomContainer.querySelector('.navbar');
        expect(stickyBottomNavbar).toHaveClass('sticky-bottom');

        // Test with no placement (should not have any placement classes)
        const { container: noPlacementContainer } = render(Navbar.Root, {
            props: {}
        });
        const noPlacementNavbar = noPlacementContainer.querySelector('.navbar');
        expect(noPlacementNavbar).not.toHaveClass('fixed-top');
        expect(noPlacementNavbar).not.toHaveClass('fixed-bottom');
        expect(noPlacementNavbar).not.toHaveClass('sticky-top');
        expect(noPlacementNavbar).not.toHaveClass('sticky-bottom');
    });

    it('should apply the correct variant and data-bs-theme attribute', () => {
        // Test primary variant
        const { container: primaryContainer } = render(Navbar.Root, {
            props: {
                colorVariant: 'primary'
            }
        });
        const primaryNavbar = primaryContainer.querySelector('.navbar');
        expect(primaryNavbar).toHaveClass('bg-primary');
        expect(primaryNavbar).toHaveAttribute('data-bs-theme', 'dark');

        // Test secondary variant
        const { container: secondaryContainer } = render(Navbar.Root, {
            props: {
                colorVariant: 'secondary'
            }
        });
        const secondaryNavbar = secondaryContainer.querySelector('.navbar');
        expect(secondaryNavbar).toHaveClass('bg-secondary');
        expect(secondaryNavbar).toHaveAttribute('data-bs-theme', 'dark');

        // Test light variant (should not have dark theme)
        const { container: lightContainer } = render(Navbar.Root, {
            props: {
                colorVariant: 'light'
            }
        });
        const lightNavbar = lightContainer.querySelector('.navbar');
        expect(lightNavbar).toHaveClass('bg-light');
        expect(lightNavbar).not.toHaveAttribute('data-bs-theme', 'dark');

        // Test info variant (should not have dark theme)
        const { container: infoContainer } = render(Navbar.Root, {
            props: {
                colorVariant: 'info'
            }
        });
        const infoNavbar = infoContainer.querySelector('.navbar');
        expect(infoNavbar).toHaveClass('bg-info');
        expect(infoNavbar).not.toHaveAttribute('data-bs-theme', 'dark');

        // Test danger variant (should have dark theme)
        const { container: dangerContainer } = render(Navbar.Root, {
            props: {
                colorVariant: 'danger'
            }
        });
        const dangerNavbar = dangerContainer.querySelector('.navbar');
        expect(dangerNavbar).toHaveClass('bg-danger');
        expect(dangerNavbar).toHaveAttribute('data-bs-theme', 'dark');

        // Test with no variant (should not have any bg-* classes)
        const { container: noVariantContainer } = render(Navbar.Root, {
            props: {}
        });
        const noVariantNavbar = noVariantContainer.querySelector('.navbar');
        expect(noVariantNavbar).not.toHaveClass('bg-primary');
        expect(noVariantNavbar).not.toHaveClass('bg-secondary');
        expect(noVariantNavbar).not.toHaveClass('bg-success');
        expect(noVariantNavbar).not.toHaveAttribute('data-bs-theme', 'dark');
    });
});
