<!--
@component
## Form.TelephoneInput
Bootstrap-styled telephone input component for entering phone numbers.

@example
```svelte
// Default telephone input
<Form.TelephoneInput placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />

// Disabled telephone input
<Form.TelephoneInput disabled placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />

// Readonly telephone input
<Form.TelephoneInput readonly placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />

// Readonly plaintext telephone input
<Form.TelephoneInput isPlaintext readonly placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />

// Small sizing
<Form.TelephoneInput sizing="sm" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />

// Large sizing
<Form.TelephoneInput sizing="lg" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />

// With datalist
<Form.TelephoneInput list="listOfTelephones" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
<datalist id="listOfTelephones">
    <option value="555-123-4567"></option>
    <option value="555-234-5678"></option>
    <option value="555-345-6789"></option>
</datalist>

// With mask (single template)
<Form.TelephoneInput mask="(###) ###-####" pattern="\(\d{3}\) \d{3}-\d{4}" placeholder="(555) 515-1212" />

// With mask (multiple templates — picks the shortest one that fits the typed digit count)
<Form.TelephoneInput mask={['###-###-####', '(###) ###-####']} />
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isPlaintext` (boolean): Optional. When true, renders as plaintext (no input border).
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `mask` (string | string[]): Optional. Mask template(s) applied as the user types. `#` marks a digit
  slot; any other character (`(`, `)`, `-`, `.`, space, `+`, etc.) is a literal and inserted automatically.
  When an array is provided, the mask whose digit-slot count fits the typed digit count is chosen.
  Independent of `pattern` — `pattern` continues to drive native browser validation only.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
- `value` (string): Optional. The telephone number value. If undefined, the input is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/index.js';
    import type { FormEventHandler } from 'svelte/elements';
    import type { Form } from './index.js';

    let {
        'aria-invalid': ariaInvalid,
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isPlaintext = false,
        isValid,
        mask,
        oninput = noop,
        sizing,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.TelephoneInputProps = $props();

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

    /**
     * Format `rawValue` against a mask template. `#` slots are filled with the next
     * digit from `rawValue` (non-digits in the source are skipped). Literal
     * characters in the template — `(`, `)`, `-`, `.`, space, `+`, etc. — are
     * inserted only after at least one digit has been consumed, so the user
     * doesn't see dangling separators when they delete the trailing digits.
     */
    function applyMask(rawValue: string, mask: string): string {
        const digits = rawValue.replace(/\D/g, '');
        let digitIndex = 0;
        let result = '';

        for (const char of mask) {
            if (char === '#') {
                const digit = digits[digitIndex];
                if (digit === undefined) {
                    break;
                }
                result += digit;
                digitIndex++;
            } else if (digitIndex < digits.length) {
                result += char;
            }
        }

        return result;
    }

    /** Count the number of `#` digit slots in a mask template. */
    function countMaskSlots(mask: string): number {
        return [...mask].filter((char) => char === '#').length;
    }

    /**
     * Pick the first mask whose digit-slot count fits the current digit count.
     * Falls back to the longest mask (the last one) once the user has typed more
     * digits than any mask can hold.
     */
    function chooseMask(rawValue: string, masks: [string, ...string[]]): string {
        const digitCount = rawValue.replace(/\D/g, '').length;
        return masks.find((candidate) => digitCount <= countMaskSlots(candidate)) ?? masks[masks.length - 1] ?? masks[0];
    }

    const handleInput: FormEventHandler<HTMLInputElement> = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        if (mask !== undefined) {
            const masks = Array.isArray(mask) ? mask : [mask];
            if (masks.length > 0) {
                const selectedMask = chooseMask(event.currentTarget.value, masks as [string, ...string[]]);
                const maskedValue = applyMask(event.currentTarget.value, selectedMask);
                if (event.currentTarget.value !== maskedValue) {
                    event.currentTarget.value = maskedValue;
                }
                value = maskedValue;
            }
        }
        // `oninput` defaults to `noop` but Svelte's HTMLAttributes types it as
        // `FormEventHandler | null | undefined`, so we null-check before invoking.
        if (oninput !== null) {
            oninput(event);
        }
    };
</script>

<input
    {...restOfProps}
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : ariaInvalid}
    bind:this={elementRef}
    bind:value
    class={classes}
    oninput={handleInput}
    type="tel" />
