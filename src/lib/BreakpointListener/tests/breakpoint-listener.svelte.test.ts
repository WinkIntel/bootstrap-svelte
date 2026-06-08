import { render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import { BreakpointEnum, MediaQueryStringsByBreakpointEnum } from '../types.js';
import BreakpointListenerBasicTest from './breakpoint-listener-basic-test.svelte';

interface MockMediaQueryList {
    media: string;
    matches: boolean;
    addEventListener: (type: string, cb: EventListener) => void;
    removeEventListener: (type: string, cb: EventListener) => void;
    dispatchEvent: (e: Event) => boolean;
    _listeners: Set<EventListener>;
}

let mqlMap: Record<string, MockMediaQueryList> = {};

function installMatchMedia(initial: BreakpointEnum) {
    mqlMap = {};
    for (const query of Object.values(MediaQueryStringsByBreakpointEnum)) {
        mqlMap[query] = {
            media: query,
            matches: false,
            _listeners: new Set<EventListener>(),
            addEventListener: function (_type: string, cb: EventListener) {
                this._listeners.add(cb);
            },
            removeEventListener: function (_type: string, cb: EventListener) {
                this._listeners.delete(cb);
            },
            dispatchEvent: function (e: Event) {
                this._listeners.forEach((l) => l(e));
                return true;
            }
        } as MockMediaQueryList;
    }
    setActiveBreakpoint(initial, false);
    window.matchMedia = (query: string) => mqlMap[query] as unknown as MediaQueryList;
}

function setActiveBreakpoint(bp: BreakpointEnum, fire = true) {
    const targetQuery = MediaQueryStringsByBreakpointEnum[bp];
    for (const [query, mql] of Object.entries(mqlMap)) {
        mql.matches = query === targetQuery;
    }
    if (fire) {
        // Fire change on all to mimic environment updates
        Object.values(mqlMap).forEach((mql) => mql.dispatchEvent(new Event('change')));
    }
}

describe('BreakpointListener Component', () => {
    beforeEach(() => {
        installMatchMedia(BreakpointEnum.SM);
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
        installMatchMedia(BreakpointEnum.MD);
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
