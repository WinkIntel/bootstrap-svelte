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
- `value` (string): Optional. The color value in hex format (e.g., "#563d7c"). If undefined, the input is empty.
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

    // Keep the input value in sync with the prop without using `bind:value` or the
    // `value` attribute directly. Chrome logs a warning whenever an `<input type="color">`
    // value transiently becomes `""` during hydration (see sveltejs/svelte#8446);
    // setting the property imperatively via an effect avoids that transient state.
    $effect(() => {
        const input = elementRef as HTMLInputElement | null;
        const normalized = value || '#000000';
        if (input && input.value !== normalized) {
            input.value = normalized;
        }
    });
</script>

<input
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : undefined}
    bind:this={elementRef}
    class={classes}
    oninput={(event) => (value = event.currentTarget.value)}
    type="color" />
