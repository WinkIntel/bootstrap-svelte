<!--
@component
## Form.NumberInput
Bootstrap-styled numeric input component for entering numbers.

@example
```svelte
// Default number input
<Form.NumberInput max="5" min="1" title="Set a number" value="1" />

// Disabled number input
<Form.NumberInput disabled max="5" min="1" title="Set a number" value="1" />

// Readonly number input
<Form.NumberInput max="5" min="1" readonly title="Set a number" value="1" />

// Readonly plaintext number input
<Form.NumberInput isPlaintext max="5" min="1" readonly title="Set a number" value="1" />

// Small sizing
<Form.NumberInput max="5" min="1" sizing="sm" title="Set a number" value="1" />

// Large sizing
<Form.NumberInput max="5" min="1" sizing="lg" title="Set a number" value="1" />

// With datalist
<Form.NumberInput list="listOfNumbers" max="5" min="1" title="Set a number" />
<datalist id="listOfNumbers">
    <option value="1"></option>
    <option value="2"></option>
    <option value="3"></option>
    <option value="4"></option>
    <option value="5"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (number): Optional. The numeric value of the input. If undefined, the input is empty.
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
    }: Form.NumberInputProps = $props();

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
    type="number" />
