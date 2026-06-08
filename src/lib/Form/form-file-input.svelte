<!--
@component
## Form.FileInput
Bootstrap-styled file input component for file uploads.

@example
```svelte
// Default file input
<Form.FileInput accept=".png, .jpg, image/png, image/jpeg" name="newFile" />

// Disabled file input
<Form.FileInput accept=".png, .jpg, image/png, image/jpeg" disabled name="newFile" />

// Small sizing
<Form.FileInput accept=".png, .jpg, image/png, image/jpeg" name="newFile" sizing="sm" />

// Large sizing
<Form.FileInput accept=".png, .jpg, image/png, image/jpeg" name="newFile" sizing="lg" />
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (File | File[]): Optional. The file(s) selected in the input. If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isValid,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.FileInputProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'form-control',
            {
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
    type="file"
    {...restOfProps} />
