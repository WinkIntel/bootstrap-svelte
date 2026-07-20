<!--
@component
## Form.Select
Bootstrap-styled select input component for dropdown selection.

@example
```svelte
// Default select
<Form.Select aria-label="Default select example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>

// Disabled select
<Form.Select aria-label="Disabled select example" disabled>
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>

// Multiple select
<Form.Select aria-label="Multiple select example" multiple>
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>

// With specific size
<Form.Select aria-label="Size of 2 select example" multiple size={2}>
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>

// Small sizing
<Form.Select aria-label="Default select example" sizing="sm">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the select.
- `elementRef` (HTMLSelectElement): Optional. Reference to the select DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `multiple` (boolean): Optional. When true, allows multiple selections. If undefined, only single selection is allowed.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the select element.
- `value` (string): Optional. The selected value of the select. If undefined, the select is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        children,
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isValid,
        multiple,
        sizing,
        value = $bindable(multiple ? [] : undefined),
        ...restOfProps
    }: Form.SelectProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'form-select',
            {
                [`form-select-${sizing}`]: !!sizing,
                'is-valid': isValid,
                'is-invalid': isInvalid
            },
            classValues
        )
    );
</script>

{#if multiple}
    <select
        {...restOfProps}
        aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
        bind:this={elementRef}
        bind:value
        class={classes}
        multiple>
        {@render children?.()}
    </select>
{:else}
    <select
        {...restOfProps}
        aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
        bind:this={elementRef}
        bind:value
        class={classes}>
        {@render children?.()}
    </select>
{/if}
