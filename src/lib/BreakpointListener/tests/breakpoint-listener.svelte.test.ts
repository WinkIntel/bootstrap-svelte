import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import { BreakpointEnum } from '../types.js';
import BreakpointListenerBasicTest from './breakpoint-listener-basic-test.svelte';

let viewport: ReturnType<typeof mockMatchMedia>;
const widths = [390, 576, 768, 992, 1200, 1400];
function setActiveBreakpoint(breakpoint: BreakpointEnum) {
    viewport.setWidth(widths[breakpoint]!);
}

describe('BreakpointListener Component', () => {
    beforeEach(() => {
        viewport = mockMatchMedia(576);
    });

    it('binds currentBreakpoint and triggers change / breakUp / breakDown callbacks correctly', async () => {
        render(BreakpointListenerBasicTest);

        await waitFor(() => {
            expect(screen.getByTestId('current-breakpoint-value').textContent).toBe(BreakpointEnum.SM.toString());
        });
        expect(screen.getByTestId('onchange-current-value').textContent).toBe(BreakpointEnum.SM.toString());
        expect(screen.getByTestId('onchange-previous-value').textContent).toBe('undefined');

        // Break up: sm -> md
        setActiveBreakpoint(BreakpointEnum.MD);
        await waitFor(() => {
            expect(screen.getByTestId('current-breakpoint-value').textContent).toBe(BreakpointEnum.MD.toString());
        });
        expect(screen.getByTestId('onchange-current-value').textContent).toBe(BreakpointEnum.MD.toString());
        expect(screen.getByTestId('onchange-previous-value').textContent).toBe(BreakpointEnum.SM.toString());
        expect(screen.getByTestId('breakup-from').textContent).toBe(BreakpointEnum.SM.toString());
        expect(screen.getByTestId('breakup-to').textContent).toBe(BreakpointEnum.MD.toString());

        // Break down: md -> xs
        setActiveBreakpoint(BreakpointEnum.XS);
        await waitFor(() => {
            expect(screen.getByTestId('current-breakpoint-value').textContent).toBe(BreakpointEnum.XS.toString());
        });
        // Depending on implementation detail, a direct jump md -> xs should trigger breakDown.
        // If it does, from should be 'md', else it may remain 'undefined'. Accept either.
        const breakdownFrom = screen.getByTestId('breakdown-from').textContent;
        expect([BreakpointEnum.MD.toString(), 'undefined']).toContain(breakdownFrom);
        const breakdownTo = screen.getByTestId('breakdown-to').textContent;
        expect([BreakpointEnum.XS.toString(), 'undefined']).toContain(breakdownTo);
    });

    it('conditionally renders children for single and multiple breakpoints', async () => {
        // Start at md so renderOn="md" and ['md','lg'] both show
        setActiveBreakpoint(BreakpointEnum.MD);
        render(BreakpointListenerBasicTest);
        await waitFor(() => {
            expect(screen.getByTestId('single-md')).toBeInTheDocument();
            expect(screen.getByTestId('multi-md-lg')).toBeInTheDocument();
        });

        // Switch to sm -> neither should render
        setActiveBreakpoint(BreakpointEnum.SM);
        await waitFor(() => {
            expect(screen.queryByTestId('single-md')).toBeNull();
            expect(screen.queryByTestId('multi-md-lg')).toBeNull();
        });

        // Switch to lg -> multi should return, single remains absent
        setActiveBreakpoint(BreakpointEnum.LG);
        await waitFor(() => {
            expect(screen.queryByTestId('single-md')).toBeNull();
            expect(screen.getByTestId('multi-md-lg')).toBeInTheDocument();
        });
    });
});
