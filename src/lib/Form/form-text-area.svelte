<!--
@component
## Form.TextArea
Bootstrap-styled textarea component for multi-line text input.

@example
```svelte
// Default textarea
<Form.TextArea title="Set a text value" value="textarea value" />

// Disabled textarea
<Form.TextArea disabled title="Set a textarea value" value="textarea value" />

// Readonly textarea
<Form.TextArea readonly title="Set a textarea value" value="textarea value" />

// Small sizing
<Form.TextArea sizing="sm" title="Set a textarea value" value="textarea value" />

// Large sizing
<Form.TextArea sizing="lg" title="Set a textarea value" value="textarea value" />

// Non-resizable textarea
<Form.TextArea isResizable={false} title="Set a textarea value" value="textarea value" />
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the textarea.
- `elementRef` (HTMLTextAreaElement): Optional. Reference to the textarea DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isResizable` (boolean): Optional. Controls whether the textarea is resizable. Defaults to true.
- `isValid` (boolean): Optional. Indicates whether the input is valid. If undefined, no validation styles are applied.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the textarea element.
- `style` (string): Optional. Custom inline styles to apply to the textarea.
- `value` (string): Optional. The text value of the textarea. If undefined, the textarea is empty.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        class: classValues,
        elementRef = $bindable(null),
        isInvalid,
        isResizable = true,
        isValid,
        sizing,
        style,
        value = $bindable(undefined),
        ...restOfProps
    }: Form.TextAreaProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'form-control',
            {
                [`form-control-${sizing}`]: !!sizing,
                'is-valid': isValid,
                'is-invalid': isInvalid
            },
            classValues
        )
    );
    let styles: string | undefined = $derived.by(() => {
        if (isResizable && style === undefined) {
            return undefined;
        }
        return isResizable === false ? `resize: none; ${style}` : style || undefined;
    });
</script>

<textarea
    aria-invalid={isInvalid === true ? 'true' : isValid === true ? 'false' : undefined}
    bind:this={elementRef}
    bind:value
    class={classes}
    style={styles}
    {...restOfProps}></textarea>
