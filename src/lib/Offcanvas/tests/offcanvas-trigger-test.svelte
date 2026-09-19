<script lang="ts">
    import { Offcanvas } from '$lib/index.js';

    let {
        panelId = 'owned-panel',
        useBackdrop = 'static',
        registered = true,
        triggerVisible = true,
        disabled = false,
        fieldsetDisabled = false,
        ariaDisabled = false,
        cancelClick = false,
        onShow,
        onShown,
        onHide,
        onHidden,
        onHidePrevented
    }: {
        panelId?: string;
        useBackdrop?: Offcanvas.RootProps['useBackdrop'];
        registered?: boolean;
        triggerVisible?: boolean;
        disabled?: boolean;
        fieldsetDisabled?: boolean;
        ariaDisabled?: boolean;
        cancelClick?: boolean;
        onShow?: EventListener;
        onShown?: EventListener;
        onHide?: EventListener;
        onHidden?: EventListener;
        onHidePrevented?: EventListener;
    } = $props();

    let open = $state(false);
    let trigger: HTMLButtonElement | undefined = $state();
    let alternateTrigger: HTMLButtonElement | undefined = $state();

    function toggle(event: MouseEvent) {
        if (cancelClick || ariaDisabled) {
            event.preventDefault();
            return;
        }
        open = !open;
    }
</script>

<fieldset disabled={fieldsetDisabled}>
    {#if triggerVisible}
        <button bind:this={trigger} {disabled} aria-disabled={ariaDisabled} aria-controls={panelId} onclick={toggle}>
            <span data-testid={`${panelId}-trigger`}>Toggle {panelId}</span>
        </button>
    {/if}
</fieldset>
<button bind:this={alternateTrigger} data-testid={`${panelId}-alternate`} onclick={toggle}>Alternate {panelId}</button>
<button class="navbar-toggler" aria-controls={panelId} data-testid={`${panelId}-unrelated`}>Unrelated</button>
<Offcanvas.Root
    id={panelId}
    data-testid={panelId}
    isShown={open}
    triggerElements={registered ? [trigger, alternateTrigger] : []}
    {useBackdrop}
    {onShow}
    {onShown}
    onHide={(event) => {
        open = false;
        onHide?.(event);
    }}
    {onHidden}
    {onHidePrevented}>
    <Offcanvas.Body>Owned panel</Offcanvas.Body>
</Offcanvas.Root>
