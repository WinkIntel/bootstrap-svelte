<!--
@component
## Form.SwitchLabel
Bootstrap-styled label component specifically for switch inputs.

@example
```svelte
// Radio with label
<Form.Check isSwitch>
    <Form.SwitchInput id="switchExample" name="switchExample" value="option1" />
    <Form.SwitchLabel for="switchExample">Radio example</Form.RadioLabel>
</Form.Check>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the label.
- `elementRef` (HTMLLabelElement): Optional. Reference to the label DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Form.SwitchLabelProps = $props();

    let classes: string = $derived(uniqueClsx('form-check-label', classValues));
</script>

<label bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</label>
