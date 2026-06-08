<!--
@component
## Form.Feedback
Bootstrap-styled form validation messages to apply custom colors, borders, focus styles, and background icons.

@example
```svelte
// Valid feedback
<Form.Feedback isValid>Looks good!</Form.Feedback>
// Invalid feedback
<Form.Feedback isInvalid>Please check this field.</Form.Feedback>
// Valid tooltip
<Form.Feedback isValid isTooltip>Looks good!</Form.Feedback>
// Invalid tooltip
<Form.Feedback isInvalid isTooltip>Please check this field.</Form.Feedback>
```
#### Props
- `class` (string): Optional. Additional CSS classes to apply to the feedback element.
- `elementRef` (HTMLElement): Optional. Reference to the feedback DOM element.
- `isInvalid` (boolean): Optional. Indicates whether the input is invalid. If undefined, no validation styles are applied.
- `isTooltip` (boolean): Optional. When true, renders as a tooltip instead of feedback.
- `isValid` (boolean): Optional. Indicates whether the feedback is valid. If undefined, no validation styles are applied.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        isInvalid = false,
        isTooltip,
        isValid = false,
        ...restOfProps
    }: Form.FeedbackProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            {
                'valid-feedback': isValid && !isTooltip,
                'invalid-feedback': isInvalid && !isTooltip,
                'valid-tooltip': isValid && isTooltip,
                'invalid-tooltip': isInvalid && isTooltip
            },
            classValues
        )
    );
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>
