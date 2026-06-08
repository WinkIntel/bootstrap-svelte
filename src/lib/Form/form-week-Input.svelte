<!--
@component
## Form.WeekInput
Bootstrap-styled week input component for selecting a specific week of a year.

@example
```svelte
// Default week input
<Form.WeekInput title="Set a week" value="2025-W07" />

// Disabled week input
<Form.WeekInput disabled title="Set a week" value="2025-W07" />

// Readonly week input
<Form.WeekInput readonly title="Set a week" value="2025-W07" />

// Readonly plaintext week input
<Form.WeekInput isPlaintext readonly title="Set a week" value="2025-W07" />

// Small sizing
<Form.WeekInput sizing="sm" title="Set a week" value="2025-W07" />

// Large sizing
<Form.WeekInput sizing="lg" title="Set a week" value="2025-W07" />

// With datalist
<Form.WeekInput list="listOfWeeks" title="Set a week" />
<datalist id="listOfWeeks">
    <option value="2025-W01"></option>
    <option value="2025-W02"></option>
    <option value="2025-W03"></option>
    <option value="2025-W04"></option>
    <option value="2025-W05"></option>
</datalist>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The week value in the format "YYYY-Www". If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.WeekInputProps = $props();

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
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : undefined}
    bind:this={elementRef}
    bind:value
    class={classes}
    type="week"
    {...restOfProps} />
