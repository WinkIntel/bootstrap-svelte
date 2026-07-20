<!--
@component
## Form.HiddenInput
Bootstrap-styled hidden input component for passing data in forms without visual representation.

@example
```svelte
<Form.HiddenInput name="hiddenInput" value="Nothing to see here" />
```
### Props
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `value` (any): Optional. The value of the hidden input. If undefined, the input is empty.
-->
<script lang="ts">
    import type { Form } from './index.js';

    let { elementRef = $bindable(null), value = $bindable(undefined), ...restOfProps }: Form.HiddenInputProps = $props();
</script>

<input {...restOfProps} bind:this={elementRef} bind:value type="hidden" />
