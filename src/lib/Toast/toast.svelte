<!--
@component
## Toast
Lightweight notifications designed to mimic push notifications that modern web and mobile apps use.

@example
```svelte
<Toast.Root isShown={true}>
    <Toast.Header>
        <span>Toast Title</span>
    </Toast.Header>
    <Toast.Body>
        Toast message goes here.
    </Toast.Body>
</Toast.Root>
```

#### Basic Toast
```svelte
<Toast.Root isShown={true}>
    <Toast.Header titleText="Toast Title" subText="11 mins ago" />
    <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
</Toast.Root>
```

#### Autohide Options
```svelte
<Toast.Root doAutohide={false}>...</Toast.Root>
<Toast.Root doAutohide={8000}>...</Toast.Root>
```

#### Custom Container
```svelte
<div id="toast-container"></div>
<Toast.Root container="#toast-container">...</Toast.Root>
```

### Props
- `children` (slot): Content to display inside the toast.
- `class` (string): Optional. Additional CSS classes.
- `delay` (number): Optional. Delay in milliseconds before hiding the toast. Default is 5000.
- `doAutohide` (boolean): Optional. Automatically hide the toast after the delay. Default is true.
- `elementRef` (HTMLElement): Optional. Reference to the toast DOM element.
- `id` (string): Optional. ID for the toast element.
- `isShown` (boolean): Optional. Controls whether the toast is visible.
- `onHide` (function): Optional. Callback to invoke when the toast starts hiding.
- `onHidden` (function): Optional. Callback to invoke when the toast has been hidden.
- `onShow` (function): Optional. Callback to invoke when the toast starts showing.
- `onShown` (function): Optional. Callback to invoke when the toast has been shown.
- `useFade` (boolean): Optional. If true, applies a fade transition to the toast. Default is true.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { fade } from 'svelte/transition';
    import type { Toast } from './index.js';
    import { initToastRootState, ToastRootState } from './toast.svelte.js';

    // Generate a unique ID for the component, in case one is not provided...
    const uid: string = $props.id();

    let {
        children,
        class: classValues,
        delay = ToastRootState.DELAY_DEFAULT,
        doAutohide = ToastRootState.DO_AUTOHIDE_DEFAULT,
        elementRef = $bindable(null),
        id = `toast-${uid}`,
        isShown = ToastRootState.IS_SHOWN_DEFAULT,
        onHide = noop,
        onHidden = noop,
        onShow = noop,
        onShown = noop,
        useFade = ToastRootState.USE_FADE_DEFAULT,
        ...restOfProps
    }: Toast.RootProps = $props();

    const rootState: ToastRootState = initToastRootState({
        get isShown() {
            return isShown;
        }
    });

    // Track the previously synchronized isShown value so we only react to
    // genuine prop transitions (not to reads of the live rootState.props.isShown).
    let previousIsShown: boolean | undefined;

    // Listen changes to the isShown prop and update the root state accordingly...
    $effect(() => {
        if (previousIsShown !== undefined && previousIsShown !== isShown) {
            if (isShown && !rootState.isShown) {
                rootState.toggleIsShown();
            } else if (!isShown && rootState.isShown) {
                rootState.toggleIsShown();
            }
        }

        previousIsShown = isShown;
    });

    // Listen changes to the doAutohide and delay prop and update the root state accordingly...
    $effect(() => {
        if (rootState.isShown && doAutohide && delay > 0) {
            const timer = setTimeout(() => {
                rootState.toggleIsShown();
            }, delay);

            return () => {
                clearTimeout(timer);
            };
        }
    });

    let classes: string = $derived(
        uniqueClsx(
            'toast',
            {
                fade: useFade,
                show: rootState.isShown
            },
            classValues
        )
    );
</script>

{#if rootState.isShown}
    <div
        aria-atomic="true"
        aria-live="assertive"
        bind:this={elementRef}
        class={classes}
        role="alert"
        {id}
        onintrostart={onShow}
        onintroend={onShown}
        onoutrostart={onHide}
        onoutroend={onHidden}
        transition:fade={{ duration: useFade ? 150 : 0 }}
        {...restOfProps}>
        {@render children?.()}
    </div>
{/if}
