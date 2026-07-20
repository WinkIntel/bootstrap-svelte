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
- `files` (FileList | null): Optional. Binds the platform file list. Defaults to null.
- `value` (string): Deprecated compatibility binding. Prefer `files`; non-empty parent values are ignored by the platform input.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        class: classValues,
        elementRef = $bindable(null),
        files = $bindable<FileList | null>(null),
        isInvalid,
        isValid,
        onchange,
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

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        files = event.currentTarget.files;
        value = event.currentTarget.value;
        (onchange as ChangeEventHandler<HTMLInputElement> | null | undefined)?.(event);
    };

    $effect(() => {
        const input = elementRef as HTMLInputElement | null;
        const requestedValue = value;
        if (input && requestedValue === '' && input.value !== '') {
            input.value = '';
            if (files !== null) {
                files = null;
            }
        }
        if (input && files === null) {
            if (input.value !== '') {
                input.value = '';
                if (value !== '') {
                    value = '';
                }
            }
            return;
        }
        if (input && input.files !== files) {
            try {
                // Let the platform setter validate FileList identity so genuine
                // cross-realm FileLists are not rejected by an instanceof check.
                input.files = files;
            } catch {
                input.value = '';
                value = '';
                if (files !== null) {
                    files = null;
                }
            }
        }
    });
</script>

<input
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
    bind:this={elementRef}
    class={classes}
    onchange={handleChange}
    value={undefined}
    type="file" />
