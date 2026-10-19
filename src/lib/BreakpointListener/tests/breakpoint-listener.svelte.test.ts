import { mockMatchMedia } from '$lib/common/tests/mock-match-media.js';
import { render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import BreakpointListenerDisabledTest from './breakpoint-listener-disabled-test.svelte';
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
        expect(screen.getByTestId('breakdown-from').textContent).toBe(BreakpointEnum.MD.toString());
        expect(screen.getByTestId('breakdown-to').textContent).toBe(BreakpointEnum.XS.toString());
    });

    it('suppresses callbacks while disabled and catches up when re-enabled', async () => {
        const onChange = vi.fn();
        const onBreakUp = vi.fn();
        const onBreakDown = vi.fn();
        const { rerender } = render(BreakpointListenerDisabledTest, { isDisabled: true, onChange, onBreakUp, onBreakDown });
        await tick();
        setActiveBreakpoint(BreakpointEnum.MD);
        await tick();
        expect(screen.queryByTestId('disabled-content')).not.toBeInTheDocument();
        expect(screen.getByTestId('disabled-breakpoint')).toHaveTextContent('undefined');
        expect(onChange).not.toHaveBeenCalled();
        expect(onBreakUp).not.toHaveBeenCalled();
        expect(onBreakDown).not.toHaveBeenCalled();
        await rerender({ isDisabled: false });
        expect(onChange).toHaveBeenLastCalledWith({ current: BreakpointEnum.MD, previous: null });
        expect(onBreakUp).toHaveBeenLastCalledWith({ from: null, to: BreakpointEnum.MD });
        expect(screen.getByTestId('disabled-content')).toBeInTheDocument();
        await rerender({ isDisabled: true });
        expect(screen.queryByTestId('disabled-content')).not.toBeInTheDocument();
        setActiveBreakpoint(BreakpointEnum.XS);
        await tick();
        expect(onChange).toHaveBeenCalledOnce();
        expect(onBreakDown).not.toHaveBeenCalled();
        await rerender({ isDisabled: false });
        expect(onChange).toHaveBeenLastCalledWith({ current: BreakpointEnum.XS, previous: BreakpointEnum.MD });
        expect(onBreakDown).toHaveBeenCalledExactlyOnceWith({ from: BreakpointEnum.MD, to: BreakpointEnum.XS });
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
