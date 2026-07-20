<!--
@component
## Form.SearchInput
Bootstrap-styled search input component with search-specific features.

@example
```svelte
// Default search input
<Form.SearchInput title="Set a search value" value="search value" />

// Disabled search input
<Form.SearchInput disabled title="Set a search value" value="search value" />

// Readonly search input
<Form.SearchInput readonly title="Set a search value" value="search value" />

// Readonly plaintext search input
<Form.SearchInput isPlaintext readonly title="Set a search value" value="search value" />

// Small sizing
<Form.SearchInput sizing="sm" title="Set a search value" value="search value" />

// Large sizing
<Form.SearchInput sizing="lg" title="Set a search value" value="search value" />

// With datalist
<Form.SearchInput list="listOfSearchValues" title="Set a search value" value="search value" />
<datalist id="listOfSearchValues">
    <option value="search value 1"></option>
    <option value="search value 2"></option>
    <option value="search value 3"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The search value. If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        autocomplete = 'off',
        class: classValues,
        'data-form-type': dataFormType = 'search',
        'data-lpignore': dataLpignore = undefined,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.SearchInputProps = $props();

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
    type="search" />
