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
- `checked` (boolean): Optional. Bindable checked state for checkbox inputs and standalone radio selection. Use shared `bind:group` for same-name radios to track sibling deselection; browsers do not emit change on the deselected radio.
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
    import { tick, untrack } from 'svelte';
    import { syncFormReset } from '../Form/form-reset.js';
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
    let radioInput = $state<HTMLInputElement | null>(null);
    let pendingReset = $state.raw<{ group: unknown; value: unknown; checked: boolean } | undefined>(undefined);
    // A group supplied at mount keeps its established selection authority.
    // Undefined groups still accept a standalone checked seed and bind:group.
    const hasInitialGroup = untrack(() => group !== undefined);
    let controlsChecked = $derived(type === 'radio' && checked !== undefined && !hasInitialGroup);
    const initialRadioChecked = untrack(() => checked === true && !hasInitialGroup);
    const unset = Symbol('unset');
    const controlledSnapshot: {
        checked: boolean | null | undefined | typeof unset;
        group: unknown | typeof unset;
        value: unknown | typeof unset;
        nativeChecked: boolean;
    } = { checked: unset, group: unset, value: unset, nativeChecked: false };

    $effect(() => {
        const currentChecked = checked;
        const currentGroup = group;
        const currentValue = radioValue;

        if (!controlsChecked) {
            controlledSnapshot.checked = unset;
            controlledSnapshot.group = currentGroup;
            controlledSnapshot.value = currentValue;
            controlledSnapshot.nativeChecked = radioInput?.checked ?? false;
            return;
        }

        const isInitialSync = controlledSnapshot.checked === unset;
        const checkedChanged = !isInitialSync && controlledSnapshot.checked !== currentChecked;
        const groupChanged = !isInitialSync && !Object.is(controlledSnapshot.group, currentGroup);
        const previousValue = controlledSnapshot.value;
        const valueChanged = !isInitialSync && !Object.is(previousValue, currentValue);

        // A first checked=false adoption must release a selection established
        // while checked was undefined. The DOM has already received false, so
        // retain the native result from before that checked-only update.
        const sameSelection = Object.is(controlledSnapshot.group, currentGroup) && Object.is(controlledSnapshot.value, currentValue);
        const wasChecked =
            controlledSnapshot.checked === true ||
            (isInitialSync && (sameSelection ? controlledSnapshot.nativeChecked : radioInput?.checked === true));
        const resetSelection = pendingReset;
        const nativeChecked =
            resetSelection && Object.is(resetSelection.group, currentGroup) && Object.is(resetSelection.value, currentValue)
                ? resetSelection.checked
                : (radioInput?.checked ?? false);
        controlledSnapshot.checked = currentChecked;
        controlledSnapshot.group = currentGroup;
        controlledSnapshot.value = currentValue;

        // `checked` establishes the initial selection and drives later explicit
        // checked updates. Group updates are authoritative otherwise so sibling
        // radios and parent assignments can clear this radio without ping-ponging.
        if (isInitialSync || (checkedChanged && !groupChanged)) {
            const nextGroup = currentChecked ? currentValue : wasChecked ? undefined : currentGroup;
            if (!Object.is(currentGroup, nextGroup)) {
                group = nextGroup;
            }
        } else if (groupChanged) {
            // Native bind:group already resolves raw/proxy identity, including
            // distinct objects. Read its result rather than comparing objects here.
            const nextChecked = nativeChecked;
            if (currentChecked !== nextChecked) {
                controlledSnapshot.checked = nextChecked;
                checked = nextChecked;
            }
        } else if (valueChanged) {
            // Migrate only a checked selection that still owns its old value.
            // Established groups and simultaneous parent assignments keep authority.
            if (currentChecked) {
                group = currentValue;
            } else {
                const nextChecked = nativeChecked;
                controlledSnapshot.checked = nextChecked;
                checked = nextChecked;
            }
        }
    });

    $effect(() => {
        const input = radioInput;
        if (!input || type !== 'radio') return;
        // An action on the input defers native bind:group setup on Svelte 5.29,
        // which can leave selection stale when an option value changes.
        let active = true;
        const reset = syncFormReset(input, () => {
            if (!controlsChecked) return;
            // Svelte's group-reset hook can overwrite checked before this task.
            // Recover the native radio default: the last default-checked member
            // of this named/form-owned group wins, rather than every true default.
            let selected = input.defaultChecked;
            let lastDefault: Element | undefined = selected ? input : undefined;
            if (input.name && input.form) {
                lastDefault = undefined;
                for (const element of Array.from(input.form.elements)) {
                    if (element.tagName !== 'INPUT') continue;
                    const member = element as HTMLInputElement;
                    if (
                        member.type === 'radio' &&
                        member.name === input.name &&
                        member.defaultChecked &&
                        member.getRootNode() === input.getRootNode()
                    )
                        lastDefault = member;
                }
                selected = lastDefault === input;
            }
            const ownedSelection = checked === true;
            // Publish the checked snapshot with reset's group result. Otherwise
            // the effect can treat this internal false as a parent uncheck and
            // clear a restored duplicate-value sibling (or emit undefined).
            controlledSnapshot.checked = selected;
            checked = selected;
            if (selected) group = radioValue;
            else if (ownedSelection && !lastDefault) group = null;
            const restoration = { group, value: radioValue, checked: selected };
            const form = input.form;
            pendingReset = restoration;
            // Native group binding cannot distinguish duplicate values. Let its
            // render finish, then retain the native reset winner unless a parent
            // changed selection/value/checked or the input was removed meanwhile.
            void tick().then(() => {
                if (pendingReset !== restoration) return;
                pendingReset = undefined;
                if (!active || radioInput !== input || input.form !== form || !controlsChecked) return;
                if (!Object.is(group, restoration.group) || !Object.is(radioValue, restoration.value) || checked !== selected) return;
                input.checked = selected;
            });
        });
        return () => {
            active = false;
            reset.destroy();
        };
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
        bind:this={
            () => elementRef,
            (input) => {
                radioInput = input;
                elementRef = input;
            }
        }
        bind:group
        {...controlsChecked ? { checked } : {}}
        defaultChecked={restOfProps.defaultChecked === undefined ? initialRadioChecked : restOfProps.defaultChecked}
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
