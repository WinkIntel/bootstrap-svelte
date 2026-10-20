<script lang="ts">
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
        onShow?: (event: Event) => void;
        onShown?: (event: Event) => void;
        onHide?: (event: Event) => void;
        onHidden?: (event: Event) => void;
    } = $props();
    function handleShow(event: Event) {
        onShow?.(event);
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
    {:else if kind === 'Offcanvas'}
        <Offcanvas.Root {isShown} onShow={handleShow} {onShown} {onHide} {onHidden} data-testid="overlay"
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
