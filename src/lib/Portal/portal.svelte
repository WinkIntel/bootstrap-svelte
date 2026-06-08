<!--
@component
## Portal
Render a component into a different part of the DOM tree.

@example
```svelte
<Portal target="body">
    <div>
        <h1>Hello from the portal!</h1>
        <p>This content is rendered as a child of the <code>body</code> element.</p>
    </div>
</Portal>
```

#### Disabled prop
```svelte
<Portal target="body" disabled={true}>
    <div>
        <p>This content will be rendered inline instead of as a child of the <code>body</code> element.</p>
    </div>
</Portal>
```

### Props
- `children`: The content to render inside the portal. This can be any valid Svelte component or HTML element.
- `disabled`: If true, the portal will not be rendered. This is useful for conditionally rendering the portal based on some state.
- `target`: The target element to render the portal into. This can be a string selector or an element reference.
-->
<script lang="ts">
    import { getAllContexts, mount, unmount } from 'svelte';
    import PortalHost from './portal-host.svelte';
    import type { PortalRootProps } from './types.js';

    const { children, target, disabled = false }: PortalRootProps = $props();
    const allContexts = getAllContexts();

    $effect(() => {
        let component: Record<string, unknown>;
        let element: Element | null;

        if (disabled) {
            return;
        }
        if (!target) {
            console.warn(`[Portal] target is not defined. Please provide a valid target element.`);
            return;
        }

        if (typeof target === 'string') {
            element = document.querySelector(target);
        } else {
            element = target;
        }
        if (!element) {
            console.warn(`[Portal] Unable to find target element: ${target}`);
            return;
        }

        component = mount(PortalHost, {
            target: element,
            props: { children },
            context: allContexts
        });

        return () => {
            if (component) {
                unmount(component);
            }
        };
    });
</script>

{#if disabled}
    {@render children()}
{/if}
