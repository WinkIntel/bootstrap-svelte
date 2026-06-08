<!--
@component
## Form.TimeInput
Bootstrap-styled time input component for selecting a specific time.

@example
```svelte
// Default time input
<Form.TimeInput max="12:00" min="00:00" title="Set a time" value="07:32" />

// Disabled time input
<Form.TimeInput disabled max="12:00" min="00:00" title="Set a time" value="07:32" />

// Readonly time input
<Form.TimeInput readonly max="12:00" min="00:00" title="Set a time" value="07:32" />

// Readonly plaintext time input
<Form.TimeInput isPlaintext readonly max="12:00" min="00:00" title="Set a time" value="07:32" />

// Small sizing
<Form.TimeInput sizing="sm" max="12:00" min="00:00" title="Set a time" value="07:32" />

// Large sizing
<Form.TimeInput sizing="lg" max="12:00" min="00:00" title="Set a time" value="07:32" />

// With datalist
<Form.TimeInput list="listOfTimes" max="12:00" min="00:00" title="Set a time" />
<datalist id="listOfTimes">
    <option value="08:00"></option>
    <option value="09:00"></option>
    <option value="10:00"></option>
    <option value="11:00"></option>
    <option value="12:00"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The time value in the format "HH:MM". If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.TimeInputProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            {
                'form-control': !isPlaintext,
                'form-control-plaintext': isPlaintext,
                [`form-control-${sizing}`]: !!sizing,
                'is-valid': isValid,
                'is-invalid': isInvalid
            },
            classValues
        )
    );
</script>

<input
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : undefined}
    bind:this={elementRef}
    bind:value
    class={classes}
    type="time"
    {...restOfProps} />
