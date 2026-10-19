<script lang="ts">
    import { BreakpointEnum, BreakpointListener } from '../index.js';
    import type { BreakpointListenerRootProps } from '../types.js';
    let props: BreakpointListenerRootProps = $props();
    let currentBreakpoint = $state<BreakpointEnum>();
</script>

<BreakpointListener {...props} bind:currentBreakpoint renderOn={BreakpointEnum.MD}>
    <p data-testid="disabled-content">Medium content</p>
</BreakpointListener>
<p data-testid="disabled-breakpoint">{currentBreakpoint ?? 'undefined'}</p>
