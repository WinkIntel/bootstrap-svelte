<script lang="ts">
    import { Modal, Offcanvas } from '$lib/index.js';
    let {
        isShown = true,
        renderPanel = true,
        showOnBreakpoint,
        empty = false,
        firstTitle = true,
        titleId,
        names = {},
        nested = false,
        modalShown = false,
        replaceRef = false
    }: {
        isShown?: boolean;
        renderPanel?: boolean;
        showOnBreakpoint?: Offcanvas.RootProps['showOnBreakpoint'];
        empty?: boolean;
        firstTitle?: boolean;
        titleId?: string | null;
        names?: Pick<Offcanvas.RootProps, 'aria-label' | 'aria-labelledby'>;
        nested?: boolean;
        modalShown?: boolean;
        replaceRef?: boolean;
    } = $props();
    let elementRef: HTMLDivElement | null = $state(null);
    let outside: HTMLDivElement;
    $effect(() => {
        if (replaceRef) elementRef = outside;
    });
</script>

<div bind:this={outside} data-testid="outside"><button>Outside</button></div>
{#if renderPanel}
    <Offcanvas.Root bind:elementRef {isShown} {showOnBreakpoint} {...names} useBackdrop={false} data-testid="panel">
        {#if firstTitle}<Offcanvas.Title id={titleId} data-testid="first-title">First title</Offcanvas.Title>{/if}
        <Offcanvas.Title id="second-title">Second title</Offcanvas.Title>
        {#if !empty}
            <div hidden><button>Hidden ancestor</button></div>
            <div style="display: none"><button>Display none</button></div>
            <div style="visibility: hidden"><button>Invisible</button></div>
            <div inert><button>Inert ancestor</button></div>
            <div aria-hidden="true"><button>ARIA hidden ancestor</button></div>
            <fieldset disabled><button>Disabled fieldset</button></fieldset>
            <button disabled>Disabled</button>
            <input type="hidden" />
            <button tabindex="-2">Negative tabindex</button>
            <button data-testid="first-action">First action</button>
            <a href="#last" data-testid="last-action">Last action</a>
        {/if}
        {#if nested}
            <Offcanvas.Root isShown={true} useBackdrop={false} data-testid="nested-panel">
                <Offcanvas.Title>Nested title</Offcanvas.Title>
                <button>Nested action</button>
            </Offcanvas.Root>
        {/if}
    </Offcanvas.Root>
{/if}
<Modal.Root isShown={modalShown} useBackdrop={false} useFade={false} data-testid="modal">
    <Modal.Dialog><Modal.Content><Modal.Body><button>Modal action</button></Modal.Body></Modal.Content></Modal.Dialog>
</Modal.Root>
