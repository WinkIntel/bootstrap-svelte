<!--
@component
## Form.SwitchInput
Bootstrap-styled switch input component for toggling between two states.

@example
```svelte
// Default switch
<Form.Check isSwitch>
    <Form.SwitchInput id="switchDefault" name="switchDefault" />
    <Form.CheckLabel for="switchDefault">Default switch</Form.CheckLabel>
</Form.Check>

// Checked switch
<Form.Check isSwitch>
    <Form.SwitchInput checked id="switchChecked" name="switchChecked" />
    <Form.CheckLabel for="switchChecked">Checked switch</Form.CheckLabel>
</Form.Check>

// Disabled switch
<Form.Check isSwitch>
    <Form.SwitchInput disabled id="switchDisabled" name="switchDisabled" />
    <Form.CheckLabel for="switchDisabled">Disabled switch</Form.CheckLabel>
</Form.Check>

// Disabled checked switch
<Form.Check isSwitch>
    <Form.SwitchInput checked disabled id="switchDisabledChecked" name="switchDisabledChecked" />
    <Form.CheckLabel for="switchDisabledChecked">Disabled checked switch</Form.CheckLabel>
</Form.Check>
```
### Props
- `checked` (boolean): Optional. Binds the switch state. If undefined, the switch is unchecked.
- `class` (string): Optional. Additional CSS classes to apply to the switch.
- `elementRef` (HTMLInputElement): Optional. Reference to the switch DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        checked = $bindable(undefined),
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isValid,
        ...restOfProps
    }: Form.SwitchInputProps = $props();

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

<input
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
    bind:this={elementRef}
    bind:checked
    class={classes}
    role="switch"
    type="checkbox" />
