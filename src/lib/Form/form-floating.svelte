<!--
@component
## Form.Floating
Bootstrap-styled floating label container for form inputs.

@example
```svelte
// Default floating label
<Form.Floating>
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>

// Disabled floating label
<Form.Floating>
    <Form.EmailInput disabled placeholder="name@example.com" id="floatingEmailInput" />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>

// Readonly floating label
<Form.Floating>
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" readonly />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>

// Small sizing floating label
<Form.Floating>
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" sizing="sm" />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>
```
### Props
- `children` (any): Required. Child elements to be rendered inside the floating container.
- `class` (string): Optional. Additional CSS classes to apply to the container.
- `elementRef` (HTMLDivElement): Optional. Reference to the container DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Form.FloatingProps = $props();

    let classes: string = $derived(uniqueClsx('form-floating', classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>
