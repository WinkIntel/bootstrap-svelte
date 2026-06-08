<!--
@component
## Form.MonthInput
Bootstrap-styled month input component for selecting a specific month and year.

@example
```svelte
// Default month input
<Form.MonthInput title="Choose a month" value="2025-06" />

// Disabled month input
<Form.MonthInput disabled title="Choose a month" value="2025-06" />

// Readonly month input
<Form.MonthInput readonly title="Choose a month" value="2025-06" />

// Readonly plaintext month input
<Form.MonthInput isPlaintext readonly title="Choose a month" value="2025-06" />

// Small sizing
<Form.MonthInput sizing="sm" title="Choose a month" value="2025-06" />

// Large sizing
<Form.MonthInput sizing="lg" title="Choose a month" value="2025-06" />

// With datalist
<Form.MonthInput list="listOfMonths" title="Choose a month" />
<datalist id="listOfMonths">
    <option value="2025-01"></option>
    <option value="2025-02"></option>
    <option value="2025-03"></option>
    <option value="2025-04"></option>
    <option value="2025-05"></option>
    <option value="2025-06"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The month value in the format "YYYY-MM". If undefined, the input is empty.
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
    }: Form.MonthInputProps = $props();

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
    type="month"
    {...restOfProps} />
