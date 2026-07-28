# Remove the Bootstrap JS bundle from the showcase

**Date:** 2026-07-28
**Branch:** `remove-bootstrap-js-bundle` (off `main`)

## Goal

Stop the showcase app from loading `bootstrap.bundle.min.js`. The bundle's data-API
handlers and its embedded Popper can interfere with this package's own component
implementations, which manage their own state and ship their own `@popperjs/core`
dependency. Removing it makes the showcase a faithful test of the library: whatever
still works, works because of the library.

Bootstrap **CSS** stays. This change touches JavaScript only.

## Scope

Bootstrap's JS activates markup exclusively through `data-bs-*` attributes (there is no
programmatic init anywhere in this repo). So the blast radius is exactly the set of
`data-bs-*` attributes in live markup.

Inventory across all of `src/routes`:

| Occurrence | File | Status |
| --- | --- | --- |
| `data-bs-toggle="dropdown"` | `src/routes/+layout.svelte:431` | **Only** live JS-dependent markup. Must be replaced. |
| `data-bs-theme` | `src/routes/+layout.svelte` (CSS selectors + `applyColorMode`) | CSS-only Bootstrap feature. Unaffected — keep. |

Every showcase page already uses this package's components. Strings like
`dropdown-menu`, `accordion`, `offcanvas`, and `carousel` appear elsewhere in
`src/routes` only inside `SyntaxHighlighter` code-example template literals or inside
`<code>` class-reference lists in the docs prose. They are not live markup.

Verified absent from `src/`: `window.bootstrap`, `import ... from 'bootstrap'`,
`require('bootstrap')`, and `new bootstrap.<Component>()`.

### Out of scope (deliberate)

- **CSS-only raw Bootstrap markup in `+layout.svelte`** — the three raw
  `class="btn btn-sm ..."` buttons, the docs-search `input-group`, and the sidebar/TOC
  `nav flex-column` lists. These render identically with or without the script, so
  converting them does not serve this goal and only adds regression risk. (The sidebar
  nav is especially risky: its links are styled by a custom `.wk-nav-link` class, not
  `.nav-link`, so `Nav.Link` would change the rendered classes.)
- **The `@types/bootstrap` devDependency**, which appears unused. Left for a separate
  change.

## Changes

### 1. `src/app.html` — remove the script tag

Delete lines 17-20:

```html
<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO"
    crossorigin="anonymous"></script>
```

Keep the Bootstrap CSS `<link>` (lines 7-11) and the bootstrap-icons `<link>` (line 6).

### 2. `src/routes/+layout.svelte` — convert the color-mode control

The topbar color-mode control (lines 418-452) is a `btn-group` holding a cycle button, a
split dropdown toggle wired with `data-bs-toggle="dropdown"`, and a 3-item menu. The UX
is preserved exactly; only the implementation changes.

Add to the existing imports:

```ts
import { Button } from '$lib/Button/index.js';
import { Dropdown } from '$lib/Dropdown/index.js';
```

Element mapping — each target verified against the library source:

| Current raw markup | Replacement | Verification |
| --- | --- | --- |
| `<div class="btn-group">` | `<Dropdown.Root isButtonGroup={true}>` | emits `btn-group` — `dropdown.svelte:95` |
| cycle `<button class="btn btn-sm btn-outline-secondary">` | `<Button colorVariant="outline-secondary" size="sm">` | `outline-secondary` is a member of `ButtonColorVariant` — `Button/types.ts:31` |
| split `<button ... dropdown-toggle-split data-bs-toggle="dropdown" aria-expanded="false">` | `<Dropdown.Toggle colorVariant="outline-secondary" size="sm" isSplit={true} />` | emits `dropdown-toggle dropdown-toggle-split` and binds `aria-expanded` to real state — `dropdown-toggle.svelte:58,72` |
| `<ul class="dropdown-menu dropdown-menu-end">` | `<Dropdown.Menu isEnd={true}>` | `DropdownMenuProps.isEnd` — `Dropdown/types.ts:39` |
| `<li><button class="dropdown-item" class:active>` | `<Dropdown.Item isActive={...}>` | renders `<li><button type="button">` when no `href` — `dropdown-item.svelte:66-67,107-124` |

Preserved on the replacement: `onclick={cycleColorMode}`, `onclick={() => setColorMode(mode)}`,
the `aria-label` / `title` bindings on both buttons, the `<i class="bi ...">` icons, the
`d-flex align-items-center gap-2` classes on each item, `aria-current` on the active
item, and the `{#each colorModeOptions as mode (mode)}` keyed block.

**Accepted a11y delta:** `Dropdown.Toggle` with `isSplit` hardcodes visually-hidden text
"Toggle Dropdown" (`dropdown-toggle.svelte:85`), replacing the current "Toggle color
mode". The existing `aria-label="Change color mode"` on the toggle still carries the
specific meaning to assistive tech, so this is acceptable. Do not work around it by
patching the library.

### 3. `src/routes/components/scrollspy/+page.svelte` — remove dead reference

Delete the commented-out `<svelte:head>` block at lines 267-272, which references the
same bundle. It is inert today and becomes actively misleading once the script is gone.

### 4. Regression guard — `src/app.html.test.ts`

New test in the **server** Vitest project (matched by `src/**/*.{test,spec}.{js,ts}`,
node environment). The server project does not set `globals: true`, so import
explicitly, matching the house style of `src/lib/common/css.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
```

Two assertions:

1. `src/app.html` contains no `<script>` tag whose `src` references `bootstrap`.
2. No live route markup contains a Bootstrap data-API attribute — scan `.svelte` files
   under `src/routes` for `data-bs-toggle`, `data-bs-target`, `data-bs-dismiss`,
   `data-bs-ride`, `data-bs-slide`, `data-bs-spy`, or `data-bs-parent`.

Assertion 2 must not trip on documentation. Two categories of false positive exist and
the test has to tolerate both:

- **`SyntaxHighlighter` code examples** — template literals showing consumers markup.
- **`<code>` class-reference lists** in docs prose.

Read `src/lib/Carousel/carousel-indicator-button.svelte` before writing the matcher: it
legitimately emits `data-bs-target`, which is why the scan is scoped to `src/routes` and
not `src/lib`. If a robust exclusion proves impractical, narrow assertion 2 to
`src/routes/+layout.svelte` plus the `+page.svelte` files rather than weakening it into
a no-op — and say so in the summary.

## Risks

**Global click handler vs. library dropdown.** `handleWindowClick` at
`+layout.svelte:187` is a `<svelte:window onclick>` handler that closes the sidebar on
outside clicks. The library `Dropdown` runs its own outside-click detection. These two
must be confirmed not to fight — symptoms would be the menu closing before an item's
`onclick` fires, or the sidebar closing when a menu item is clicked. Test explicitly.

**Escape key.** `handleWindowKeyDown` at `+layout.svelte:176` intercepts `Escape` to
close the sidebar. Confirm Escape still closes an open color-mode menu.

**Silent loss of interactivity.** The bundle currently supplies nothing else in this app,
but a library component could have a latent bug masked by Bootstrap's handlers. The
verification pass below exists to catch that.

## Verification

Gates, in order:

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Run `pnpm format` before `pnpm lint`. Note: `pnpm format` errors on an already-clean
tree because it derives its file list from `git diff` — that failure is a no-op, but
`pnpm lint`'s prettier check is the real gate.

Then, on the dev server (`pnpm dev`, http://localhost:5176), confirm behavior and a
clean browser console on the JS-dependent showcase pages:

dropdown, modal, offcanvas, collapse, accordion, carousel, tab, toast, tooltip, popover,
navbar, scrollspy.

Plus the converted layout control itself:

- Split toggle opens and closes the menu.
- Selecting each of Dark / Light / Auto applies the theme and persists to
  `localStorage['wk-color-mode']`.
- The cycle button still advances Dark → Light → Auto.
- Active item shows `.active` and `aria-current`.
- Escape closes the menu; an outside click closes it without also closing the sidebar.
- Keyboard navigation through menu items works.
- At ≤991px the topbar actions are hidden (`.wk-topbar-actions { display: none }`), so
  verify the sidebar and its toggle still behave at that width.

Report results honestly, including any page that regresses.

## Definition of done

- No `bootstrap.bundle.min.js` reference anywhere in the repo.
- No `data-bs-*` data-API attribute in live route markup (`data-bs-theme` excepted).
- Color-mode control behaves as it did before, built from library components.
- All four gates pass; the listed pages verified in a browser.
- Work committed on `remove-bootstrap-js-bundle`; `main` untouched.
