<!--
@component
## Button
Use Bootstrap's custom button styles for actions in forms, dialogs, and more. Includes support for multiple sizes, states, and more.

@example
```svelte
<Button>Click me</Button>
```

#### Button color variants
```svelte
<Button colorVariant="primary">Primary</Button>
<Button colorVariant="secondary">Secondary</Button>
<Button colorVariant="success">Success</Button>
<Button colorVariant="danger">Danger</Button>
<Button colorVariant="warning">Warning</Button>
<Button colorVariant="info">Info</Button>
<Button colorVariant="light">Light</Button>
<Button colorVariant="dark">Dark</Button>
<Button colorVariant="link">Link</Button>
```

#### Button sizes
```svelte
<Button size="lg">Large button</Button>
<Button size="sm">Small button</Button>
```

#### Disabled state
```svelte
<Button disabled>Disabled button</Button>
```

#### Button with href
```svelte
<Button href="https://example.com">Link button</Button>
```
#### Button with input type
```svelte
<Button type="submit" value="Submit">Submit</Button>
<Button type="reset" value="Reset">Reset</Button>
<Button type="button" value="Custom">Custom</Button>
```

### Props
- `children` (slot): Content to display inside the button.
- `class` (string): Optional. Additional CSS classes.
- `colorVariant` (string): Optional. Button style variant ('primary', 'secondary', 'success', etc.).
- `disabled` (boolean): Optional. Disables the button when true (default: false).
- `elementRef` (HTMLElement): Optional. Reference to the button DOM element.
- `href` (string): Optional. Turns the button into an anchor element when provided.
- `size` (string): Optional. Button size ('lg' or 'sm').
- `type` (string): Optional. Button type attribute (default: 'button').
- `value` (string): Optional. Value attribute when rendered as an input.
-->
<script lang="ts">
    /* eslint-disable @typescript-eslint/no-explicit-any -- `restOfProps` spread targets <svelte:element> which unions <a>/<button>; the union type is not spreadable without `as any` */
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import type { ButtonRootProps } from './types.js';

    // Generate a unique ID for the collapse element, in case one is not provided...
    const uid: string = $props.id();

    let {
        'aria-disabled': ariaDisabled,
        children,
        class: classValues,
        colorVariant,
        disabled = false,
        elementRef = $bindable(null),
        href,
        id = `btn-${uid}`,
        onclick = noop,
        role: consumerRole,
        size,
        tabindex: consumerTabIndex,
        type = 'button',
        value = $bindable(undefined),
        ...restOfProps
    }: ButtonRootProps = $props();

    let isAnchor: boolean = $derived(href !== undefined);
    let isInput: boolean = $derived(!isAnchor && value !== undefined);
    let elementType: string = $derived(isAnchor ? 'a' : isInput ? 'input' : 'button');

    let classes: string = $derived(
        uniqueClsx('btn', colorVariant && `btn-${colorVariant}`, size && `btn-${size}`, isAnchor && disabled && 'disabled', classValues)
    );

    const handleClick: EventListener = (event: Event) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        ((onclick as EventListener | null) ?? noop)(event);
    };
</script>

{#if !isInput}
    <svelte:element
        this={elementType}
        {...restOfProps as any}
        aria-disabled={disabled ? 'true' : isAnchor ? (ariaDisabled ?? 'false') : ariaDisabled}
        bind:this={elementRef}
        class={classes}
        disabled={isAnchor ? undefined : disabled}
        href={isAnchor && !disabled ? href : undefined}
        {id}
        onclick={handleClick}
        role={isAnchor ? 'button' : consumerRole}
        tabindex={disabled ? -1 : (consumerTabIndex ?? 0)}
        type={isAnchor ? undefined : type}
        ><!-- using `as Record<string, unknown>` because Svelte doesn't support spreading props on elements with different types -->
        {@render children?.()}
    </svelte:element>
{:else}
    <!-- using `as Record<string, unknown>` because Svelte doesn't support spreading props on elements with different types -->
    <input
        {...restOfProps as any}
        aria-disabled={disabled ? 'true' : ariaDisabled}
        bind:this={elementRef}
        bind:value
        class={classes}
        {disabled}
        {id}
        role={consumerRole}
        tabindex={disabled ? -1 : (consumerTabIndex ?? 0)}
        {type}
        onclick={handleClick} />
{/if}
