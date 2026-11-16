<script lang="ts">
    import ColorInput from '../form-color-input.svelte';
    let { form }: { form: string } = $props();
    let color = $state('#123456');
</script>

<ColorInput {form} bind:value={color} />
<output>{color}</output>
