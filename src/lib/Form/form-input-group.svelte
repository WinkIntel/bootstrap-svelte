<!--
@component
## Form.InputGroup
Bootstrap-styled container for grouping form controls with additional elements like text, buttons, or other inputs.

@example
```svelte
// Basic input group with text
<Form.InputGroup>
    <span class="input-group-text">@</span>
    <Form.TextInput placeholder="Username" />
</Form.InputGroup>

// Input with prefix and suffix
<Form.InputGroup>
    <span class="input-group-text">$</span>
    <Form.TextInput aria-label="Amount (to the nearest dollar)" />
    <span class="input-group-text">.00</span>
</Form.InputGroup>

// Input with button
<Form.InputGroup>
    <Form.TextInput placeholder="Recipient's username" aria-label="Recipient's username" />
    <button class="btn btn-outline-secondary" type="button">Button</button>
</Form.InputGroup>

// Multiple inputs
<Form.InputGroup>
    <span class="input-group-text">First and last name</span>
    <Form.TextInput aria-label="First name" />
    <Form.TextInput aria-label="Last name" />
</Form.InputGroup>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the input group.
- `elementRef` (HTMLDivElement): Optional. Reference to the input group DOM element.
- `hasValidation` (boolean): Optional. Indicates if the input group has validation styles applied.
- `noWrap` (boolean): Optional. If true, prevents wrapping of the input group elements.
- `sizing` ('sm' | 'lg'): Optional. Controls the size of the input element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        hasValidation,
        noWrap,
        sizing,
        ...restOfProps
    }: Form.InputGroupProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            'input-group',
            {
                [`input-group-${sizing}`]: !!sizing,
                'has-validation': hasValidation,
                'flex-nowrap': noWrap
            },
            classValues
        )
    );
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>
