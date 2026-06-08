<!--
@component
## Form.RadioInput
Bootstrap-styled radio input component for single selection options.

@example
```svelte
// Default radio
<Form.Check>
    <Form.RadioInput id="radioDefault" value="" />
    <Form.RadioLabel for="radioDefault">Default radio</Form.RadioLabel>
</Form.Check>

// Checked radio
<Form.Check>
    <Form.RadioInput checked id="radioChecked" value="" />
    <Form.RadioLabel for="radioChecked">Checked radio</Form.RadioLabel>
</Form.Check>

// Disabled radio
<Form.Check>
    <Form.RadioInput disabled id="radioDisabled" value="" />
    <Form.RadioLabel for="radioDisabled">Disabled radio</Form.RadioLabel>
</Form.Check>

// Disabled checked radio
<Form.Check>
    <Form.RadioInput checked disabled id="radioDisabledChecked" value="" />
    <Form.RadioLabel for="radioDisabledChecked">Disabled checked radio</Form.RadioLabel>
</Form.Check>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the radio.
- `elementRef` (HTMLInputElement): Optional. Reference to the radio DOM element.
- `group` (string): Optional. Name of the radio group to which this input belongs. If undefined, the radio input is not grouped.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        class: classValues,
        elementRef = $bindable(null),
        group = $bindable(undefined),
        isInvalid,
        isValid,
        ...restOfProps
    }: Form.RadioInputProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'form-check-input',
            {
                'is-valid': isValid,
                'is-invalid': isInvalid
            },
            classValues
        )
    );
</script>

<input bind:this={elementRef} bind:group class={classes} type="radio" {...restOfProps} />
