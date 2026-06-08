<!--
@component
## Form.CheckInput
Bootstrap-styled checkbox input component for boolean selections.

@example
```svelte
// Default checkbox
<Form.Check>
    <Form.CheckInput id="checkDefault" name="checkDefault" value="" />
    <Form.CheckLabel for="checkDefault">Default checkbox</Form.CheckLabel>
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

// Disabled and checked checkbox
<Form.Check>
    <Form.CheckInput checked disabled id="checkDisabledChecked" name="checkDisabledChecked" value="" />
    <Form.CheckLabel for="checkDisabledChecked">Disabled checked checkbox</Form.CheckLabel>
</Form.Check>

// Indeterminate checkbox
<Form.Check>
    <Form.CheckInput id="checkReadonly" isIndeterminate={true} name="checkReadonly" value="" />
    <Form.CheckLabel for="checkReadonly">Indeterminate checkbox</Form.CheckLabel>
</Form.Check>
```
### Props
- `checked` (boolean): Optional. Binds the checkbox state. If undefined, the checkbox is unchecked.
- `class` (string): Optional. Additional CSS classes to apply to the checkbox.
- `elementRef` (HTMLInputElement): Optional. Reference to the checkbox DOM element.
- `isIndeterminate` (boolean): Optional. Sets the checkbox to indeterminate state when true.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
-->
<script lang="ts">
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { Form } from './index.js';

    let {
        checked = $bindable(false),
        class: classValues,
        elementRef = $bindable(null),
        group = $bindable(null),
        isIndeterminate,
        isInvalid,
        isValid,
        onchange = noop,
        value = undefined,
        ...restOfProps
    }: Form.CheckInputProps = $props();

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
        if (group !== null) {
            if (!Array.isArray(group)) {
                console.warn('Form.CheckInput: `group` prop should be an array when used for grouped inputs.');
                return;
            }
            const isIncluded = group.includes(value);
            if (!isIncluded) {
                // Add the value to the group array
                group = [...(group as unknown[]), value];
            } else if (isIncluded) {
                // Remove the value from the group array
                group = (group as unknown[]).filter((val) => val !== value);
            }
        }
        if (onchange !== null) {
            onchange(event);
        }
    };

    $effect(() => {
        if (elementRef && isIndeterminate !== undefined) {
            (elementRef as HTMLInputElement).indeterminate = isIndeterminate;
        }
    });

    $effect(() => {
        if (group !== null && Array.isArray(group)) {
            checked = (group as unknown[]).includes(value);
        }
    });
</script>

<input
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : undefined}
    bind:this={elementRef}
    bind:checked
    class={classes}
    onchange={handleChange}
    type="checkbox"
    {value}
    {...restOfProps} />
