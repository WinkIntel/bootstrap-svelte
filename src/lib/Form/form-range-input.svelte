<!--
@component
## Form.RangeInput
Bootstrap-styled range slider input component for selecting a value within a range.

@example
```svelte
<script>
  import { Form } from '$lib';
</script>

// Default range input
<Form.RangeInput max="5" min="0" step="0.5" title="Set a number" value="1" />

// Disabled range input
<Form.RangeInput disabled max="5" min="0" step="0.5" title="Set a number" value="1" />

// With label and current value display
<Form.Group>
    <Form.InputLabel for="customRange">Example range</Form.InputLabel>
    <Form.RangeInput id="customRange" max="10" min="0" />
</Form.Group>

// With steps and ticks
<Form.Group>
    <Form.InputLabel for="stepRange">Range with steps</Form.InputLabel>
    <Form.RangeInput id="stepRange" max="5" min="0" step="1" />
    <div class="d-flex justify-content-between">
        <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
    </div>
</Form.Group>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the range input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `value` (number): Optional. The numeric value of the input. If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { class: classValues, elementRef = $bindable(null), value = $bindable(undefined), ...restOfProps }: Form.RangeInputProps = $props();

    let classes: string = $derived(uniqueClsx('form-range', classValues));
</script>

<input bind:this={elementRef} bind:value class={classes} type="range" {...restOfProps} />
