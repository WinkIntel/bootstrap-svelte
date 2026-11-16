<script lang="ts">
    import ColorInput from '../form-color-input.svelte';
    import FileInput from '../form-file-input.svelte';
    let {
        external = false,
        cancel = false,
        association = 'reset-form',
        defaultColor
    }: { external?: boolean; cancel?: boolean; association?: string; defaultColor?: string } = $props();
    let color = $state('#563d7c');
    let files = $state<FileList | null>(null);
    let fileValue = $state('');
    let calls = $state(0);
    let shown = $state(true);
</script>

<form
    id="reset-form"
    onreset={(event) => {
        if (cancel) event.preventDefault();
    }}>
    {#if !external && shown}
        <ColorInput defaultValue={defaultColor} name="color" bind:value={color} oninput={() => calls++} />
        <FileInput name="file" bind:files bind:value={fileValue} onchange={() => calls++} />
    {/if}
</form>
{#if external && shown}
    <ColorInput defaultValue={defaultColor} form={association} name="color" bind:value={color} oninput={() => calls++} />
    <FileInput form={association} name="file" bind:files bind:value={fileValue} onchange={() => calls++} />
{/if}
<form id="other-reset-form"></form>
<button onclick={() => (shown = false)}>Unmount inputs</button>
<output data-testid="color">{color}</output>
<output data-testid="files">{files?.length ?? 'null'}</output>
<output data-testid="file-name">{files?.[0]?.name ?? 'none'}</output>
<output data-testid="file-value">{fileValue || 'empty'}</output>
<output data-testid="calls">{calls}</output>
