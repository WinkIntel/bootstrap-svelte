<!--
@component
## Form.TextInput
Input field component for standard text values with Bootstrap styling.

@example
```svelte
// Default
<Form.TextInput title="Set a text value" value="text value" />

// With variations
<Form.TextInput disabled title="Set a text value" value="text value" />
<Form.TextInput readonly title="Set a text value" value="text value" />
<Form.TextInput isPlaintext readonly title="Set a text value" value="text value" />
<Form.TextInput sizing="sm" title="Set a text value" value="text value" />
<Form.TextInput sizing="lg" title="Set a text value" value="text value" />

// With datalist
<Form.TextInput list="listOfTextValues" title="Set a text value" value="text value" />
<datalist id="listOfTextValues">
    <option value="text value 1"></option>
    <option value="text value 2"></option>
    <option value="text value 3"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The text value of the input. If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        autocomplete = 'off',
        class: classValues,
        'data-form-type': dataFormType = undefined,
        'data-lpignore': dataLpignore = undefined,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.TextInputProps = $props();

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
    {autocomplete}
    bind:this={elementRef}
    bind:value
    class={classes}
    data-form-type={autocomplete == 'off' ? 'other' : dataFormType}
    data-lpignore={autocomplete == 'off' ? 'true' : dataLpignore}
    type="text" />
