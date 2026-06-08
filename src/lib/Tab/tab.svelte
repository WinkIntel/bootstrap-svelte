<!--
@component
## Tab.Root
Root component for tab content. Used with tabs navigation.

@example
```svelte
<Tab.Root>
    <Nav.Root data-testid="nav-tabs" itemStyle="tabs">
        <Nav.Item>
            <Nav.Link href="#home-tabpane" id="home-navlink" isActive={true}>Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#profile-tabpane" id="profile-navlink">Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#contact-tabpane" id="contact-navlink">Contact</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#disabled-tabpane" id="disabled-navlink" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
    <Tab.Content data-testid="tab-content-container">
        <Tab.Pane data-testid="home-content" id="home-tabpane" isActive={true}>
            <h5 class="mt-3">Home Content</h5>
            <p>This is the home content panel.</p>
        </Tab.Pane>
        <Tab.Pane data-testid="profile-content" id="profile-tabpane">
            <h5 class="mt-3">Profile Content</h5>
            <p>This is the profile content panel.</p>
        </Tab.Pane>
        <Tab.Pane data-testid="contact-content" id="contact-tabpane">
            <h5 class="mt-3">Contact Content</h5>
            <p>This is the contact content panel.</p>
        </Tab.Pane>
        <Tab.Pane data-testid="disabled-content" id="disabled-tabpane">
            <h5 class="mt-3">Disabled Content</h5>
            <p>This is the disabled content panel.</p>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>
```
### Props
- `class` (string): Optional. Additional CSS classes
- `elementRef` (HTMLElement): Optional. Reference to the root DOM element
- `id` (string): Optional. Unique ID for the root element. Defaults to `tab-{uid}`, where `uid` is a unique identifier.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { initTabRootState, TabRootState } from '../common/nav-tab.svelte.js';
    import type { Tab } from './index.js';

    // Generate a unique ID for the card element, in case one is not provided...
    const uid: string = $props.id();

    let { children, class: classValues, elementRef = $bindable(null), id = `tab-${uid}`, ...restOfProps }: Tab.RootProps = $props();

    const _rootState: TabRootState = initTabRootState({
        get id() {
            return id;
        }
    });

    let classes: string = $derived(uniqueClsx(classValues));
</script>

<div bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</div>
