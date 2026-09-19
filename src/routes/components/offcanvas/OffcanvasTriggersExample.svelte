<script lang="ts">
    import { Button, Offcanvas } from '$lib/index.js';

    let open = $state(false);
    let trigger: HTMLElement | null = $state(null);
    let backdrop: Offcanvas.RootProps['useBackdrop'] = $state('static');
    let prevented = $state(0);
</script>

<div class="card mb-3">
    <div class="card-body">
        <label for="owned-trigger-backdrop" class="form-label">Backdrop</label>
        <select id="owned-trigger-backdrop" class="form-select mb-3" bind:value={backdrop}>
            <option value="static">Static</option>
            <option value={true}>Enabled</option>
            <option value={false}>Disabled</option>
        </select>
        <Button
            bind:elementRef={trigger}
            aria-controls="owned-trigger-offcanvas"
            aria-expanded={open}
            style="position: relative; z-index: 1050;"
            onclick={() => (open = !open)}>Toggle owned Offcanvas</Button>
        <p class="mt-3 mb-0" aria-live="polite">Prevented outside dismissals: {prevented}</p>
        <Offcanvas.Root
            id="owned-trigger-offcanvas"
            aria-labelledby="owned-trigger-title"
            placement="end"
            isShown={open}
            triggerElements={[trigger]}
            useBackdrop={backdrop}
            onHide={() => (open = false)}
            onHidePrevented={() => (prevented += 1)}>
            <Offcanvas.Header>
                <Offcanvas.Title id="owned-trigger-title">Consumer-controlled trigger</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                The toggle remains above the backdrop so you can open, close, and reopen this panel. With a static backdrop, only an outside dismissal
                attempt increases the counter.
            </Offcanvas.Body>
        </Offcanvas.Root>
    </div>
</div>
