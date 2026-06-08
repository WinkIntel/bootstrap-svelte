<!--
@component
## Form.PasswordInput
Bootstrap-styled password input component with support for various states.

@example
```svelte
// Default password input
<Form.PasswordInput title="Set a password" value="myP@55w0rd" />

// Disabled password input
<Form.PasswordInput disabled title="Set a password" value="myP@55w0rd" />

// Readonly password input
<Form.PasswordInput readonly title="Set a password" value="myP@55w0rd" />

// Readonly plaintext password input
<Form.PasswordInput isPlaintext readonly title="Set a password" value="myP@55w0rd" />

// Small sizing
<Form.PasswordInput sizing="sm" title="Set a password" value="myP@55w0rd" />

// Large sizing
<Form.PasswordInput sizing="lg" title="Set a password" value="myP@55w0rd" />

// Show password as plain text
<Form.PasswordInput showPassword title="Set a password" value="myP@55w0rd" />
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `showPassword` (boolean): Optional. When true, shows the password as plain text instead of obscured characters.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The password value. If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        autocomplete = 'off',
        class: classValues,
        'data-form-type': dataFormType = 'password',
        'data-lpignore': dataLpignore = undefined,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        sizing,
        showPassword = false,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.PasswordInputProps = $props();

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
    let inputType: string = $derived(showPassword ? 'text' : 'password');
</script>

<input
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : undefined}
    {autocomplete}
    bind:this={elementRef}
    bind:value
    class={classes}
    data-form-type={autocomplete == 'off' ? 'other' : dataFormType}
    data-lpignore={autocomplete == 'off' ? 'true' : dataLpignore}
    type={inputType}
    {...restOfProps} />
