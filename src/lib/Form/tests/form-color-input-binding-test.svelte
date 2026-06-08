<script lang="ts">
    import ColorInput from '../form-color-input.svelte';

    let color = $state('#563d7c');
    let elementRef = $state<HTMLInputElement | null>(null);
</script>

<ColorInput bind:elementRef bind:value={color} data-testid="color-input" />
<span data-testid="bound-value">{color || 'empty'}</span>
<span data-testid="bound-element-type">{elementRef?.type ?? 'none'}</span>
<button data-testid="set-accent" onclick={() => (color = '#ff5722')} type="button">Set accent</button>
<button data-testid="clear-color" onclick={() => (color = '')} type="button">Clear</button>
