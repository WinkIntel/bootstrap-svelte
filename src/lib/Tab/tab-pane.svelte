<!--
@component
## Tab.Pane
Content pane for a tab. Used inside Tab.Root.

@example
```svelte
<Tab.Pane id="home" isActive={true} doFade={true}>
    Content for home tab
</Tab.Pane>
```

### Props
- `class` (string): Optional. Additional CSS classes.
- `elementRef` (HTMLElement): Optional. Reference to the DOM element.
- `doFade` (boolean): Optional. Whether to use fade transition. Defaults to false.
- `id` (string): Required. ID matching the href of a Nav.Link.
- `isActive` (boolean): Optional. Whether the pane is initially visible.
- `onHide` (function): Optional. Callback when the pane is about to be hidden.
- `onHidden` (function): Optional. Callback when the pane has been hidden.
- `onShow` (function): Optional. Callback when the pane is about to be shown.
- `onShown` (function): Optional. Callback when the pane has been shown.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { fade } from 'svelte/transition';
    import { initTabPaneState, TabPaneState } from '../common/nav-tab.svelte.js';
    import type { Tab } from './index.js';

    // Generate a unique ID for the pane element, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        doFade = false,
        elementRef = $bindable(null),
        id = `tab-pane-${uid}`,
        isActive = false,
        onHide = noop,
        onHidden = noop,
        onShow = noop,
        onShown = noop,
        ...restOfProps
    }: Tab.PaneProps = $props();

    const paneState: TabPaneState = initTabPaneState({
        get id() {
            return id;
        },
        get isActive() {
            return isActive;
        }
    });

    let isActiveState = $derived(paneState.root.isTabPaneActive(id));
    let classes: string = $derived(
        uniqueClsx(
            'tab-pane',
            {
                // The "fade" and "show" class is not needed because we are using the Svelte transition
                active: isActiveState
            },
            classValues
        )
    );

    // The active class can only added or removed when the transition is complete.
    const handleShow: EventListener = (event: Event) => {
        elementRef?.classList.add('active');
        onShow(event);
    };
    const handleHide: EventListener = (event: Event) => {
        elementRef?.classList.remove('active');
        onHide(event);
    };
</script>

{#if isActiveState}
    <div
        aria-hidden={!isActiveState}
        aria-labelledby={paneState.ariaLabelledBy}
        bind:this={elementRef}
        class={classes}
        hidden={!isActiveState}
        {id}
        onintrostart={doFade ? handleShow : onShow}
        onintroend={onShown}
        onoutrostart={doFade ? handleHide : onHide}
        onoutroend={onHidden}
        role="tabpanel"
        transition:fade={{ duration: doFade ? 500 : 0 }}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}
