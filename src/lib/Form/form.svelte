<!--
@component
## Form.Root
Form container with optional progressive enhancement and Bootstrap validation classes.

@example
```svelte
<Form.Root action="/submit" method="post">
    <Form.TextInput name="username" placeholder="Enter your username" />
    <Form.PasswordInput name="password" placeholder="Enter your password" />
    <Button type="submit">Submit</Button>
</Form.Root>
```
### Props
- `class` (string): Optional. Additional CSS classes to apply to the form.
- `elementRef` (HTMLFormElement): Optional. Reference to the form DOM element.
- `enhance` (function): Optional. Function to enhance the form with additional behavior, such as validation.
- `needsValidation` (boolean): Optional. Indicates if the form needs validation styles.
- `wasValidated` (boolean): Optional. Indicates if the form has been validated.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import type { Form } from './index.js';

    let {
        children,
        class: classValues,
        elementRef = $bindable(null),
        enhance = undefined,
        needsValidation = false,
        wasValidated = false,
        ...restOfProps
    }: Form.RootProps = $props();

    let classes: string = $derived(
        uniqueClsx(
            {
                'needs-validation': needsValidation,
                'was-validated': wasValidated
            },
            classValues
        )
    );
</script>

{#if enhance}
    <form bind:this={elementRef} use:enhance class={classes} {...restOfProps}>
        {@render children?.()}
    </form>
{:else}
    <form bind:this={elementRef} class={classes} {...restOfProps}>
        {@render children?.()}
    </form>
{/if}
