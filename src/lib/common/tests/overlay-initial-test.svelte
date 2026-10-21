<script lang="ts">
    import { Navbar } from '../../Navbar/index.js';
    import { Modal } from '../../Modal/index.js';
    import { Offcanvas } from '../../Offcanvas/index.js';
    import { Toast } from '../../Toast/index.js';
    import { Tooltip } from '../../Tooltip/index.js';
    let {
        kind,
        isShown = true,
        mounted = true,
        closeOnShow = false,
        portal = false,
        clearRefOnShow = false,
        responsiveNavbar = false,
        showOnBreakpoint,
        onShow,
        onShown,
        onHide,
        onHidden
    }: {
        kind: 'Modal' | 'Offcanvas' | 'Toast' | 'Tooltip';
        isShown?: boolean;
        mounted?: boolean;
        closeOnShow?: boolean;
        portal?: boolean;
        clearRefOnShow?: boolean;
        responsiveNavbar?: boolean;
        showOnBreakpoint?: Offcanvas.RootProps['showOnBreakpoint'];
        onShow?: (event: Event) => void;
        onShown?: (event: Event) => void;
        onHide?: (event: Event) => void;
        onHidden?: (event: Event) => void;
    } = $props();
    let elementRef: HTMLDivElement | null = $state(null);
    function handleShow(event: Event) {
        onShow?.(event);
        if (clearRefOnShow) elementRef = null;
        if (closeOnShow) isShown = false;
    }
    export function hide() {
        isShown = false;
    }
    export function show() {
        isShown = true;
    }
</script>

<button id="initial-tooltip-reference">Reference</button>
{#if mounted}
    {#if kind === 'Modal'}
        <Modal.Root {isShown} onShow={handleShow} {onShown} {onHide} {onHidden} data-testid="overlay">
            <Modal.Dialog><Modal.Content><Modal.Body>Initially open</Modal.Body></Modal.Content></Modal.Dialog>
        </Modal.Root>
    {:else if kind === 'Offcanvas' && responsiveNavbar}
        <Navbar.Root expandOnBreakpoint="lg"
            ><Offcanvas.Root {isShown} onShow={handleShow} {onShown} data-testid="overlay"
                ><Offcanvas.Body>Inline navigation</Offcanvas.Body></Offcanvas.Root
            ></Navbar.Root>
    {:else if kind === 'Offcanvas'}
        <Offcanvas.Root bind:elementRef {isShown} {showOnBreakpoint} onShow={handleShow} {onShown} {onHide} {onHidden} data-testid="overlay"
            ><Offcanvas.Body>Initially open</Offcanvas.Body></Offcanvas.Root>
    {:else if kind === 'Toast'}
        <Toast.Root {isShown} onShow={handleShow} {onShown} {onHide} {onHidden} doAutohide={false} data-testid="overlay"
            ><Toast.Body>Initially open</Toast.Body></Toast.Root>
    {:else}
        <Tooltip.Root
            container={portal ? 'body' : false}
            {isShown}
            onShow={handleShow}
            {onShown}
            {onHide}
            {onHidden}
            referenceElementId="initial-tooltip-reference"
            trigger=""
            data-testid="overlay"><Tooltip.Inner>Initially open</Tooltip.Inner></Tooltip.Root>
    {/if}
{/if}
