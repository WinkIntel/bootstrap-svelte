<!--
@component
## Form.Check
Bootstrap-styled container for checkbox and radio inputs with their labels.

@example
```svelte
// Default checkbox
<Form.Check>
    <Form.CheckInput id="checkDefault" name="checkDefault" value="" />
    <Form.CheckLabel for="checkDefault">Default checkbox</Form.CheckLabel>
</Form.Check>

// Switch checkbox
<Form.Check isSwitch>
    <Form.SwitchInput checked id="switchChecked" name="switchChecked" value="" />
    <Form.CheckLabel for="switchChecked">Checked checkbox</Form.CheckLabel>
</Form.Check>

// Checked checkbox
<Form.Check>
    <Form.CheckInput checked id="checkChecked" name="checkChecked" value="" />
    <Form.CheckLabel for="checkChecked">Checked checkbox</Form.CheckLabel>
</Form.Check>

// Disabled checkbox
<Form.Check>
    <Form.CheckInput disabled id="checkDisabled" name="checkDisabled" value="" />
    <Form.CheckLabel for="checkDisabled">Disabled checkbox</Form.CheckLabel>
</Form.Check>

// Radio buttons
<Form.Check>
    <Form.RadioInput id="radioDefault1" name="radioDefault" value="option1" />
    <Form.CheckLabel for="radioDefault1">Default radio 1</Form.CheckLabel>
</Form.Check>
<Form.Check>
    <Form.RadioInput id="radioDefault2" name="radioDefault" value="option2" />
    <Form.CheckLabel for="radioDefault2">Default radio 2</Form.CheckLabel>
</Form.Check>
```
### Props
- `children` (any): Required. Child elements to be rendered inside the check container.
- `class` (string): Optional. Additional CSS classes to apply to the container.
- `elementRef` (HTMLDivElement): Optional. Reference to the container DOM element.
- `isSwitch` (boolean): Optional. If true, applies switch styles to the check container.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        isInline = false,
        isSwitch = false,
        ...restOfProps
    }: Form.CheckProps = $props();

    let classes: string = $derived(uniqueClsx('form-check', { 'form-switch': isSwitch, 'form-check-inline': isInline }, classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>
