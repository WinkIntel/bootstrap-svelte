<!--
@component
## Form.DateInput
Bootstrap-styled date input component for selecting dates.

@example
```svelte
// Default date input
<Form.DateInput value="2025-06-10" title="Choose your date" />

// Disabled date input
<Form.DateInput disabled value="2025-06-10" title="Choose your date" />

// Readonly date input
<Form.DateInput readonly value="2025-06-10" title="Choose your date" />

// Readonly plaintext date input
<Form.DateInput isPlaintext readonly value="2025-06-10" title="Choose your date" />

// Small sizing
<Form.DateInput sizing="sm" value="2025-06-10" title="Choose your date" />

// Large sizing
<Form.DateInput sizing="lg" value="2025-06-10" title="Choose your date" />

// With datalist
<Form.DateInput list="listOfDates" title="Choose your date" />
<datalist id="listOfDates">
    <option value="2025-01-01"></option>
    <option value="2025-02-01"></option>
    <option value="2025-03-01"></option>
</datalist>
```
### Props
- `autocomplete` (string): Optional. Controls the autocomplete behavior of the input. Default is "off".
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The date value in the format "YYYY-MM-DD". If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        autocomplete = 'off',
        class: classValues,
        'data-form-type': dataFormType = 'email',
        'data-lpignore': dataLpignore = undefined,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.DateInputProps = $props();

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
    {autocomplete}
    bind:this={elementRef}
    bind:value
    class={classes}
    data-form-type={autocomplete == 'off' ? 'other' : dataFormType}
    data-lpignore={autocomplete == 'off' ? 'true' : dataLpignore}
    type="date"
    {...restOfProps} />
