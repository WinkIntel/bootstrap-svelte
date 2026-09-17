# Migrating from 1.x to 2.0

Version **2.0.0 is planned and has not been released**. This guide covers the Navbar and Offcanvas changes currently under development. The package version will be updated separately when the release is prepared.

The Svelte peer requirement remains `^5.29.0`. Continue importing Bootstrap 5 CSS in your application.

## Choose the Navbar expansion mode explicitly

Omitting `expandOnBreakpoint`, or setting it to `"xs"`, now means inline, expanded navigation at every viewport width, including server-rendered output. Previously, the default combined collapsible CSS with inconsistent small-screen state.

Choose the mode that matches your layout:

| Intended layout                                       | Navbar prop in 2.0                                     |
| ----------------------------------------------------- | ------------------------------------------------------ |
| Hamburger/collapsible navigation at every width       | `expandOnBreakpoint={false}`                           |
| Collapsible below a breakpoint, inline at or above it | `expandOnBreakpoint="lg"` (or `sm`, `md`, `xl`, `xxl`) |
| Always inline                                         | Omit the prop, or use `expandOnBreakpoint="xs"`        |

For an existing Navbar that should keep its toggler at every width, add `false`:

```svelte
<Navbar.Root expandOnBreakpoint={false}>
    <Navbar.Toggler />
    <Navbar.Collapse>
        <!-- Navigation content -->
    </Navbar.Collapse>
</Navbar.Root>
```

The same choice applies when the Navbar contains an Offcanvas instead of a Collapse. Use a boolean expression, `{false}`, rather than the string `"false"`.

Runtime changes to the breakpoint now replace the previous responsive subscription. Check layouts that change this prop dynamically; stale breakpoint matches no longer keep content expanded.

## Remove Offcanvas `showOnBreakpoint="xs"`

`OffcanvasBreakpoint` and `Offcanvas.RootProps['showOnBreakpoint']` now accept only `sm`, `md`, `lg`, `xl`, and `xxl`. Bootstrap has no `offcanvas-xs` class. Update both component markup and any typed configuration containing `"xs"`.

For a standalone overlay, remove the prop and control visibility normally:

```svelte
<!-- Before -->
<Offcanvas.Root showOnBreakpoint="xs" isShown={open}>
    <!-- Panel content -->
</Offcanvas.Root>

<!-- After -->
<Offcanvas.Root isShown={open}>
    <!-- Panel content -->
</Offcanvas.Root>
```

An omitted standalone breakpoint produces a dismissible overlay, initially closed unless `isShown` is true. It does not provide an always-inline standalone panel. Use ordinary layout markup for content that should always remain inline, or select a supported breakpoint for a responsive Offcanvas.

Inside a Navbar, omitting the Offcanvas breakpoint makes the panel inherit the Navbar's mode. To keep navigation always inline, put `"xs"` on the Navbar:

```svelte
<Navbar.Root expandOnBreakpoint="xs">
    <Offcanvas.Root>
        <!-- Always-inline navigation content -->
    </Offcanvas.Root>
</Navbar.Root>
```

For responsive navigation, use a named breakpoint such as `"lg"` on the Navbar and omit the Offcanvas breakpoint. Set an explicit, supported Offcanvas breakpoint only when the panel should use its own responsive threshold.

Legacy JavaScript or untyped input that still supplies `"xs"` is treated as an omitted Offcanvas breakpoint: standalone panels become overlays, and nested panels inherit their Navbar's mode. This runtime fallback does not preserve TypeScript source compatibility or the old behavior; update those usages before upgrading.

## Check custom breakpoint and visibility logic

- `BreakpointMinimumMediaQuery.xs` now means `(min-width: 0px)`, matching all viewport widths. If custom code used it to detect only the smallest size, use `BreakpointMaximumMediaQuery.xs` instead. The maximum-width map and BreakpointListener's size ranges are unchanged.
- A nested Offcanvas with its own explicit breakpoint follows that breakpoint for inline visibility. A parent Navbar's responsive match no longer forces an unmatched panel open. Ensure a trigger remains available wherever that panel becomes an overlay.
- Navbar toggler-opened state is cleared when navigation becomes inline. Resizing back below the breakpoint leaves it collapsed until opened again. Explicit visibility assignments are preserved separately until a subsequent visibility action replaces them.

## Verify the consuming application

Run your application's Svelte/TypeScript checks and review each Navbar and Offcanvas at mobile and desktop widths, including transitions across its breakpoint. Check initial server-rendered visibility, toggler reachability, open/close interactions, backdrops, and body scrolling. Review custom styles targeting `.navbar-expand`, `.offcanvas`, or the unsupported `.offcanvas-xs` class.
