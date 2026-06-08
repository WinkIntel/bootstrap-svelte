<script lang="ts">
    import { noop } from '$lib/common/noop.js';
    import { MediaQuery } from 'svelte/reactivity';
    import type { BreakpointEnum, BreakpointListenerRootProps } from './types.js';
    import { MediaQueryStringsByBreakpointEnum } from './types.js';

    let {
        children,
        currentBreakpoint = $bindable(undefined),
        isDisabled = false,
        onChange = noop,
        onBreakUp = noop,
        onBreakDown = noop,
        renderOn
    }: BreakpointListenerRootProps = $props();

    // Create MediaQuery instances for each breakpoint
    type MediaQueryWithBreakpoint = {
        breakpoint: BreakpointEnum;
        mediaQuery: MediaQuery;
    };
    const mediaQueries: MediaQueryWithBreakpoint[] = Object.entries(MediaQueryStringsByBreakpointEnum).map(([breakpoint, queryString]) => ({
        breakpoint: parseInt(breakpoint),
        mediaQuery: new MediaQuery(queryString)
    }));

    const doRenderChildren = (): boolean => {
        if (!children || isDisabled) {
            return false;
        }
        if (Array.isArray(renderOn)) {
            // only call includes when currentBreakpoint is defined to satisfy the BaseBreakpoint type
            if (currentBreakpoint == null) {
                return false;
            }
            return renderOn.includes(currentBreakpoint);
        } else {
            return renderOn === currentBreakpoint;
        }
    };

    // Effect to monitor all media queries and update currentBreakpoint
    $effect(() => {
        if (isDisabled) {
            return;
        }
        // Find the currently matching breakpoint
        const matchingBreakpoint: MediaQueryWithBreakpoint | undefined = mediaQueries.find(({ mediaQuery }) => mediaQuery.current);

        // Only proceed if we found a matching breakpoint and it's different from current
        if (matchingBreakpoint !== undefined && currentBreakpoint !== matchingBreakpoint.breakpoint) {
            const previousBreakpoint: BreakpointEnum | null = currentBreakpoint ?? null;
            currentBreakpoint = matchingBreakpoint.breakpoint;

            // Trigger onChange callback
            onChange({ current: currentBreakpoint, previous: previousBreakpoint });

            // Trigger direction-specific callbacks
            if (previousBreakpoint === null) {
                // First detection always counts as breaking up from null
                onBreakUp({ from: null, to: currentBreakpoint });
            } else if (currentBreakpoint > previousBreakpoint) {
                onBreakUp({ from: previousBreakpoint, to: currentBreakpoint });
            } else {
                onBreakDown({ from: previousBreakpoint, to: currentBreakpoint });
            }
        }
    });
</script>

{#if doRenderChildren()}
    {@render children?.()}
{/if}
