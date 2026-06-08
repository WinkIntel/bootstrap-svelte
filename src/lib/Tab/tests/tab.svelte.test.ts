/**
 * Tab Component Tests
 *
 * This test suite covers the Tab component functionality, including:
 *
 * 1. Basic Rendering:
 *    - Tab structure with all sub-components
 *    - Content rendering in active tab panes
 *    - Accessibility attributes
 *    - CSS class handling
 *
 * 2. Tab Navigation and Activation (Bug Fix Coverage):
 *    - Tests for the bug fix where clicking a tab link now properly activates both
 *      the nav link AND the tab pane simultaneously
 *    - The fix involved updating NavLinkState.onclick() to call setNavLinkActive()
 *      on the TabRootState, ensuring nav link state synchronizes with tab pane state
 *
 * 3. Programmatic Tab Activation (Bug Fix Coverage):
 *    - Tests for the bug fix where setting isActive prop programmatically now properly
 *      triggers tab activation
 *    - The fix involved adding a $effect in tab-nav-link.svelte that watches for
 *      isActive prop changes and triggers the onclick handler when isActive becomes true
 *    - Validates that both nav link and tab pane states stay synchronized during
 *      programmatic changes
 *
 * Note: Inactive tab panes are removed from the DOM (using {#if isActiveState}),
 * so tests use screen.queryByTestId() to check for their absence rather than
 * expecting them to be present but hidden.
 */

import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import { Tab } from '../index.js';
import TabContentBasicTest from './tab-content-basic-test.svelte';
import TabInteractiveTest from './tab-interactive-test.svelte';
import TabProgrammaticTest from './tab-programmatic-test.svelte';

describe('Tab Component', () => {
    it('should render basic tab structure with all sub-components', async () => {
        render(TabContentBasicTest);

        // Check if tab components are rendered
        expect(screen.getByTestId('tab-content-container')).toHaveClass('tab-content');
        expect(screen.getByTestId('home-content')).toHaveClass('tab-pane');
        expect(screen.getByTestId('home-content')).toHaveClass('active');
        expect(() => screen.getByTestId('profile-content')).toThrow(); // element is not in the DOM
        expect(() => screen.getByTestId('contact-content')).toThrow(); // element is not in the DOM
    });

    it('should render correct content in the active tab pane', () => {
        render(TabContentBasicTest);

        expect(screen.getByTestId('home-content')).toHaveTextContent('Home Content');
        expect(screen.getByTestId('home-content')).toHaveTextContent('This is the home content panel.');
    });

    it('should set correct accessibility attributes for the active tab pane', () => {
        render(TabContentBasicTest);

        const activePane = screen.getByTestId('home-content');

        expect(activePane).toHaveAttribute('role', 'tabpanel');
        expect(activePane).toHaveAttribute('aria-hidden', 'false');
        expect(activePane.hidden).toBeFalsy();
    });

    it('should add role="presentation" to Nav.Item when inside a tabs context', () => {
        render(TabContentBasicTest);

        const tabsNav = screen.getByTestId('nav-tabs');
        const firstTabsItem = tabsNav.querySelector('li');

        expect(firstTabsItem).not.toBeNull();
        expect(firstTabsItem).toHaveAttribute('role', 'presentation');
    });

    it('should render Tab.Root as div element by default', () => {
        const { container } = render(Tab.Root);
        const rootElement = container.firstChild;
        expect(rootElement instanceof HTMLDivElement).toBeTruthy();
    });

    it('should render Tab.Content as div element by default', () => {
        const { container } = render(Tab.Content);
        const contentElement = container.firstChild;
        expect(contentElement instanceof HTMLDivElement).toBeTruthy();
        expect(contentElement).toHaveClass('tab-content');
    });

    it('should pass custom CSS classes to Tab.Root', () => {
        const { container } = render(Tab.Root, { props: { class: 'custom-tab-class' } });
        const rootElement = container.firstChild;
        expect(rootElement).toHaveClass('custom-tab-class');
    });

    it('should pass custom CSS classes to Tab.Content', () => {
        const { container } = render(Tab.Content, { props: { class: 'custom-content-class' } });
        const contentElement = container.firstChild;
        expect(contentElement).toHaveClass('tab-content');
        expect(contentElement).toHaveClass('custom-content-class');
    });

    describe('Tab Navigation and Activation', () => {
        it('should activate both nav link and tab pane when tab link is clicked', async () => {
            render(TabInteractiveTest);

            // Initial state: home tab is active
            const homeLink = screen.getByTestId('tab-link-home');
            const profileLink = screen.getByTestId('tab-link-profile');
            const homePane = screen.getByTestId('pane-home');

            expect(homeLink).toHaveClass('active');
            expect(homeLink).toHaveAttribute('aria-selected', 'true');
            expect(homePane).toHaveClass('active');
            expect(homePane).toHaveAttribute('aria-hidden', 'false');

            // Click profile tab
            await fireEvent.click(profileLink);

            // Verify profile link is now active
            expect(profileLink).toHaveClass('active');
            expect(profileLink).toHaveAttribute('aria-selected', 'true');

            // Verify profile pane is now active
            const profilePane = screen.getByTestId('pane-profile');
            expect(profilePane).toHaveClass('active');
            expect(profilePane).toHaveAttribute('aria-hidden', 'false');

            // Verify home is no longer active
            expect(homeLink).not.toHaveClass('active');
            expect(homeLink).toHaveAttribute('aria-selected', 'false');
        });

        it('should synchronize nav link active state with tab pane active state on click', async () => {
            render(TabInteractiveTest);

            const contactLink = screen.getByTestId('tab-link-contact');

            // Click contact tab
            await fireEvent.click(contactLink);

            // Verify both link and pane are active
            expect(contactLink).toHaveClass('active');
            expect(contactLink).toHaveAttribute('aria-selected', 'true');

            const contactPane = screen.getByTestId('pane-contact');
            expect(contactPane).toHaveClass('active');
            expect(contactPane).toHaveAttribute('aria-hidden', 'false');
        });

        it('should handle multiple tab clicks correctly', async () => {
            render(TabInteractiveTest);

            const homeLink = screen.getByTestId('tab-link-home');
            const profileLink = screen.getByTestId('tab-link-profile');
            const contactLink = screen.getByTestId('tab-link-contact');

            // Click through tabs multiple times
            await fireEvent.click(profileLink);
            expect(profileLink).toHaveClass('active');

            await fireEvent.click(contactLink);
            expect(contactLink).toHaveClass('active');
            expect(profileLink).not.toHaveClass('active');

            await fireEvent.click(homeLink);
            expect(homeLink).toHaveClass('active');
            expect(contactLink).not.toHaveClass('active');

            await fireEvent.click(profileLink);
            expect(profileLink).toHaveClass('active');
            expect(homeLink).not.toHaveClass('active');
        });
    });

    describe('Programmatic Tab Activation', () => {
        it('should activate tab when isActive prop is set to true programmatically', async () => {
            const { component } = render(TabProgrammaticTest);

            // Initial state: contact tab is active
            const contactLink = screen.getByTestId('prog-tab-link-contact');
            const contactPane = screen.getByTestId('prog-pane-contact');

            expect(contactLink).toHaveClass('active');
            expect(contactPane).toHaveClass('active');

            // Programmatically activate home tab
            component.activateHome();
            await tick();

            const homeLink = screen.getByTestId('prog-tab-link-home');
            const homePane = screen.getByTestId('prog-pane-home');

            expect(homeLink).toHaveClass('active');
            expect(homeLink).toHaveAttribute('aria-selected', 'true');
            expect(homePane).toHaveClass('active');
            expect(homePane).toHaveAttribute('aria-hidden', 'false');

            // Verify contact is no longer active
            expect(contactLink).not.toHaveClass('active');
            expect(contactLink).toHaveAttribute('aria-selected', 'false');
        });

        it('should properly activate tab pane when isActive prop changes', async () => {
            const { component } = render(TabProgrammaticTest);

            // Activate profile programmatically
            component.activateProfile();
            await tick();

            const profileLink = screen.getByTestId('prog-tab-link-profile');
            const profilePane = screen.getByTestId('prog-pane-profile');

            expect(profileLink).toHaveClass('active');
            expect(profilePane).toHaveClass('active');
        });

        it('should handle multiple programmatic activations correctly', async () => {
            const { component } = render(TabProgrammaticTest);

            // Initial state: contact is active
            let contactLink = screen.getByTestId('prog-tab-link-contact');
            const contactPane = screen.getByTestId('prog-pane-contact');
            expect(contactLink).toHaveClass('active');
            expect(contactPane).toHaveClass('active');

            // Activate home
            component.activateHome();
            await tick();

            const homeLink = screen.getByTestId('prog-tab-link-home');
            const homePane = screen.getByTestId('prog-pane-home');
            expect(homeLink).toHaveClass('active');
            expect(homePane).toHaveClass('active');

            // Contact should no longer be active
            contactLink = screen.getByTestId('prog-tab-link-contact');
            expect(contactLink).not.toHaveClass('active');
            // Contact pane should be removed from DOM
            expect(screen.queryByTestId('prog-pane-contact')).toBeNull();

            // Activate profile
            component.activateProfile();
            await tick();

            const profileLink = screen.getByTestId('prog-tab-link-profile');
            const profilePane = screen.getByTestId('prog-pane-profile');
            expect(profileLink).toHaveClass('active');
            expect(profilePane).toHaveClass('active');

            // Home should no longer be active
            const homeLinkAfterProfileActivation = screen.getByTestId('prog-tab-link-home');
            expect(homeLinkAfterProfileActivation).not.toHaveClass('active');
            // Home pane should be removed from DOM
            expect(screen.queryByTestId('prog-pane-home')).toBeNull();
        });

        it('should ensure nav link and tab pane stay synchronized during programmatic changes', async () => {
            const { component } = render(TabProgrammaticTest);

            // Test synchronization for each tab
            component.activateHome();
            await tick();

            const homeLink = screen.getByTestId('prog-tab-link-home');
            const homePane = screen.getByTestId('prog-pane-home');
            expect(homeLink).toHaveClass('active');
            expect(homePane).toHaveClass('active');
            // Only home pane should be in DOM
            expect(screen.queryByTestId('prog-pane-profile')).toBeNull();
            expect(screen.queryByTestId('prog-pane-contact')).toBeNull();

            component.activateProfile();
            await tick();

            const profileLink = screen.getByTestId('prog-tab-link-profile');
            const profilePane = screen.getByTestId('prog-pane-profile');
            expect(profileLink).toHaveClass('active');
            expect(profilePane).toHaveClass('active');

            // Home link should not be active
            const homeLinkAfterProfile = screen.getByTestId('prog-tab-link-home');
            expect(homeLinkAfterProfile).not.toHaveClass('active');
            // Only profile pane should be in DOM
            expect(screen.queryByTestId('prog-pane-home')).toBeNull();
            expect(screen.queryByTestId('prog-pane-contact')).toBeNull();
        });
    });
});
