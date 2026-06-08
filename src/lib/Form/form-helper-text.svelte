<!--
@component
## Form.HelperText
Bootstrap-styled helper text component for providing additional information about form controls.

@example
```svelte
// Basic helper text
<Form.TextInput placeholder="Enter your username" />
<Form.HelperText>Your username must be 8-20 characters long.</Form.HelperText>

// With ID association for accessibility
<Form.TextInput id="emailInput" placeholder="Enter your email" aria-describedby="email-help" />
<Form.HelperText id="email-help">We'll never share your email with anyone else.</Form.HelperText>

// Inside a form group
<Form.Group>
    <Form.InputLabel for="passwordInput">Password</Form.InputLabel>
    <Form.PasswordInput id="passwordInput" />
    <Form.HelperText>Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces or emoji.</Form.HelperText>
</Form.Group>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the helper text.
- `elementRef` (HTMLDivElement): Optional. Reference to the helper text DOM element.
- `id` (string): Optional. Unique identifier for the helper text element, used with aria-describedby.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { children, class: classValues, elementRef = $bindable(null), ...restOfProps }: Form.HelperTextProps = $props();

    let classes: string = $derived(uniqueClsx('form-text', classValues));
</script>

<div bind:this={elementRef} class={classes} {...restOfProps}>
    {@render children?.()}
</div>
