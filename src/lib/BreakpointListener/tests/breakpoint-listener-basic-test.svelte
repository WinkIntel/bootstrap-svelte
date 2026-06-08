<script lang="ts">
    import { BreakpointEnum, BreakpointListener } from '../index.js';

    // State values mirroring the demo page for assertions in tests
    let currentBreakpoint = $state<BreakpointEnum | undefined>(undefined);
    let onChangeCurrentBreakpoint = $state<BreakpointEnum | undefined>(undefined);
    let onChangePreviousBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakUpFromBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakUpToBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakDownFromBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakDownToBreakpoint = $state<BreakpointEnum | null>(null);
</script>

<!-- Main monitor exercising binding + callbacks -->
<BreakpointListener
    bind:currentBreakpoint
    onChange={(changeEvent) => {
        onChangeCurrentBreakpoint = changeEvent.current;
        onChangePreviousBreakpoint = changeEvent.previous;
    }}
    onBreakUp={(breakEvent) => {
        onBreakUpFromBreakpoint = breakEvent.from;
        onBreakUpToBreakpoint = breakEvent.to;
    }}
    onBreakDown={(breakEvent) => {
        onBreakDownFromBreakpoint = breakEvent.from;
        onBreakDownToBreakpoint = breakEvent.to;
    }} />

<!-- Render-on single breakpoint example -->
<BreakpointListener renderOn={BreakpointEnum.MD}>
    <p data-testid="single-md">single md content</p>
</BreakpointListener>

<!-- Render-on multiple breakpoint example -->
<BreakpointListener renderOn={[BreakpointEnum.MD, BreakpointEnum.LG]}>
    <p data-testid="multi-md-lg">multi md lg content</p>
</BreakpointListener>

<!-- Expose state for assertions -->
<p data-testid="current-breakpoint-value">{currentBreakpoint ?? 'undefined'}</p>
<p data-testid="onchange-current-value">{onChangeCurrentBreakpoint ?? 'undefined'}</p>
<p data-testid="onchange-previous-value">{onChangePreviousBreakpoint ?? 'undefined'}</p>
<p data-testid="breakup-from">{onBreakUpFromBreakpoint ?? 'undefined'}</p>
<p data-testid="breakup-to">{onBreakUpToBreakpoint ?? 'undefined'}</p>
<p data-testid="breakdown-from">{onBreakDownFromBreakpoint ?? 'undefined'}</p>
<p data-testid="breakdown-to">{onBreakDownToBreakpoint ?? 'undefined'}</p>
