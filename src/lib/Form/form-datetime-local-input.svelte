<!--
@component
## Form.DatetimeLocalInput
Bootstrap-styled datetime-local input component for selecting both date and time.

@example
```svelte
// Default datetime-local input
<Form.DatetimeLocalInput title="Choose your datetime local" value="2025-06-10T19:30" />

// Disabled datetime-local input
<Form.DatetimeLocalInput disabled title="Choose your datetime local" value="2025-06-10T19:30" />

// Readonly datetime-local input
<Form.DatetimeLocalInput readonly title="Choose your datetime local" value="2025-06-10T19:30" />

// Readonly plaintext datetime-local input
<Form.DatetimeLocalInput isPlaintext readonly title="Choose your datetime local" value="2025-06-10T19:30" />

// Small sizing
<Form.DatetimeLocalInput sizing="sm" title="Choose your datetime local" value="2025-06-10T19:30" />

// Large sizing
<Form.DatetimeLocalInput sizing="lg" title="Choose your datetime local" value="2025-06-10T19:30" />

// With datalist
<Form.DatetimeLocalInput list="listOfDatetimes" title="Choose your datetime local" />
<datalist id="listOfDatetimes">
    <option value="2025-01-01T00:00"></option>
    <option value="2025-02-01T00:00"></option>
    <option value="2025-03-01T00:00"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The datetime-local value in the format "YYYY-MM-DDTHH:MM". If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.DatetimeLocalInputProps = $props();

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
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
    bind:this={elementRef}
    bind:value
    class={classes}
    type="datetime-local" />
