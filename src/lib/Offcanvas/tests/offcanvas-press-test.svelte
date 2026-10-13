<script lang="ts">
    import { Offcanvas } from '$lib/index.js';

    let {
        showOnBreakpoint,
        useBackdrop = true,
        onHide,
        onHidePrevented,
        onInsideClick
    }: Pick<Offcanvas.RootProps, 'showOnBreakpoint' | 'useBackdrop' | 'onHide' | 'onHidePrevented'> & {
        onInsideClick?: () => void;
    } = $props();
</script>

<Offcanvas.Root isShown={true} {showOnBreakpoint} {useBackdrop} {onHide} {onHidePrevented} data-testid="press-panel">
    <Offcanvas.Body>
        <button onclick={onInsideClick}><span data-testid="inside-press">Inside action</span></button>
        <div data-testid="shadow-host"></div>
    </Offcanvas.Body>
</Offcanvas.Root>
