<!--
@component
## Form.InputLabel
Bootstrap-styled label component for form input elements.

@example
```svelte
// Standard label for input
<Form.Group>
    <Form.InputLabel for="exampleInput">Email address</Form.InputLabel>
    <Form.EmailInput id="exampleInput" placeholder="name@example.com" />
    <Form.HelperText>We'll never share your email with anyone else.</Form.HelperText>
</Form.Group>

// Floating label (used with Form.Floating)
<Form.Floating>
    <Form.EmailInput id="floatingInput" placeholder="name@example.com" />
    <Form.InputLabel for="floatingInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the label.
- `elementRef` (HTMLLabelElement): Optional. Reference to the label DOM element.
- `isFloating` (boolean): Optional. When true, formats the label for use in floating label contexts.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), isFloating = false, ...restOfProps }: Form.InputLabelProps = $props();

    let classes: string = $derived(uniqueClsx({ 'form-label': !isFloating }, classValues));
</script>

<label bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</label>
