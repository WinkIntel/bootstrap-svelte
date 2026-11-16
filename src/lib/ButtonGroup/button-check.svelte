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
- `checked` (boolean): Optional. Bindable checked state for checkbox inputs and standalone radio selection.
- `class` (string): Optional. Additional CSS classes for the input.
- `colorVariant` (string): Optional. Button style variant for the label.
- `disabled` (boolean): Optional. Disables the input and label interaction.
- `elementRef` (HTMLInputElement): Optional. Reference to the input element.
- `group` (string | unknown[]): Optional. Bindable group value for grouped radio or checkbox inputs. A radio group may initially be undefined; supply distinct values for its options. An already defined group retains selection authority over checked.
- `id` (string): Optional. Input id used by the label `for` attribute.
- `labelClass` (string): Optional. Additional CSS classes for the label.
- `labelElementRef` (HTMLLabelElement): Optional. Reference to the label element.
- `name` (string): Optional. Input group name, commonly used with radio toggles.
- `type` (`'checkbox' | 'radio'`): Optional. Defaults to `'checkbox'`.
-->
<script lang="ts">
    import { noop, uniqueClsx } from '$lib/common/index.js';
    import { untrack } from 'svelte';
    import type { ChangeEventHandler } from 'svelte/elements';
    import type { ButtonCheckRootProps } from './types.js';

    const uid: string = $props.id();

    let {
        autocomplete = 'off',
        children,
        checked = $bindable(undefined),
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
    let radioValue = $derived(value === undefined ? 'on' : value);
    // A group supplied at mount keeps its established selection authority.
    // Undefined groups still accept a standalone checked seed and bind:group.
    const hasInitialGroup = untrack(() => group !== undefined);
    let controlsChecked = $derived(type === 'radio' && checked !== undefined && !hasInitialGroup);
    const unset = Symbol('unset');
    const controlledSnapshot: {
        checked: boolean | null | undefined | typeof unset;
        group: unknown | typeof unset;
    } = { checked: unset, group: unset };

    $effect(() => {
        const currentChecked = checked;
        const currentGroup = group;

        if (!controlsChecked) {
            controlledSnapshot.checked = unset;
            controlledSnapshot.group = unset;
            return;
        }

        const isInitialSync = controlledSnapshot.checked === unset;
        const checkedChanged = !isInitialSync && controlledSnapshot.checked !== currentChecked;
        const groupChanged = !isInitialSync && controlledSnapshot.group !== currentGroup;

        controlledSnapshot.checked = currentChecked;
        controlledSnapshot.group = currentGroup;

        // `checked` establishes the initial selection and drives later explicit
        // checked updates. Group updates are authoritative otherwise so sibling
        // radios and parent assignments can clear this radio without ping-ponging.
        if (isInitialSync || (checkedChanged && !groupChanged)) {
            const nextGroup = currentChecked ? radioValue : currentGroup === radioValue ? undefined : currentGroup;
            if (currentGroup !== nextGroup) {
                group = nextGroup;
            }
        } else if (groupChanged) {
            const nextChecked = currentGroup === radioValue;
            if (currentChecked !== nextChecked) {
                checked = nextChecked;
            }
        }
    });

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (controlsChecked) {
            checked = event.currentTarget.checked;
        }
        (onchange as EventListener | null)?.(event);
    };
</script>

{#if type === 'radio'}
    <input
        {...restOfProps}
        bind:this={elementRef}
        bind:group
        checked={controlsChecked ? checked : undefined}
        {autocomplete}
        class={inputClasses}
        {disabled}
        {id}
        onchange={handleChange}
        type="radio"
        value={radioValue} />
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
