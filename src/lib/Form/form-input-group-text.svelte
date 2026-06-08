<!--
@component
## Form.InputGroupText
Bootstrap-styled text component for input groups, typically used for prepending or appending text to form inputs.

@example
```svelte
// Prepended text
<Form.InputGroup>
    <Form.InputGroupText>@</Form.InputGroupText>
    <Form.TextInput placeholder="Username" />
</Form.InputGroup>

// Appended text
<Form.InputGroup>
    <Form.TextInput placeholder="Recipient's username" />
    <Form.InputGroupText>@example.com</Form.InputGroupText>
</Form.InputGroup>

// Multiple addons
<Form.InputGroup>
    <Form.InputGroupText>$</Form.InputGroupText>
    <Form.TextInput placeholder="Amount" aria-label="Amount" />
    <Form.InputGroupText>.00</Form.InputGroupText>
</Form.InputGroup>

// With checkbox
<Form.InputGroup>
    <Form.InputGroupText>
        <input type="checkbox" aria-label="Checkbox for following text input" />
    </Form.InputGroupText>
    <Form.TextInput placeholder="Check me out" aria-label="Text input with checkbox" />
</Form.InputGroup>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input group text.
- `elementRef` (HTMLSpanElement): Optional. Reference to the input group text DOM element.
- `elementType` (string): Optional. The type of element to render, either 'span' or 'label'. Defaults to 'span'.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), elementType = 'span', ...restOfProps }: Form.InputGroupTextProps = $props();

    let classes: string = $derived(uniqueClsx('input-group-text', classValues));
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</svelte:element>
