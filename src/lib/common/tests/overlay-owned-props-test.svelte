<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { Modal } from '../../Modal/index.js';
    import { Offcanvas } from '../../Offcanvas/index.js';
    import { Toast } from '../../Toast/index.js';
    import { Tooltip } from '../../Tooltip/index.js';

    let {
        kind,
        isShown = true,
        rootProps = {},
        onShow,
        onShown,
        onHide,
        onHidden
    }: {
        kind: 'Modal' | 'Offcanvas' | 'Toast' | 'Tooltip';
        isShown?: boolean;
        rootProps?: Pick<
            HTMLAttributes<HTMLDivElement>,
            'role' | 'aria-modal' | 'aria-label' | 'aria-describedby' | 'onintrostart' | 'onintroend' | 'onoutrostart' | 'onoutroend' | 'onmousedown'
        > & { 'data-custom'?: string };
        onShow?: (event: Event) => void;
        onShown?: (event: Event) => void;
        onHide?: (event: Event) => void;
        onHidden?: (event: Event) => void;
    } = $props();
</script>

<button id="owned-tooltip-reference">Reference</button>
{#if kind === 'Modal'}
    <Modal.Root {isShown} {onShow} {onShown} {onHide} {onHidden} {...rootProps} data-testid="overlay">
        <Modal.Dialog><Modal.Content><Modal.Title id="owned-title">Title</Modal.Title><Modal.Body>Content</Modal.Body></Modal.Content></Modal.Dialog>
    </Modal.Root>
{:else if kind === 'Offcanvas'}
    <Offcanvas.Root {isShown} {onShow} {onShown} {onHide} {onHidden} {...rootProps} data-testid="overlay"
        ><Offcanvas.Body>Content</Offcanvas.Body></Offcanvas.Root>
{:else if kind === 'Toast'}
    <Toast.Root {isShown} {onShow} {onShown} {onHide} {onHidden} doAutohide={false} {...rootProps} data-testid="overlay"
        ><Toast.Body>Content</Toast.Body></Toast.Root>
{:else}
    <Tooltip.Root
        {isShown}
        {onShow}
        {onShown}
        {onHide}
        {onHidden}
        container={false}
        referenceElementId="owned-tooltip-reference"
        trigger=""
        {...rootProps}
        data-testid="overlay"><Tooltip.Inner>Content</Tooltip.Inner></Tooltip.Root>
{/if}
