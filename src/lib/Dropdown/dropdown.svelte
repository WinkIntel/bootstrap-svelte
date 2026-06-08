<!--
@component
## Dropdown
Bootstrap's dropdown component provides a togglable overlay of links and actions.

@example
```svelte
<Dropdown.Root>
  <Dropdown.Toggle>Dropdown Button</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item href="#!">Action</Dropdown.Item>
    <Dropdown.Item href="#!">Another action</Dropdown.Item>
    <Dropdown.Divider/>
    <Dropdown.Item href="#!">Something else here</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown.Root>
```

### Props
- `autoClose` (boolean | 'inside' | 'outside'): Optional. Controls auto-closing behavior, default is true.
- `class` (string): Optional. Additional CSS classes to apply to the dropdown.
- `direction` (string): Optional. Direction of the dropdown menu: 'dropdown' (default), 'dropup', 'dropend', 'dropstart'.
- `display` (string): Optional. Display mode of the dropdown: 'dynamic' (default), 'static'.
- `elementRef` (HTMLElement): Optional. Reference to the dropdown DOM element.
- `id` (string): Optional. Unique identifier for the dropdown, default is `dropdown-{uid}`.
- `isButtonGroup` (boolean): Optional. If true, the dropdown is styled as part of a button group.
- `onHide` (function): Optional. Callback when the dropdown is about to be hidden.
- `onHidden` (function): Optional. Callback when the dropdown has been hidden.
- `onShow` (function): Optional. Callback when the dropdown is about to be shown.
- `onShown` (function): Optional. Callback when the dropdown has been shown.
-->
<script lang="ts">
    import { uniqueClsx } from '$lib/common/css.js';
    import { noop } from '$lib/common/noop.js';
    import { DropdownRootState, initDropdownRootState } from './dropdown.svelte.js';
    import type { Dropdown } from './index.js';

    // Generate a unique ID for the dropdown element, in case one is not provided
    const uid: string = $props.id();

    let {
        autoClose = true,
        children,
        class: classValues,
        direction = 'dropdown',
        display = 'dynamic',
        elementRef = $bindable(null),
        id = `dropdown-${uid}`,
        isButtonGroup = false,
        onHide = noop,
        onHidden = noop,
        onShow = noop,
        onShown = noop,
        ...restOfProps
    }: Dropdown.RootProps = $props();

    const rootState: DropdownRootState = initDropdownRootState({
        get autoClose() {
            return autoClose;
        },
        get direction() {
            return direction;
        },
        get display() {
            return display;
        },
        get elementRef() {
            return elementRef;
        },
        get id() {
            return id;
        },
        get isButtonGroup() {
            return isButtonGroup;
        },
        get onHide() {
            return onHide;
        },
        get onHidden() {
            return onHidden;
        },
        get onShow() {
            return onShow;
        },
        get onShown() {
            return onShown;
        }
    });

    let elementType: string = $derived(rootState.isNavItem ? 'li' : 'div');
    let classes: string = $derived(
        uniqueClsx(
            {
                'nav-item': rootState.isNavItem,
                'btn-group': rootState.isButtonGroup,
                dropdown: ['dropdown', 'dropdown-end'].includes(rootState.direction),
                'dropdown-center': rootState.direction === 'dropdown-center',
                'dropdown-end': rootState.direction === 'dropdown-end',
                dropup: ['dropup', 'dropup-end'].includes(rootState.direction),
                'dropup-center': rootState.direction === 'dropup-center',
                'dropup-end': rootState.direction === 'dropup-end',
                dropend: rootState.direction === 'dropend',
                dropstart: rootState.direction === 'dropstart'
            },
            classValues
        )
    );

    // Forward prop changes to the matching rootState setters so their side effects
    // (e.g. elementRef setter detecting nav-item parent) run on every transition.
    // The setters internally compare against their captured state, so calling them
    // on each prop change is safe and idempotent.
    $effect(() => {
        rootState.autoClose = autoClose;
    });

    $effect(() => {
        rootState.elementRef = elementRef;
    });

    $effect(() => {
        rootState.direction = direction;
    });

    $effect(() => {
        rootState.isButtonGroup = isButtonGroup;
    });

    $effect(() => {
        rootState.display = display;
    });
</script>

<svelte:element this={elementType} bind:this={elementRef} class={classes} {id} {...restOfProps}>
    {@render children?.()}
</svelte:element>
