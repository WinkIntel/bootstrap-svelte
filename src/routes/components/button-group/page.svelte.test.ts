/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/components/button-group/+page.svelte', () => {
    // Basic Button Group tests
    describe('Basic Button Group', () => {
        test('should render basic button group with three buttons', () => {
            const { container } = render(Page);

            // Check if the button group exists
            const buttonGroups = container.querySelectorAll('.btn-group');
            expect(buttonGroups.length).toBeGreaterThan(0);

            // Check the individual buttons in the basic example
            const btnLeft = container.querySelector('#btnLeft');
            const btnMiddle = container.querySelector('#btnMiddle');
            const btnRight = container.querySelector('#btnRight');

            expect(btnLeft).toBeInTheDocument();
            expect(btnLeft).toHaveClass('btn');
            expect(btnLeft).toHaveClass('btn-primary');
            expect(btnLeft).toHaveTextContent('Left');

            expect(btnMiddle).toBeInTheDocument();
            expect(btnMiddle).toHaveClass('btn');
            expect(btnMiddle).toHaveClass('btn-primary');
            expect(btnMiddle).toHaveTextContent('Middle');

            expect(btnRight).toBeInTheDocument();
            expect(btnRight).toHaveClass('btn');
            expect(btnRight).toHaveClass('btn-primary');
            expect(btnRight).toHaveTextContent('Right');
        });
    });

    // Button Links tests
    describe('Button Links', () => {
        test('should render button links with active state', () => {
            const { container } = render(Page);

            // Find the section with button links
            const buttonLinkSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'button-links');

            expect(buttonLinkSection).toBeInTheDocument();

            const buttonGroup = buttonLinkSection?.querySelector('.btn-group');
            expect(buttonGroup).toBeInTheDocument();

            // Check for the buttons with href attributes
            const buttons = buttonGroup?.querySelectorAll('.btn');
            expect(buttons?.length).toBe(3);

            const activeButton = buttonGroup?.querySelector('.btn.active');
            expect(activeButton).toBeInTheDocument();
            expect(activeButton).toHaveAttribute('href', '#!');
            expect(activeButton).toHaveAttribute('aria-current', 'page');
            expect(activeButton).toHaveTextContent('Active Link 1');

            const link2 = Array.from(buttons || []).find((btn) => btn.textContent === 'Link 2');
            expect(link2).toBeInTheDocument();
            expect(link2).toHaveAttribute('href', '#!');

            const link3 = Array.from(buttons || []).find((btn) => btn.textContent === 'Link 3');
            expect(link3).toBeInTheDocument();
            expect(link3).toHaveAttribute('href', '#!');
        });
    });

    // Mixed Styles tests
    describe('Mixed Styles', () => {
        test('should render button group with different variants', () => {
            const { container } = render(Page);

            // Find the section with mixed styles
            const mixedStylesSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'mixed-styles');

            expect(mixedStylesSection).toBeInTheDocument();

            const buttonGroup = mixedStylesSection?.querySelector('.btn-group');
            expect(buttonGroup).toBeInTheDocument();

            // Check for buttons with different variants
            const buttons = buttonGroup?.querySelectorAll('.btn');
            expect(buttons?.length).toBe(3);

            const dangerButton = buttonGroup?.querySelector('.btn-danger');
            expect(dangerButton).toBeInTheDocument();
            expect(dangerButton).toHaveTextContent('Left');

            const warningButton = buttonGroup?.querySelector('.btn-warning');
            expect(warningButton).toBeInTheDocument();
            expect(warningButton).toHaveTextContent('Middle');

            const successButton = buttonGroup?.querySelector('.btn-success');
            expect(successButton).toBeInTheDocument();
            expect(successButton).toHaveTextContent('Right');
        });
    });

    // Outlined Styles tests
    describe('Outlined Styles', () => {
        test('should render button group with outlined styles', () => {
            const { container } = render(Page);

            // Find the section with outlined styles
            const outlinedStylesSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'outlined-styles');

            expect(outlinedStylesSection).toBeInTheDocument();

            const buttonGroup = outlinedStylesSection?.querySelector('.btn-group');
            expect(buttonGroup).toBeInTheDocument();

            // Check for buttons with outline variant
            const buttons = buttonGroup?.querySelectorAll('.btn');
            expect(buttons?.length).toBe(3);

            // All buttons should have the outline-primary class
            buttons?.forEach((button) => {
                expect(button).toHaveClass('btn-outline-primary');
            });

            const buttonTexts = ['Left', 'Middle', 'Right'];
            buttonTexts.forEach((text, index) => {
                expect(buttons?.[index]).toHaveTextContent(text);
            });
        });
    });

    // ButtonCheck tests
    describe('ButtonCheck Toggle Buttons', () => {
        test('should render checkbox and radio toggle button groups', () => {
            const { container } = render(Page);

            const buttonCheckSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'button-check');
            expect(buttonCheckSection).toBeInTheDocument();

            const checkInput = buttonCheckSection?.querySelector('#toggle-check-1');
            const checkedInput = buttonCheckSection?.querySelector('#toggle-check-2');
            const radioInput1 = buttonCheckSection?.querySelector('#toggle-radio-1');
            const radioInput2 = buttonCheckSection?.querySelector('#toggle-radio-2');

            expect(checkInput).toBeInTheDocument();
            expect(checkInput).toHaveClass('btn-check');
            expect(checkInput).toHaveAttribute('type', 'checkbox');

            expect(checkedInput).toBeInTheDocument();
            expect(checkedInput).toBeChecked();

            expect(radioInput1).toBeInTheDocument();
            expect(radioInput1).toHaveAttribute('type', 'radio');
            expect(radioInput1).toHaveAttribute('name', 'radio-toggles');
            expect(radioInput1).toBeChecked();

            expect(radioInput2).toBeInTheDocument();
            expect(radioInput2).toHaveAttribute('type', 'radio');
            expect(radioInput2).toHaveAttribute('name', 'radio-toggles');

            const labels = buttonCheckSection?.querySelectorAll('label.btn');
            expect(labels?.length).toBe(4);
        });
    });

    // Button Toolbar tests
    describe('Button Toolbar', () => {
        test('should render button toolbar with multiple button groups', () => {
            const { container } = render(Page);

            // Find the section with button toolbar
            const toolbarSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'button-toolbar');

            expect(toolbarSection).toBeInTheDocument();

            const buttonGroup = toolbarSection?.querySelector('[role="toolbar"]');
            expect(buttonGroup).toBeInTheDocument();

            // Check for separate button groups within the toolbar
            const nestedButtonGroups = buttonGroup?.querySelectorAll('.btn-group');
            expect(nestedButtonGroups?.length).toBe(3);

            // First group should have 4 primary buttons
            const firstGroup = nestedButtonGroups?.[0];
            expect(firstGroup).toHaveClass('me-2');
            const firstGroupButtons = firstGroup?.querySelectorAll('.btn-primary');
            expect(firstGroupButtons?.length).toBe(4);

            // Second group should have 3 secondary buttons
            const secondGroup = nestedButtonGroups?.[1];
            expect(secondGroup).toHaveClass('me-2');
            const secondGroupButtons = secondGroup?.querySelectorAll('.btn-secondary');
            expect(secondGroupButtons?.length).toBe(3);

            // Third group should have 2 info buttons
            const thirdGroup = nestedButtonGroups?.[2];
            const thirdGroupButtons = thirdGroup?.querySelectorAll('.btn-info');
            expect(thirdGroupButtons?.length).toBe(2);
        });
    });

    // Sizing tests
    describe('Sizing', () => {
        test('should render button groups with different sizes', () => {
            const { container } = render(Page);

            // Find the section with sizing examples
            const sizingSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'sizing');

            expect(sizingSection).toBeInTheDocument();

            // Find the button groups with different sizes
            const buttonGroups = sizingSection?.querySelectorAll('.btn-group');
            expect(buttonGroups?.length).toBe(3);

            // Large button group
            const largeGroup = buttonGroups?.[0];
            expect(largeGroup).toHaveClass('btn-group-lg');

            // Default size button group (no size class)
            const defaultGroup = buttonGroups?.[1];
            expect(defaultGroup).not.toHaveClass('btn-group-lg');
            expect(defaultGroup).not.toHaveClass('btn-group-sm');

            // Small button group
            const smallGroup = buttonGroups?.[2];
            expect(smallGroup).toHaveClass('btn-group-sm');

            // Each group should have 3 buttons
            buttonGroups?.forEach((group) => {
                const buttons = group.querySelectorAll('.btn');
                expect(buttons.length).toBe(3);
            });
        });
    });

    // Nesting tests
    describe('Nesting', () => {
        test('should render nested button group', () => {
            const { container } = render(Page);

            // Find the section with nesting examples
            const nestingSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'nesting');

            expect(nestingSection).toBeInTheDocument();

            const parentButtonGroup = nestingSection?.querySelector('.btn-group');
            expect(parentButtonGroup).toBeInTheDocument();

            // Should have 2 direct button children and 1 nested button group
            const directButtons = parentButtonGroup?.querySelectorAll(':scope > .btn');
            expect(directButtons?.length).toBe(2);

            // Should have a nested button group
            const nestedGroup = parentButtonGroup?.querySelector('.btn-group');
            expect(nestedGroup).toBeInTheDocument();

            // The nested group should contain a dropdown toggle button
            const dropdownButton = nestedGroup?.querySelector('#btnGroupDrop1');
            expect(dropdownButton).toBeInTheDocument();
            expect(dropdownButton).toHaveClass('dropdown-toggle');
            expect(dropdownButton).toHaveTextContent('Dropdown');
        });
    });

    // Vertical variation tests
    describe('Vertical Variation', () => {
        test('should render vertical button group', () => {
            const { container } = render(Page);

            // Find the section with vertical variation
            const verticalSection = Array.from(container.querySelectorAll('section')).find((section) => section.id === 'vertical');

            expect(verticalSection).toBeInTheDocument();

            // Find the vertical button group
            const verticalGroup = verticalSection?.querySelector('.btn-group-vertical');
            expect(verticalGroup).toBeInTheDocument();

            // Should have 4 buttons
            const buttons = verticalGroup?.querySelectorAll('.btn');
            expect(buttons?.length).toBe(4);

            // All buttons should have the primary variant
            buttons?.forEach((button) => {
                expect(button).toHaveClass('btn-primary');
                expect(button).toHaveTextContent('Button');
            });
        });
    });
});
