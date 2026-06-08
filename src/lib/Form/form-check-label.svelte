<!--
@component
## Form.CheckLabel
Bootstrap-styled label component for checkbox and radio inputs.

@example
```svelte
// Checkbox with label
<Form.Check>
    <Form.CheckInput id="checkExample" name="checkExample" />
    <Form.CheckLabel for="checkExample">Checkbox example</Form.CheckLabel>
</Form.Check>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the label.
- `elementRef` (HTMLLabelElement): Optional. Reference to the label DOM element.
- `for` (string): Optional. ID of the input element this label is associated with.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), elementType = 'label', ...restOfProps }: Form.CheckLabelProps = $props();

    let classes: string = $derived(uniqueClsx('form-check-label', classValues));
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</svelte:element>
