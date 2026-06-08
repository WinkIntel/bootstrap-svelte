<!--
@component
## Form.EmailInput
Bootstrap-styled email input component for email address entry.

@example
```svelte
// Default email input
<Form.EmailInput placeholder="name@example.com" />

// Disabled email input
<Form.EmailInput disabled placeholder="name@example.com" />

// Readonly email input
<Form.EmailInput placeholder="name@example.com" readonly />

// Readonly plaintext email input
<Form.EmailInput isPlaintext readonly placeholder="name@example.com" />

// Small sizing
<Form.EmailInput sizing="sm" placeholder="name@example.com" />

// Large sizing
<Form.EmailInput sizing="lg" placeholder="name@example.com" />

// With pattern validation and datalist
<Form.EmailInput list="listOfEmails" pattern=".+@example\.com" placeholder="name@example.com" />
<datalist id="listOfEmails">
    <option value="alex@example.com"></option>
    <option value="casey@example.com"></option>
    <option value="jordan@example.com"></option>
    <option value="taylor@example.com"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The email address value. If undefined, the input is empty.
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
    }: Form.EmailInputProps = $props();

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
    type="email"
    {...restOfProps} />
