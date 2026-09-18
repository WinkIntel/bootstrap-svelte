# Migrating from 1.x to 2.0

Version **2.0.0** includes breaking Navbar and Offcanvas changes. This guide explains how to update a 1.x application before upgrading.

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

`Offcanvas.RootProps['showOnBreakpoint']` now accepts only `sm`, `md`, `lg`, `xl`, and `xxl`. Bootstrap has no `offcanvas-xs` class. Update both component markup and any typed configuration containing `"xs"`.

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

A default/`xs` Navbar containing `<Offcanvas.Root showOnBreakpoint="lg">` needs particular attention: below `lg`, the panel is closed while the always-inline Navbar hides its toggler. Forcing `Navbar.Toggler` visible with CSS does not fix this, because inline Navbar mode also clears toggler-opened state. Move the breakpoint to the Navbar so both components share the same mode:

```svelte
<!-- Before: the Navbar default and the panel's own breakpoint disagree -->
<Navbar.Root>
    <Navbar.Toggler />
    <Offcanvas.Root showOnBreakpoint="lg">
        <!-- Navigation content -->
    </Offcanvas.Root>
</Navbar.Root>

<!-- After: the toggler and panel share the lg breakpoint -->
<Navbar.Root expandOnBreakpoint="lg">
    <Navbar.Toggler />
    <Offcanvas.Root>
        <!-- Navigation content -->
    </Offcanvas.Root>
</Navbar.Root>
```

If independent thresholds are intentional, use a separate reachable trigger that updates the Offcanvas `isShown` prop where the Navbar is inline but the panel is an overlay. `Navbar.Toggler` cannot control that combination.

Legacy JavaScript or untyped input that still supplies `"xs"` is treated as an omitted Offcanvas breakpoint: standalone panels become overlays, and nested panels inherit their Navbar's mode. This runtime fallback does not preserve TypeScript source compatibility or the old behavior; update those usages before upgrading.

## Check custom breakpoint and visibility logic

- A nested Offcanvas with its own explicit breakpoint follows that breakpoint for inline visibility. A parent Navbar's responsive match no longer forces an unmatched panel open. Prefer the shared-breakpoint setup above so the Navbar toggler remains usable whenever the panel becomes an overlay.
- Navbar toggler-opened state is cleared when navigation becomes inline. Resizing back below the breakpoint leaves it collapsed until opened again. Explicit visibility assignments are preserved separately until a subsequent visibility action replaces them.

## Verify the consuming application

Run your application's Svelte/TypeScript checks and review each Navbar and Offcanvas at mobile and desktop widths, including transitions across its breakpoint. Check initial server-rendered visibility, toggler reachability, open/close interactions, backdrops, and body scrolling. Review custom styles targeting `.navbar-expand`, `.offcanvas`, or the unsupported `.offcanvas-xs` class.
