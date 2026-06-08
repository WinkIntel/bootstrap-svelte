/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/components/button/+page.svelte', () => {
    // Base Button tests
    test('should render base button', () => {
        const { container } = render(Page);
        const baseButton = container.querySelector('#baseButton');
        expect(baseButton).toBeInTheDocument();
        expect(baseButton).toHaveClass('btn');
        expect(baseButton).toHaveTextContent('Base button');
    });

    // Button Variants tests
    describe('Button variants', () => {
        test('should render primary variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantPrimary');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn');
            expect(button).toHaveClass('btn-primary');
            expect(button).toHaveTextContent('Primary');
        });

        test('should render secondary variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantSecondary');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-secondary');
            expect(button).toHaveTextContent('Secondary');
        });

        test('should render success variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantSuccess');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-success');
            expect(button).toHaveTextContent('Success');
        });

        test('should render danger variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantDanger');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-danger');
            expect(button).toHaveTextContent('Danger');
        });

        test('should render warning variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantWarning');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-warning');
            expect(button).toHaveTextContent('Warning');
        });

        test('should render info variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantInfo');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-info');
            expect(button).toHaveTextContent('Info');
        });

        test('should render light variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantLight');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-light');
            expect(button).toHaveTextContent('Light');
        });

        test('should render dark variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantDark');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-dark');
            expect(button).toHaveTextContent('Dark');
        });

        test('should render link variant', () => {
            const { container } = render(Page);
            const button = container.querySelector('#variantLink');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-link');
            expect(button).toHaveTextContent('Link');
        });
    });

    // Button Sizes tests
    describe('Button sizes', () => {
        test('should render large button', () => {
            const { container } = render(Page);
            const button = container.querySelector('#sizeLargePrimary');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-lg');
            expect(button).toHaveClass('btn-primary');
            expect(button).toHaveTextContent('Large Button');
        });

        test('should render default size button', () => {
            const { container } = render(Page);
            const button = container.querySelector('#sizeDefaultPrimary');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-primary');
            expect(button).toHaveTextContent('Default Button');
            // Should not have size classes
            expect(button).not.toHaveClass('btn-lg');
            expect(button).not.toHaveClass('btn-sm');
        });

        test('should render small button', () => {
            const { container } = render(Page);
            const button = container.querySelector('#sizeSmallPrimary');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-sm');
            expect(button).toHaveClass('btn-primary');
            expect(button).toHaveTextContent('Small Button');
        });
    });

    // Disabled State tests
    describe('Disabled states', () => {
        test('should render disabled primary button', () => {
            const { container } = render(Page);
            const button = container.querySelector('#disabledPrimary');
            expect(button).toBeInTheDocument();
            expect(button).toBeDisabled();
            expect(button).toHaveClass('btn-primary');
            expect(button).toHaveTextContent('Primary');
        });

        test('should render disabled secondary button', () => {
            const { container } = render(Page);
            const button = container.querySelector('#disabledSecondary');
            expect(button).toBeInTheDocument();
            expect(button).toBeDisabled();
            expect(button).toHaveClass('btn-secondary');
            expect(button).toHaveTextContent('Secondary');
        });

        test('should render all other disabled button variants', () => {
            const { container } = render(Page);
            const variants = ['Success', 'Danger', 'Warning', 'Info', 'Light', 'Dark', 'Link'];

            variants.forEach((variant) => {
                const button = container.querySelector(`#disabled${variant}`);
                expect(button).toBeInTheDocument();
                expect(button).toBeDisabled();
                expect(button).toHaveClass(`btn-${variant.toLowerCase()}`);
                expect(button).toHaveTextContent(variant);
            });
        });
    });

    // Outline Button tests
    describe('Outline buttons', () => {
        test('should render outline primary button', () => {
            const { container } = render(Page);
            const button = container.querySelector('#outlinePrimary');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-outline-primary');
            expect(button).toHaveTextContent('Primary');
        });

        test('should render outline secondary button', () => {
            const { container } = render(Page);
            const button = container.querySelector('#outlineSecondary');
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('btn-outline-secondary');
            expect(button).toHaveTextContent('Secondary');
        });

        test('should render other outline variants', () => {
            const { container } = render(Page);
            const variants = ['Success', 'Danger', 'Warning', 'Info', 'Light', 'Dark'];

            variants.forEach((variant) => {
                const button = container.querySelector(`#outline${variant}`);
                expect(button).toBeInTheDocument();
                expect(button).toHaveClass(`btn-outline-${variant.toLowerCase()}`);
                expect(button).toHaveTextContent(variant);
            });
        });
    });
});
