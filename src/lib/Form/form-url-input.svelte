<!--
@component
## Form.UrlInput
Bootstrap-styled URL input component for entering website addresses.

@example
```svelte
// Default URL input
<Form.UrlInput pattern="https://.*" placeholder="https://example.com" title="Set a URL" />

// Disabled URL input
<Form.UrlInput disabled pattern="https://.*" placeholder="https://example.com" title="Set a URL" />

// Readonly URL input
<Form.UrlInput readonly pattern="https://.*" placeholder="https://example.com" title="Set a URL" />

// Readonly plaintext URL input
<Form.UrlInput isPlaintext readonly pattern="https://.*" placeholder="https://example.com" title="Set a URL" />

// Small sizing
<Form.UrlInput sizing="sm" pattern="https://.*" placeholder="https://example.com" title="Set a URL" />

// Large sizing
<Form.UrlInput sizing="lg" pattern="https://.*" placeholder="https://example.com" title="Set a URL" />

// With datalist
<Form.UrlInput list="listOfUrls" pattern="https://.*" placeholder="https://example.com" title="Set a URL" />
<datalist id="listOfUrls">
    <option value="https://example.com"></option>
    <option value="https://example.org"></option>
    <option value="https://example.net"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The URL value. If undefined, the input is empty.
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
    }: Form.UrlInputProps = $props();

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
    type="url" />
