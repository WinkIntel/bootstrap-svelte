<!--
@component
## ButtonCheck
Bootstrap toggle-button input that renders a `.btn-check` input and its matching `.btn` label.

@example
```svelte
<ButtonCheck id="newsletter">Newsletter</ButtonCheck>
```

#### Radio toggle group
```svelte
<ButtonGroup>
    <ButtonCheck id="option-a" name="options" type="radio" colorVariant="outline-primary">Option A</ButtonCheck>
    <ButtonCheck id="option-b" name="options" type="radio" colorVariant="outline-primary">Option B</ButtonCheck>
</ButtonGroup>
```

### Props
- `autocomplete` (string): Optional. Defaults to `'off'`.
- `checked` (boolean): Optional. Bindable checked state for checkbox inputs.
- `class` (string): Optional. Additional CSS classes for the input.
- `colorVariant` (string): Optional. Button style variant for the label.
- `disabled` (boolean): Optional. Disables the input and label interaction.
- `elementRef` (HTMLInputElement): Optional. Reference to the input element.
- `group` (string | unknown[]): Optional. Bindable group value for grouped radio or checkbox inputs.
- `id` (string): Optional. Input id used by the label `for` attribute.
- `labelClass` (string): Optional. Additional CSS classes for the label.
- `labelElementRef` (HTMLLabelElement): Optional. Reference to the label element.
- `name` (string): Optional. Input group name, commonly used with radio toggles.
- `type` (`'checkbox' | 'radio'`): Optional. Defaults to `'checkbox'`.
-->
<script lang="ts">
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import type { ButtonCheckRootProps } from './types.js';

    const uid: string = $props.id();

    let {
        autocomplete = 'off',
        children,
        checked = $bindable(false),
        class: classValues,
        colorVariant,
        disabled = false,
        elementRef = $bindable(null),
        group = $bindable(undefined),
        id = `btn-check-${uid}`,
        labelClass,
        labelElementRef = $bindable(null),
        onchange = noop,
        type = 'checkbox',
        value = undefined,
        ...restOfProps
    }: ButtonCheckRootProps = $props();

    let inputClasses: string = $derived(uniqueClsx('btn-check', classValues));
    let labelClasses: string = $derived(uniqueClsx('btn', colorVariant && `btn-${colorVariant}`, labelClass));
    let isCheckboxGroup: boolean = $derived(type === 'checkbox' && group !== undefined);
</script>

{#if type === 'radio'}
    <input bind:this={elementRef} bind:group {autocomplete} class={inputClasses} {disabled} {id} {onchange} type="radio" {value} {...restOfProps} />
{:else if isCheckboxGroup}
    <input
        bind:this={elementRef}
        bind:group
        {autocomplete}
        class={inputClasses}
        {disabled}
        {id}
        {onchange}
        type="checkbox"
        {value}
        {...restOfProps} />
{:else}
    <input
        bind:this={elementRef}
        bind:checked
        {autocomplete}
        class={inputClasses}
        {disabled}
        {id}
        {onchange}
        type="checkbox"
        {value}
        {...restOfProps} />
{/if}
<label bind:this={labelElementRef} class={labelClasses} for={id}>
    {@render children?.()}
</label>
