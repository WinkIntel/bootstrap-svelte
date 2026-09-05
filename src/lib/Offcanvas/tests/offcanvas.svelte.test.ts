import { BreakpointMinimumMediaQuery } from '$lib/common/types.js';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { createRawSnippet, tick } from 'svelte';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { Offcanvas } from '../index.js';
import OffcanvasBasicTest from './offcanvas-basic-test.svelte';
import OffcanvasNavbarTest from './offcanvas-navbar-test.svelte';
import OffcanvasStackedTest from './offcanvas-stacked-test.svelte';

const lgQuery = BreakpointMinimumMediaQuery.lg!;
const mdQuery = BreakpointMinimumMediaQuery.md!;

function mockMatchMedia(initialMatches: Record<string, boolean> = {}) {
    const originalMatchMedia = window.matchMedia;
    onTestFinished(() => {
        window.matchMedia = originalMatchMedia;
    });
    const queries = new Map<string, MediaQueryList>();
    window.matchMedia = vi.fn((query: string) => {
        let mediaQuery = queries.get(query);
        if (!mediaQuery) {
            mediaQuery = Object.assign(new EventTarget(), {
                media: query,
                matches: initialMatches[query] ?? false,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn()
            });
            queries.set(query, mediaQuery);
        }
        return mediaQuery;
    });

    return (query: string, matches: boolean) => {
        const mediaQuery = queries.get(query);
        if (!mediaQuery) throw new Error(`Expected a registered media query: ${query}`);
        Object.defineProperty(mediaQuery, 'matches', { value: matches, configurable: true });
        mediaQuery.dispatchEvent(new Event('change'));
    };
}

async function openStackedOffcanvas(): Promise<void> {
    await fireEvent.click(screen.getByTestId('open-offcanvas-a'));
    await screen.findByTestId('stacked-offcanvas-a');
    await fireEvent.click(screen.getByTestId('open-offcanvas-b'));
    await screen.findByTestId('stacked-offcanvas-b');
}

function getTopOffcanvasBackdrop(): HTMLElement {
    const backdrops = Array.from(document.querySelectorAll<HTMLElement>('.offcanvas-backdrop'));
    const topBackdrop = backdrops.sort((a, b) => Number(a.style.zIndex) - Number(b.style.zIndex)).at(-1);
    if (!topBackdrop) throw new Error('Expected a rendered offcanvas backdrop');
    return topBackdrop;
}

describe('Offcanvas Component', () => {
    it('should render basic offcanvas with all sub-components', () => {
        render(OffcanvasBasicTest);

        // Check if offcanvas root component is rendered
        const offcanvas = screen.getByTestId('offcanvas');
        expect(offcanvas).toHaveClass('offcanvas');
        expect(offcanvas).toHaveClass('offcanvas-start');
        expect(offcanvas).toHaveClass('test-class');
        expect(offcanvas).toHaveAttribute('id', 'test-offcanvas');

        // Check if offcanvas header is rendered
        const header = screen.getByTestId('offcanvas-header');
        expect(header).toHaveClass('offcanvas-header');

        // Check if offcanvas title is rendered
        const title = screen.getByTestId('offcanvas-title');
        expect(title).toHaveClass('offcanvas-title');
        expect(title.tagName).toBe('H5'); // Default heading level is 5
        expect(title).toHaveTextContent('Offcanvas Title');

        // Check if offcanvas body is rendered
        const body = screen.getByTestId('offcanvas-body');
        expect(body).toHaveClass('offcanvas-body');

        // Check content in the body
        const content = screen.getByTestId('offcanvas-content');
        expect(content).toHaveTextContent('This is the offcanvas body content.');

        // Check close button in the body
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toHaveClass('btn');
        expect(closeButton).toHaveClass('btn-secondary');
    });

    it('should render offcanvas with different placements', () => {
        // Render the test component
        render(OffcanvasBasicTest);

        // Check end placement
        const endOffcanvas = screen.getByTestId('end-offcanvas');
        expect(endOffcanvas).toHaveClass('offcanvas-end');
        expect(endOffcanvas).toHaveAttribute('id', 'end-offcanvas');

        // Check top placement
        const topOffcanvas = screen.getByTestId('top-offcanvas');
        expect(topOffcanvas).toHaveClass('offcanvas-top');
        expect(topOffcanvas).toHaveAttribute('id', 'top-offcanvas');

        // Check bottom placement
        const bottomOffcanvas = screen.getByTestId('bottom-offcanvas');
        expect(bottomOffcanvas).toHaveClass('offcanvas-bottom');
        expect(bottomOffcanvas).toHaveAttribute('id', 'bottom-offcanvas');
    });

    it('should render with different backdrop options', () => {
        render(OffcanvasBasicTest);

        // Static backdrop option
        const staticBackdrop = screen.getByTestId('static-backdrop');
        expect(staticBackdrop).toHaveClass('offcanvas');

        // No backdrop option
        const noBackdrop = screen.getByTestId('no-backdrop');
        expect(noBackdrop).toHaveClass('offcanvas');
    });

    it('should render responsive offcanvas with breakpoint class', () => {
        render(OffcanvasBasicTest);

        // Check responsive offcanvas with lg breakpoint
        const responsiveOffcanvas = screen.getByTestId('responsive');
        expect(responsiveOffcanvas).toHaveClass('offcanvas-lg');
        expect(responsiveOffcanvas).not.toHaveClass('offcanvas');
    });

    it('should create offcanvas with different props directly', () => {
        // Test with explicit props by directly rendering Offcanvas.Root
        const { container: smContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'sm' } });
        expect(smContainer.querySelector('.offcanvas-sm')).not.toBeNull();

        const { container: mdContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'md' } });
        expect(mdContainer.querySelector('.offcanvas-md')).not.toBeNull();

        const { container: xlContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'xl' } });
        expect(xlContainer.querySelector('.offcanvas-xl')).not.toBeNull();

        const { container: xxlContainer } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'xxl' } });
        expect(xxlContainer.querySelector('.offcanvas-xxl')).not.toBeNull();
    });

    it('should apply custom classes to Offcanvas components', () => {
        const { container } = render(Offcanvas.Root, {
            props: {
                class: 'custom-offcanvas-class',
                isShown: true,
                placement: 'start'
            }
        });

        const offcanvas = container.querySelector('.offcanvas');
        expect(offcanvas).not.toBeNull();
        expect(offcanvas).toHaveClass('custom-offcanvas-class');
        expect(offcanvas).toHaveClass('offcanvas-start');
    });

    it('should render header with dismissible button when isDismissible is true', () => {
        render(OffcanvasBasicTest);

        const offcanvas = screen.getByTestId('offcanvas');
        const closeButton = offcanvas.querySelector('.btn-close');
        expect(closeButton).not.toBeNull();
        expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });

    it('should render title with custom heading level', () => {
        const { container: h1Container } = render(Offcanvas.Title, {
            props: {
                level: 1,
                children: createRawSnippet(() => ({
                    render: () => 'H1 Title'
                }))
            }
        });

        const h1Title = h1Container.querySelector('h1');
        expect(h1Title).not.toBeNull();
        expect(h1Title).toHaveClass('offcanvas-title');
        expect(h1Title).toHaveTextContent('H1 Title');

        const { container: h3Container } = render(Offcanvas.Title, {
            props: {
                level: 3,
                children: createRawSnippet(() => ({
                    render: () => 'H3 Title'
                }))
            }
        });

        const h3Title = h3Container.querySelector('h3');
        expect(h3Title).not.toBeNull();
        expect(h3Title).toHaveClass('offcanvas-title');
        expect(h3Title).toHaveTextContent('H3 Title');
    });

    it('should have appropriate ARIA attributes when visible', () => {
        const { container } = render(Offcanvas.Root, {
            props: {
                isShown: true
            }
        });

        const offcanvas = container.querySelector('.offcanvas');
        expect(offcanvas).toHaveAttribute('aria-modal', 'true');
        expect(offcanvas).toHaveAttribute('role', 'dialog');
        expect(offcanvas).toHaveAttribute('tabindex', '-1');
    });

    it('only reports a prevented static non-keyboard dismissal for Escape', async () => {
        const onHidePrevented = vi.fn();
        render(Offcanvas.Root, {
            props: { isShown: true, isKeyboardDismissible: false, onHidePrevented, useBackdrop: 'static' }
        });

        await fireEvent.keyDown(window, { key: 'a' });
        expect(onHidePrevented).not.toHaveBeenCalled();

        await fireEvent.keyDown(window, { key: 'Escape' });
        expect(onHidePrevented).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    describe('without a backdrop', () => {
        it('accepts navbar visibility prop changes without overriding a later toggler dismissal', async () => {
            const user = userEvent.setup();
            const onShown = vi.fn();
            const { rerender } = render(OffcanvasNavbarTest, { props: { isShown: false, onShown } });
            const toggler = screen.getByTestId('navbar-toggler');

            await rerender({ isShown: true });
            await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
            expect(toggler).toHaveAttribute('aria-expanded', 'true');
            await user.click(toggler);
            await waitFor(() => expect(screen.queryByTestId('navbar-offcanvas')).not.toBeInTheDocument());

            await rerender({ isShown: false });
            expect(toggler).toHaveAttribute('aria-expanded', 'false');
            expect(screen.queryByTestId('navbar-offcanvas')).not.toBeInTheDocument();
        });

        it('opens, closes, and reopens from the navbar toggler with a full pointer click', async () => {
            const user = userEvent.setup();
            const onShown = vi.fn();
            const onHidden = vi.fn();
            render(OffcanvasNavbarTest, { props: { onShown, onHidden } });
            const toggler = screen.getByTestId('navbar-toggler');

            expect(toggler).toHaveAttribute('aria-expanded', 'false');
            expect(toggler).toHaveClass('collapsed');
            expect(screen.queryByTestId('navbar-offcanvas')).not.toBeInTheDocument();

            await user.click(toggler);
            await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));
            expect(screen.getByTestId('navbar-offcanvas')).toHaveClass('show');
            expect(toggler).toHaveAttribute('aria-expanded', 'true');
            expect(toggler).not.toHaveClass('collapsed');
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();

            await user.click(toggler);
            await waitFor(() => expect(screen.queryByTestId('navbar-offcanvas')).not.toBeInTheDocument());
            expect(onHidden).toHaveBeenCalledTimes(1);
            expect(toggler).toHaveAttribute('aria-expanded', 'false');
            expect(toggler).toHaveClass('collapsed');

            await user.click(toggler);
            await waitFor(() => expect(onShown).toHaveBeenCalledTimes(2));
            expect(screen.getByTestId('navbar-offcanvas')).toHaveClass('show');
            expect(toggler).toHaveAttribute('aria-expanded', 'true');
            expect(toggler).not.toHaveClass('collapsed');
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
        });

        it('ignores outside mousedown without reporting a dismissal or preventing one', async () => {
            vi.useFakeTimers();
            try {
                const onHide = vi.fn();
                const onHidden = vi.fn();
                const onHidePrevented = vi.fn();
                render(Offcanvas.Root, { props: { isShown: true, useBackdrop: false, onHide, onHidden, onHidePrevented } });
                await tick();
                await vi.runAllTimersAsync();

                await fireEvent.mouseDown(document.body);
                // Finish any dismissal transition before asserting that the panel stayed open.
                await vi.runAllTimersAsync();

                expect(screen.getByRole('dialog')).toHaveClass('show');
                expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
                expect(onHide).not.toHaveBeenCalled();
                expect(onHidden).not.toHaveBeenCalled();
                expect(onHidePrevented).not.toHaveBeenCalled();
            } finally {
                vi.useRealTimers();
            }
        });

        it.each(['Escape', 'dismiss button'])('still closes through %s', async (dismissal) => {
            const user = userEvent.setup();
            const onShown = vi.fn();
            const onHidden = vi.fn();
            render(OffcanvasNavbarTest, { props: { onShown, onHidden } });
            const toggler = screen.getByTestId('navbar-toggler');
            await user.click(toggler);
            await waitFor(() => expect(onShown).toHaveBeenCalledTimes(1));

            if (dismissal === 'Escape') {
                await user.keyboard('{Escape}');
            } else {
                await user.click(screen.getByRole('button', { name: 'Close' }));
            }

            await waitFor(() => expect(screen.queryByTestId('navbar-offcanvas')).not.toBeInTheDocument());
            expect(onHidden).toHaveBeenCalledTimes(1);
            expect(toggler).toHaveAttribute('aria-expanded', 'false');
            expect(toggler).toHaveClass('collapsed');
        });
    });

    describe('changing responsive breakpoints', () => {
        it('hides an implicitly shown offcanvas when its matched breakpoint is cleared', async () => {
            mockMatchMedia({ [lgQuery]: true });
            const { rerender } = render(Offcanvas.Root, { props: { showOnBreakpoint: 'lg' } });

            expect(screen.getByRole('dialog')).toHaveClass('offcanvas-lg', 'show');
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();

            await rerender({ showOnBreakpoint: undefined });

            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
        });

        it('keeps an explicitly shown offcanvas open with a backdrop when its matched breakpoint is cleared', async () => {
            mockMatchMedia({ [lgQuery]: true });
            const { rerender } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'lg' } });

            expect(screen.getByRole('dialog')).toHaveClass('offcanvas-lg', 'show');
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();

            await rerender({ showOnBreakpoint: undefined });

            expect(screen.getByRole('dialog')).toHaveClass('offcanvas', 'show');
            expect(screen.getByRole('dialog')).not.toHaveClass('offcanvas-lg');
            await waitFor(() => expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument());
        });

        it('ignores the cleared query and resumes responsive behavior with a new breakpoint', async () => {
            const setMatch = mockMatchMedia();
            const { rerender } = render(Offcanvas.Root, { props: { showOnBreakpoint: 'lg' } });
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            await rerender({ showOnBreakpoint: undefined });
            setMatch(lgQuery, true);
            await tick();
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            await rerender({ showOnBreakpoint: 'md' });
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            setMatch(mdQuery, true);
            await waitFor(() => expect(screen.getByRole('dialog')).toHaveClass('offcanvas-md', 'show'));
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();

            setMatch(lgQuery, false);
            await tick();
            expect(screen.getByRole('dialog')).toHaveClass('show');

            setMatch(mdQuery, false);
            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        });

        it.each([true, false])('preserves a prop changed to %s while the breakpoint matched', async (isShown) => {
            mockMatchMedia({ [lgQuery]: true });
            const { rerender } = render(Offcanvas.Root, { props: { isShown: false, showOnBreakpoint: 'lg' } });
            await rerender({ isShown: true });
            if (!isShown) await rerender({ isShown: false });

            await rerender({ showOnBreakpoint: undefined });

            if (isShown) {
                await waitFor(() => expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument());
                expect(screen.getByRole('dialog')).toHaveClass('show');
            } else {
                await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
                expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
            }
        });

        it('locks once when a shown panel becomes an overlay and releases when it becomes inline', async () => {
            mockMatchMedia({ [lgQuery]: true });
            const { rerender, unmount } = render(Offcanvas.Root, { props: { isShown: true, showOnBreakpoint: 'lg' } });
            await tick();
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');

            await rerender({ showOnBreakpoint: undefined });
            await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
            expect(document.body.style.overflow).toBe('hidden');
            await rerender({ class: 'rerendered' });
            expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');

            await rerender({ showOnBreakpoint: 'lg' });
            await waitFor(() => expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count'));
            expect(document.body.style.overflow).toBe('');
            expect(screen.getByRole('dialog')).toHaveClass('show');

            await rerender({ showOnBreakpoint: undefined, isBodyScrollable: true });
            expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
            await rerender({ isBodyScrollable: false });
            await waitFor(() => expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1'));
            await unmount();
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
            expect(document.body.style.overflow).toBe('');
        });

        it('keeps the navbar breakpoint when the nested offcanvas breakpoint is cleared', async () => {
            mockMatchMedia({ [lgQuery]: true });
            const { rerender } = render(OffcanvasNavbarTest, { props: { showOnBreakpoint: 'lg', useBackdrop: true } });
            await waitFor(() => expect(screen.getByTestId('navbar-offcanvas')).toHaveClass('show'));
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();

            await rerender({ showOnBreakpoint: undefined });

            expect(screen.getByTestId('navbar-toggler')).toHaveAttribute('aria-expanded', 'true');
            expect(screen.getByTestId('navbar-offcanvas')).toHaveClass('show');
            expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
            expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
        });
    });

    describe('stacked pointer ownership', () => {
        it('keeps both panels open when the top has no backdrop, then restores lower backdrop dismissal', async () => {
            vi.useFakeTimers();
            try {
                render(OffcanvasStackedTest);
                await fireEvent.click(screen.getByTestId('remove-offcanvas-b-backdrop'));
                await fireEvent.click(screen.getByTestId('open-offcanvas-a'));
                await vi.runAllTimersAsync();
                await fireEvent.click(screen.getByTestId('open-offcanvas-b'));
                await vi.runAllTimersAsync();
                const lowerBackdrop = getTopOffcanvasBackdrop();

                await fireEvent.mouseDown(lowerBackdrop);
                await vi.runAllTimersAsync();
                expect(screen.getByTestId('stacked-offcanvas-a')).toHaveClass('show');
                expect(screen.getByTestId('stacked-offcanvas-b')).toHaveClass('show');
                expect(document.querySelectorAll('.offcanvas-backdrop')).toHaveLength(1);

                await fireEvent.keyDown(window, { key: 'Escape' });
                expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '2');
                await vi.runAllTimersAsync();
                expect(screen.queryByTestId('stacked-offcanvas-b')).not.toBeInTheDocument();
                expect(screen.getByTestId('stacked-offcanvas-a')).toHaveClass('show');
                expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');

                await fireEvent.mouseDown(lowerBackdrop);
                expect(document.body).toHaveAttribute('data-scrollbar-lock-count', '1');
                await vi.runAllTimersAsync();
                expect(screen.queryByTestId('stacked-offcanvas-a')).not.toBeInTheDocument();
                expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
            } finally {
                vi.useRealTimers();
            }
        });

        it('does not dismiss an underlying offcanvas when pointer activity is inside the top offcanvas', async () => {
            render(OffcanvasStackedTest);
            await openStackedOffcanvas();

            await fireEvent.mouseDown(screen.getByTestId('offcanvas-b-content'));

            expect(screen.getByTestId('stacked-offcanvas-a')).toHaveClass('show');
            expect(screen.getByTestId('stacked-offcanvas-b')).toHaveClass('show');
        });

        it('dismisses only the top offcanvas backdrop, then transfers pointer ownership to the remaining offcanvas', async () => {
            render(OffcanvasStackedTest);
            await openStackedOffcanvas();

            await fireEvent.mouseDown(getTopOffcanvasBackdrop());

            await waitFor(() => expect(screen.queryByTestId('stacked-offcanvas-b')).not.toBeInTheDocument());
            expect(screen.getByTestId('stacked-offcanvas-a')).toHaveClass('show');

            await fireEvent.mouseDown(getTopOffcanvasBackdrop());
            await waitFor(() => expect(screen.queryByTestId('stacked-offcanvas-a')).not.toBeInTheDocument());
        });

        it('lets only the top dismissible offcanvas react to an outside body pointer event', async () => {
            render(OffcanvasStackedTest);
            await openStackedOffcanvas();

            await fireEvent.mouseDown(document.body);

            expect(screen.getByTestId('stacked-offcanvas-a')).toHaveClass('show');
            await waitFor(() => expect(screen.queryByTestId('stacked-offcanvas-b')).not.toBeInTheDocument());
        });

        it('lets only the top static offcanvas report a prevented outside pointer dismissal', async () => {
            render(OffcanvasStackedTest);
            await fireEvent.click(screen.getByTestId('make-offcanvas-b-static'));
            await openStackedOffcanvas();

            await fireEvent.mouseDown(document.body);

            expect(screen.getByTestId('stacked-offcanvas-a')).toHaveClass('show');
            expect(screen.getByTestId('stacked-offcanvas-b')).toHaveClass('show');
            expect(screen.getByTestId('offcanvas-a-prevented-count')).toHaveTextContent('0');
            expect(screen.getByTestId('offcanvas-b-prevented-count')).toHaveTextContent('1');
        });
    });
});
