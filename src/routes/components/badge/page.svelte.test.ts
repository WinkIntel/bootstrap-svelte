/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/components/badge/+page.svelte', () => {
    // Base Badge tests
    test('should render base badge', () => {
        const { container } = render(Page);
        const baseBadge = container.querySelector('#baseBadge');
        expect(baseBadge).toBeInTheDocument();
        expect(baseBadge).toHaveClass('badge');
        expect(baseBadge).toHaveClass('text-bg-primary');
        expect(baseBadge).toHaveTextContent('Base badge');
    });

    // Badge Variants tests
    describe('Badge variants', () => {
        test('should render primary variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantPrimary');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-primary');
            expect(badge).toHaveTextContent('Primary');
        });

        test('should render secondary variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantSecondary');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-bg-secondary');
            expect(badge).toHaveTextContent('Secondary');
        });

        test('should render success variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantSuccess');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-bg-success');
            expect(badge).toHaveTextContent('Success');
        });

        test('should render danger variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantDanger');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-bg-danger');
            expect(badge).toHaveTextContent('Danger');
        });

        test('should render warning variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantWarning');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-bg-warning');
            expect(badge).toHaveTextContent('Warning');
        });

        test('should render info variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantInfo');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-bg-info');
            expect(badge).toHaveTextContent('Info');
        });

        test('should render light variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantLight');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-bg-light');
            expect(badge).toHaveTextContent('Light');
        });

        test('should render dark variant', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#variantDark');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-bg-dark');
            expect(badge).toHaveTextContent('Dark');
        });
    });

    // Headings with Badges tests
    describe('Headings with badges', () => {
        test('should render h1 heading with badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#headingBadge1');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-secondary');
            expect(badge).toHaveTextContent('New');
        });

        test('should render h2 heading with badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#headingBadge2');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-secondary');
            expect(badge).toHaveTextContent('New');
        });

        test('should render h6 heading with badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#headingBadge6');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-secondary');
            expect(badge).toHaveTextContent('New');
        });
    });

    // Button with Badge tests
    describe('Button with badge', () => {
        test('should render badge inside a button', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#buttonBadge');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-light');
            expect(badge).toHaveTextContent('4');
        });
    });

    // Pill Badges tests
    describe('Pill badges', () => {
        test('should render primary pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillPrimary');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-primary');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Primary');
        });

        test('should render secondary pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillSecondary');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-secondary');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Secondary');
        });

        test('should render success pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillSuccess');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-success');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Success');
        });

        test('should render danger pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillDanger');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-danger');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Danger');
        });

        test('should render warning pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillWarning');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-warning');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Warning');
        });

        test('should render info pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillInfo');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-info');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Info');
        });

        test('should render light pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillLight');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-light');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Light');
        });

        test('should render dark pill badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#pillDark');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-dark');
            expect(badge).toHaveClass('rounded-pill');
            expect(badge).toHaveTextContent('Dark');
        });
    });

    // Subtle Badges tests
    describe('Subtle badges', () => {
        test('should render subtle badge with matching emphasis text color', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#subtleSecondary');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('bg-secondary-subtle');
            expect(badge).toHaveClass('text-secondary-emphasis');
            expect(badge).toHaveTextContent('Subtle');
        });
    });

    // Positioned Badges tests
    describe('Positioned badges', () => {
        test('should render positioned badge', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#positionedTopEnd');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-danger');
            expect(badge).toHaveClass('position-absolute top-0 start-100 translate-middle');
            expect(badge).toHaveTextContent('99+');
        });

        test('should render top-end positioned badge as an indicator', () => {
            const { container } = render(Page);
            const badge = container.querySelector('#positionedTopEndIndicator');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('text-bg-danger');
            expect(badge).toHaveClass('position-absolute top-0 start-100 translate-middle');
            // expect(badge).toHaveTextContent('');
        });
    });
});
