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
- `checked` (boolean): Optional. Controls checked state once it is boolean; undefined is uncontrolled.
- `group` (string): Optional. Binds this radio's selected value; it may initially be undefined.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        checked = $bindable(undefined),
        class: classValues,
        elementRef = $bindable(null),
        group = $bindable(undefined),
        isInvalid,
        isValid,
        onchange = noop,
        value = 'on',
        ...restOfProps
    }: Form.RadioInputProps = $props();

    let controlsChecked = $derived(checked !== undefined);
    const unset = Symbol('unset');
    const controlledSnapshot: {
        checked: boolean | null | undefined | typeof unset;
        group: unknown | typeof unset;
    } = { checked: unset, group: unset };

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

    $effect(() => {
        const currentChecked = checked;
        const currentGroup = group;

        if (!controlsChecked) {
            controlledSnapshot.checked = unset;
            controlledSnapshot.group = unset;
            return;
        }

        const isInitialSync = controlledSnapshot.checked === unset;
        const checkedChanged = !isInitialSync && controlledSnapshot.checked !== currentChecked;
        const groupChanged = !isInitialSync && controlledSnapshot.group !== currentGroup;

        controlledSnapshot.checked = currentChecked;
        controlledSnapshot.group = currentGroup;

        // `checked` establishes the initial selection and drives later explicit
        // checked updates. Group updates are authoritative otherwise so sibling
        // radios and parent assignments can clear this radio without ping-ponging.
        if (isInitialSync || (checkedChanged && !groupChanged)) {
            const nextGroup = currentChecked ? value : currentGroup === value ? undefined : currentGroup;
            if (currentGroup !== nextGroup) {
                group = nextGroup;
            }
        } else if (groupChanged) {
            const nextChecked = currentGroup === value;
            if (currentChecked !== nextChecked) {
                checked = nextChecked;
            }
        }
    });

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (controlsChecked) {
            checked = event.currentTarget.checked;
        }
        (onchange as EventListener | null)?.(event);
    };
</script>

<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
<input
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
    bind:this={elementRef}
    bind:group
    checked={controlsChecked ? checked : undefined}
    class={classes}
    onchange={handleChange}
    {value}
    type="radio" />
