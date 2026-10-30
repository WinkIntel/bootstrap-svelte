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
    import { clearTabRootContext, initTabPaneState, TabPaneState } from '../common/nav-tab.svelte.js';
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
        onintrostart: onIntroStart,
        onintroend: onIntroEnd,
        onoutrostart: onOutroStart,
        onoutroend: onOutroEnd,
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

    // Descendants are pane content, not members of this tab strip. A nested Tab.Root creates its own context.
    clearTabRootContext();

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
    const handleShow: NonNullable<Tab.PaneProps['onintrostart']> = (event) => {
        if (doFade) elementRef?.classList.add('active');
        onShow?.call(event.currentTarget, event);
        onIntroStart?.call(event.currentTarget, event);
    };
    const handleHide: NonNullable<Tab.PaneProps['onoutrostart']> = (event) => {
        if (doFade) elementRef?.classList.remove('active');
        onHide?.call(event.currentTarget, event);
        onOutroStart?.call(event.currentTarget, event);
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
        onintrostart={handleShow}
        onintroend={(event) => {
            onShown?.call(event.currentTarget, event);
            onIntroEnd?.call(event.currentTarget, event);
        }}
        onoutrostart={handleHide}
        onoutroend={(event) => {
            onHidden?.call(event.currentTarget, event);
            onOutroEnd?.call(event.currentTarget, event);
        }}
        role="tabpanel"
        transition:fade={{ duration: doFade ? 500 : 0 }}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}
