/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/components/alert/+page.svelte', () => {
    // Base Alert tests
    test('should render base alert', () => {
        const { container } = render(Page);
        const baseAlert = container.querySelector('#baseAlert');
        expect(baseAlert).toBeInTheDocument();
        expect(baseAlert).toHaveClass('alert');
        expect(baseAlert).toHaveClass('alert-primary');
    });

    // Alert Variants tests
    describe('Alert variants', () => {
        test('should render primary variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantPrimary');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert');
            expect(alert).toHaveClass('alert-primary');
        });

        test('should render secondary variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantSecondary');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-secondary');
        });

        test('should render success variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantSuccess');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-success');
        });

        test('should render danger variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantDanger');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-danger');
        });

        test('should render warning variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantWarning');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-warning');
        });

        test('should render info variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantInfo');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-info');
        });

        test('should render light variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantLight');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-light');
        });

        test('should render dark variant', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#variantDark');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-dark');
        });
    });

    // Dismissible Alert tests
    describe('Dismissible alerts', () => {
        test('should render dismissible alert with close button', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#dismissibleAlert');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass('alert-dismissible');

            const closeButton = alert?.querySelector('.btn-close');
            expect(closeButton).toBeInTheDocument();
        });
    });

    // Additional Content tests
    describe('Alerts with additional content', () => {
        test('should render alert with additional content', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#additionalContentAlert');
            expect(alert).toBeInTheDocument();

            const heading = alert?.querySelector('.alert-heading');
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent('Well done!');

            const paragraphs = alert?.querySelectorAll('p');
            expect(paragraphs?.length).toBeGreaterThan(1);

            const divider = alert?.querySelector('hr');
            expect(divider).toBeInTheDocument();
        });
    });

    // Icon Alert tests
    describe('Alerts with icons', () => {
        test('should render alert with icon', () => {
            const { container } = render(Page);
            const alert = container.querySelector('#iconAlert');
            expect(alert).toBeInTheDocument();

            const icon = alert?.querySelector('i');
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('bi');
            expect(icon).toHaveClass('bi-info-circle-fill');
        });
    });

    // API Reference section should be present
    test('should render API reference section', () => {
        const { container } = render(Page);
        const apiSection = container.querySelector('#api');
        expect(apiSection).toBeInTheDocument();
    });
});
