<!--
@component
## Form.ColorInput
Bootstrap-styled color picker input component.

@example
```svelte
// Default color input
<Form.ColorInput title="Choose your color" value="#563d7c" />

// Disabled color input
<Form.ColorInput disabled title="Choose your color" value="#563d7c" />

// Small sizing
<Form.ColorInput sizing="sm" title="Choose your color" value="#563d7c" />

// Large sizing
<Form.ColorInput sizing="lg" title="Choose your color" value="#563d7c" />
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the color picker.
- `value` (string): Optional. Bindable hex color (e.g., "#563d7c"). Defaults to black. The initial color is rendered for SSR and is the native form reset default unless `defaultValue` is supplied; reset updates the binding without an input callback.
-->
<script lang="ts">
    import { untrack } from 'svelte';
    import { syncFormReset } from './form-reset.js';
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        class: classValues,
        defaultValue,
        elementRef = $bindable(null),
        isInvalid,
        isValid,
        oninput = noop,
        sizing,
        value = $bindable('#000000'),
        ...restOfProps
    }: Form.ColorInputProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'form-control',
            'form-control-color',
            {
                [`form-control-${sizing}`]: !!sizing,
                'is-valid': isValid,
                'is-invalid': isInvalid
            },
            classValues
        )
    );

    const initialColor = untrack(() => value || '#000000');

    // Keep the input value in sync with the prop without using `bind:value` or
    // a reactive `value` attribute. Chrome logs a warning whenever an `<input type="color">`
    // value transiently becomes `""` during hydration (see sveltejs/svelte#8446);
    // setting the property imperatively via an effect avoids that transient state.
    $effect(() => {
        const input = elementRef as HTMLInputElement | null;
        const normalized = value || '#000000';
        if (input && input.value !== normalized) {
            input.value = normalized;
        }
    });

    const handleInput = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        value = event.currentTarget.value;
        (oninput as EventListener | null)?.(event);
    };
</script>

<input
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
    bind:this={elementRef}
    class={classes}
    oninput={handleInput}
    value={initialColor}
    defaultValue={defaultValue === undefined ? initialColor : defaultValue}
    use:syncFormReset={(state) => {
        value = state.value;
    }}
    type="color" />
