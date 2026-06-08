<!--
@component
## Form.ImageInput
Bootstrap-styled image input component that acts as a graphical submit button.

@example
```svelte
// Basic image input
<Form.ImageInput src="https://www.w3schools.com/tags/img_submit.gif" alt="Submit" width="48" height="48" />

// Inside a form
<form action="/submit" method="post">
    <Form.TextInput name="username" placeholder="Username" />
    <Form.PasswordInput name="password" placeholder="Password" />
    <Form.ImageInput src="/images/submit-button.png" alt="Submit" width="100" height="40" />
</form>

// With additional styling
<Form.ImageInput class="rounded shadow" src="/images/login-button.png" alt="Login" width="120" height="40" title="Click to login" />
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the image input.
- `elementRef` (HTMLInputElement): Optional. Reference to the input DOM element.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let { class: classValues, elementRef = $bindable(null), ...restOfProps }: Form.ImageInputProps = $props();

    let classes: string = $derived(uniqueClsx(classValues));
</script>

<input bind:this={elementRef} class={classes} type="image" {...restOfProps} />
