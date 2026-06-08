<!--
@component
## Form.RadioLabel
Bootstrap-styled label component specifically for radio inputs.

@example
```svelte
// Radio with label
<Form.Check>
    <Form.RadioInput id="radioExample" name="radioExample" value="option1" />
    <Form.RadioLabel for="radioExample">Radio example</Form.RadioLabel>
</Form.Check>

// Radio group with labels
<div>
    <Form.Check>
        <Form.RadioInput id="radio1" name="radioGroup" value="option1" />
        <Form.RadioLabel for="radio1">First radio</Form.RadioLabel>
    </Form.Check>
    <Form.Check>
        <Form.RadioInput id="radio2" name="radioGroup" value="option2" />
        <Form.RadioLabel for="radio2">Second radio</Form.RadioLabel>
    </Form.Check>
    <Form.Check>
        <Form.RadioInput id="radio3" name="radioGroup" value="option3" />
        <Form.RadioLabel for="radio3">Third radio</Form.RadioLabel>
    </Form.Check>
</div>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the label.
- `elementRef` (HTMLLabelElement): Optional. Reference to the label DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Form.RadioLabelProps = $props();

    let classes: string = $derived(uniqueClsx('form-check-label', classValues));
</script>

<label bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</label>
