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
- `group` (unknown[] | null): Optional. Bindable switch group. Use an array, or null or undefined for standalone checked state.
- `indeterminate` (boolean): Optional. Native alias for `isIndeterminate`.
- `isIndeterminate` (boolean): Optional. Sets the indeterminate state; an explicit false takes precedence over the native alias.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
-->
<script lang="ts">
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { Form } from './index.js';
    import { syncFormReset } from './form-reset.js';

    let {
        'aria-invalid': ariaInvalid,
        checked = $bindable(undefined),
        class: classValues,
        elementRef = $bindable(null),
        group = $bindable(undefined),
        indeterminate,
        isIndeterminate,
        isInvalid,
        isValid,
        onchange = noop,
        value = undefined,
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
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        if (group != null) {
            if (!Array.isArray(group)) {
                console.warn('Form.SwitchInput: `group` prop should be an array when used for grouped inputs.');
            } else {
                const isIncluded = group.includes(value);
                if (event.currentTarget.checked && !isIncluded) {
                    // Add the value to the group array
                    group = [...(group as unknown[]), value];
                } else if (!event.currentTarget.checked && isIncluded) {
                    // Remove the value from the group array
                    group = (group as unknown[]).filter((val) => val !== value);
                }
            }
        }
        if (onchange !== null) {
            onchange(event);
        }
    };

    $effect(() => {
        if (elementRef) {
            (elementRef as HTMLInputElement).indeterminate = (isIndeterminate ?? indeterminate) === true;
        }
    });

    $effect(() => {
        if (group != null && Array.isArray(group)) {
            checked = (group as unknown[]).includes(value);
        }
    });
</script>

<input
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
    bind:this={elementRef}
    bind:checked
    class={classes}
    onchange={handleChange}
    use:syncFormReset={(state) => {
        if (!Array.isArray(group)) return;
        const included = group.includes(value);
        if (state.checked && !included) group = [...group, value];
        else if (!state.checked && included) group = group.filter((member) => member !== value);
    }}
    {value}
    role="switch"
    type="checkbox" />
