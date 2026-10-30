# Changelog

All notable changes to Bootstrap Svelte will be documented in this file.

## Unreleased

### Fixed

- Correct Nav.Root default roles: use `tablist` in Tab.Root navigation strips for tabs, pills, underline and unstyled navigation; leave ordinary lists and `<nav>` with their native semantics. Preserve explicit role overrides and make `role={null}` omit the root role. Keep navigation inside Tab.Pane ordinary, and suppress inferred child tab semantics when the root role is overridden. Infer vertical orientation only for tablists with `verticalBreakpoint="xs"`; explicit orientation values remain supported ([#50](https://github.com/WinkIntel/bootstrap-svelte/issues/50)). Keyboard behavior is unchanged.
- Markup compatibility: code that relied on the former implicit `role="navigation"` on a list should wrap that list in a named `<nav>` or use `elementType="nav"` with direct Nav.Link children. Styling ordinary links as tabs no longer gives them a tablist role. Custom tab widgets outside Tab.Root must explicitly set `role="tablist"` on Nav.Root, `role="presentation"` on Nav.Item and `role="tab"` on Nav.Link, and manage their own panel associations, selection state and interaction behavior. Responsive tablists must supply orientation that tracks their layout rather than relying on a static inferred value. Updated showcase guidance, playground and Scrollspy markup accordingly.

## 2.2.0 — 2026-10-29

### Security / compatibility

- **Deliberate security-baseline exception for #49:** this peer-floor restriction is scheduled within 2.x rather than as an API major. It is an install-time compatibility change for applications on Svelte 5.29.0–5.55.6: a 2.x library update allowed by an existing caret range can require upgrading Svelte, and strict peer installs can fail until that upgrade. This is specific to the published Svelte advisory baseline; it does not change the normal major-release policy for breaking component APIs or authorize unrelated peer-floor increases.
- Raise the Svelte peer requirement from `^5.29.0` to `^5.55.7` ([#49](https://github.com/WinkIntel/bootstrap-svelte/issues/49)). Consumers on earlier Svelte 5 versions must upgrade before installing this release. Svelte 5.55.7 includes the published [SSR spread-attribute](https://github.com/sveltejs/svelte/security/advisories/GHSA-pr6f-5x2q-rwfp) and [DOM-clobbering](https://github.com/sveltejs/svelte/security/advisories/GHSA-rcqx-6q8c-2c42) fixes, as well as earlier advisory fixes. Component APIs are unchanged. CI verifies the exact minimum alongside the normal development version. The 1.x peer range remains `^5.29.0`; its guidance recommends the patched baseline without changing compatibility metadata.

### Upgrading

Update the application's existing Svelte dependency to `^5.55.7` (or another supported 5.x version at or above 5.55.7), reinstall dependencies, and run the application's checks before adopting 2.2.0. Applications already on that baseline need no component API migration. Strict peer installation on older Svelte versions can fail; the previous 1.x and 2.1.x package metadata is not changed retroactively.

### Validation

- Verify exact Svelte 5.55.7 alongside the frozen development toolchain. The required `build` check gates both validations, including the minimum-version suite and a fresh packed-consumer type check/build. This release contains only [#49](https://github.com/WinkIntel/bootstrap-svelte/issues/49); the overlay, Dropdown and color-class batch was already released in 2.1.5 and 1.1.4.

## 2.1.5 — 2026-10-28

### Compatibility / custom-theme migration

- Badge and Alert accept `colorVariant="none"` to omit library color classes. Custom themes must opt out explicitly: `<Badge class="badge-brand" colorVariant="none">` and `<Alert class="brand-alert" colorVariant="none">`. Arbitrary custom classes, including `bg-brand` / `alert-brand`, are no longer treated as known Bootstrap color overrides. Existing custom themes may otherwise acquire primary colors. Null, empty and omitted variants retain their previous fallback semantics. This behavior change applies to both release lines.

### Fixed

- Preserve overlay lifecycle callbacks and internal dismissal/cleanup when consumer DOM handlers are supplied. Keep supported Modal/Toast/Popover roles and omit dialog semantics on inline responsive Offcanvas panels ([#46](https://github.com/WinkIntel/bootstrap-svelte/issues/46)).
- Chain Alert, Collapse, Carousel.Item and Tab.Pane lifecycle callbacks with consumer transition handlers, preserving callback order and DOM receivers. Retain Tab fade-out cleanup and Navbar collapsed-callback receivers ([#126](https://github.com/WinkIntel/bootstrap-svelte/issues/126)).
- Destroy Dropdown Popper instances on hide/unmount, create one instance per reopen, support static positioning and apply reactive offsets without creating hidden instances ([#47](https://github.com/WinkIntel/bootstrap-svelte/issues/47)).
- Preserve Badge and Alert default primary colors with layout-only classes. Normalize string, array and object classes before detecting explicit color overrides ([#48](https://github.com/WinkIntel/bootstrap-svelte/issues/48)).

## 2.1.4 — 2026-10-22

Compatible bug-fix patch for [#45](https://github.com/WinkIntel/bootstrap-svelte/issues/45). Public component APIs, runtime dependencies and the Svelte peer requirement (`^5.29.0`) are unchanged. The Vite development dependency was updated to 8.1.6.

- Fixed initially shown Modal scroll locking and `modal-open` handling, including hydration, with cleanup preserved on close and unmount.
- Fixed initial `onShow`/`onShown` delivery for Modal, Offcanvas, Toast and Tooltip when Svelte skips a local intro. Native transition timing is preserved; closing or unmounting from `onShow` cancels synthetic completion, and responsive inline Offcanvas panels do not receive synthetic overlay callbacks.
- Kept lifecycle DOM identity private across all four overlays so clearing a consumer-bound `elementRef` inside `onShow` no longer suppresses `onShown`. Public ref assignment and cleanup remain intact.
- Preserved Svelte transition direction and deferred transition results through the internal lifecycle wrapper.

### Testing

- Added overlay dismissal coverage and library coverage floors ([#44](https://github.com/WinkIntel/bootstrap-svelte/issues/44), [#112](https://github.com/WinkIntel/bootstrap-svelte/pull/112)).
- Added initial lifecycle, SSR/hydration, ref-cleanup and deferred-transition regressions ([#113](https://github.com/WinkIntel/bootstrap-svelte/pull/113), [#115](https://github.com/WinkIntel/bootstrap-svelte/pull/115)).

## 2.1.3 — 2026-10-19

Documentation-only npm patch. Library runtime, public APIs, dependencies, and the Svelte peer requirement (`^5.29.0`) are unchanged.

- Corrected packaged component hover documentation and examples to use existing props and exports, including ListGroup, Pagination, Table, Toast, Form, Modal, Carousel, and Dropdown. Corrected easing descriptions and clarified responsive-table prerequisites and optional carousel indicator labels ([#63](https://github.com/WinkIntel/bootstrap-svelte/issues/63), [#108](https://github.com/WinkIntel/bootstrap-svelte/pull/108)).
- Corrected the README component/export list and documented Bootstrap ≥ 5.3 and < 6, with consumer install commands using `bootstrap@^5.3`. This is compatibility guidance, not a new package peer constraint; optional Bootstrap peer metadata remains a separate evaluation ([#109](https://github.com/WinkIntel/bootstrap-svelte/issues/109)).

### Correcting copied examples

These are corrections to previously inaccurate examples, not API renames or removals. If you copied them, update the affected usage:

| Previous example                                      | Correct usage                                                                                              |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `ariaLabel` on `Pagination.Root` or `Pagination.Link` | `aria-label`                                                                                               |
| `ListGroup.Root isHorizontal`                         | `horizontalOnBreakpoint="xs"` for all widths, or another breakpoint; `Collapse.isHorizontal` remains valid |
| `Toast.Root doAutohide={8000}`                        | `doAutohide delay={8000}`                                                                                  |
| `Toast.Root container="..."`                          | Nest the toast in `Toast.Container` and set its `placement`                                                |
| `Toast.Header titleText` / `subText`                  | Supply header children, such as a title and timestamp                                                      |
| `Table.Cell` / `Table.Root isContained`               | Use `Table.Data`; omit the unsupported `isContained` prop (the outer container is always rendered)         |
| `Dropdown.Text`                                       | `Dropdown.ItemText`                                                                                        |
| `Pagination.Root disabled`                            | Set `isDisabled` on the relevant `Pagination.Item` / `Pagination.Link`                                     |

### Website and agent documentation already available

- Updated website and agent install instructions and clarified that form controls use `sizing` for Bootstrap sizing ([#108](https://github.com/WinkIntel/bootstrap-svelte/pull/108)).
- Served showcase images locally, updated resource disclosures and response headers, added integrity metadata for the pinned icon stylesheet, and stabilized initial theme and mobile table-of-contents rendering ([#104](https://github.com/WinkIntel/bootstrap-svelte/pull/104)).
- Corrected showcase prop-table entries and the Pagination accessible-label default ([#105](https://github.com/WinkIntel/bootstrap-svelte/pull/105)).

### Documentation testing

- Added TypeScript-backed validation of showcase table prop names and a documented local props-manifest experiment; a public manifest endpoint and generated tables remain deferred ([#105](https://github.com/WinkIntel/bootstrap-svelte/pull/105)).
- Reused the props catalog to validate hover prop names and README exports, reject missing or empty Props sections and nested comments, and recognize Markdown heading boundaries ([#108](https://github.com/WinkIntel/bootstrap-svelte/pull/108)). These repository tests validate names, not example compilation, prop values, or runtime defaults; they are not shipped in the npm package.

### Release tooling

- Corrected the named protected App-key contract for the reusable release-page workflow ([#100](https://github.com/WinkIntel/bootstrap-svelte/pull/100)).
- Added an explicitly dispatched configuration-only check through the protected reusable workflow; it does not publish packages or create releases ([#102](https://github.com/WinkIntel/bootstrap-svelte/pull/102)).
- Updated pinned setup-node, upload-artifact, and download-artifact actions ([#107](https://github.com/WinkIntel/bootstrap-svelte/pull/107)).

## 2.1.2 — 2026-10-14

- Fixed presses inside responsive Offcanvas panels (`showOnBreakpoint`) incorrectly dismissing the overlay or firing `onHidePrevented` with a static backdrop. Inside buttons remain usable; outside dismissal and trigger ownership are preserved ([#43](https://github.com/WinkIntel/bootstrap-svelte/issues/43)).

### Release tooling

- Added verified GitHub release-page creation after successful npm publication, with source-pinned changelog notes, artifact/provenance verification, and recovery without republishing npm.
- Added a separately approved, manual release App authentication diagnostic that checks identity, exact declared permissions, repository scope, and workflow read access without repository or npm writes.

## 2.1.1 — 2026-10-12

Documentation-only npm patch. Library component APIs, runtime, and the Svelte peer requirement (`^5.29.0`) are unchanged.

- Corrected the packaged README Modal quick start to reset visibility in `onHide`, allowing the example to reopen during and after dismissal ([#42](https://github.com/WinkIntel/bootstrap-svelte/issues/42)).

### Website and agent documentation already available

- Corrected the live Modal showcase examples, matching snippets, and interactive playground to reset visibility at the `onHide` callback, so subsequent opener clicks can reverse the outro with event tracking enabled or disabled. Generated playground snippets include their imports and event handlers. Added actual-showcase regressions for repeated dismissal and reopening ([#42](https://github.com/WinkIntel/bootstrap-svelte/issues/42)).

- Corrected the Modal quick starts in AGENTS.md and generated agent docs, plus the basic Toast showcase demo, so they can reopen during and after dismissal or autohide. Fixed the Toast showcase sample imports/state and its `Toast.Container` prop documentation ([#42](https://github.com/WinkIntel/bootstrap-svelte/issues/42)).

## 2.1.0 — 2026-09-19

Compatible update for 2.x consumers. The Svelte peer requirement remains `^5.29.0`.

- Added optional `Offcanvas.Root` `triggerElements` references for standalone consumer-controlled buttons and links ([#31](https://github.com/WinkIntel/bootstrap-svelte/issues/31)). Enabled primary presses on owning triggers no longer dismiss the panel before the consumer click or emit spurious static-backdrop `onHidePrevented` events. Ownership follows the current references without retained registrations; disabled, non-primary, and unrelated outside presses keep their existing behavior. Includes trigger lifecycle, cancellation, and overlay-stack regressions plus an interactive example. The Svelte peer range is unchanged.

- Fixed `collapseAria` cleanup and reactive reattachment deleting consumer-owned ARIA attributes and roles ([#29](https://github.com/WinkIntel/bootstrap-svelte/issues/29)). Cleanup restores previous expanded state and removes attachment-created attributes only while their current values still match the attachment's writes, preserving later consumer changes. The required `ariaControls` API and Svelte peer range are unchanged; browser-only behavior and value-based ownership are documented.

## 2.0.0 — 2026-09-18

See the [1.x to 2.0 migration guide](MIGRATION.md) before upgrading. The Svelte peer requirement remains `^5.29.0`.

- Fixed Navbar-owned togglers dismissing an Offcanvas on mousedown before their click toggled it again. Owning enabled primary-button presses now leave the state change to the toggler; unrelated outside presses retain normal backdrop behavior ([#26](https://github.com/WinkIntel/bootstrap-svelte/issues/26)).
- Automatically associate Navbar togglers with rendered Collapse and Offcanvas panel IDs through `aria-controls`, preserve explicit consumer overrides, and update registrations when IDs change or panels leave the DOM.

- **Breaking type correction:** `Offcanvas.RootProps['showOnBreakpoint']` now accepts only `sm`, `md`, `lg`, `xl`, and `xxl`, matching Bootstrap's responsive Offcanvas classes ([#33](https://github.com/WinkIntel/bootstrap-svelte/issues/33)). Remove `showOnBreakpoint="xs"`: omitted standalone panels remain dismissible overlays; omitted nested panels inherit the Navbar's responsive mode. Legacy/untyped runtime `xs` is normalized to omitted, so default/`xs` Navbar content remains reachable at every width and `offcanvas-xs` is never emitted. For always-inline Navbar content, select `expandOnBreakpoint="xs"` on Navbar and omit the panel breakpoint.
- Corrected the internal minimum-width map's `xs` entry to `(min-width: 0px)`. The maps are not public runtime exports and require no consumer migration. Navbar's unconditional `xs` handling continues to provide SSR consistency independently of the map; the maximum-width map and BreakpointListener's size ranges are unchanged.

- Fixed Navbar breakpoint changes leaving stale responsive state. CSS, toggler ARIA, Collapse visibility, and an inheriting Offcanvas now follow the current `expandOnBreakpoint`, with obsolete media-query subscriptions released ([#27](https://github.com/WinkIntel/bootstrap-svelte/issues/27)).
- **Behavior change:** omitted `expandOnBreakpoint` and explicit `"xs"` now consistently mean always-expanded inline navigation at every width, including phones and SSR. Previously the default combined collapsible CSS with inconsistent small-screen state. Consumers wanting a hamburger at every width must set `expandOnBreakpoint={false}`; use `"lg"` (or another named breakpoint) for responsive collapsing. This also preserves Bootstrap's plain wrapping Navbar layout when `false` is selected.
- Preserve explicit Offcanvas visibility assignments across responsive changes until a subsequent toggle, dismissal, or changed `isShown` prop replaces them. An unchanged `isShown` value is not continuously reapplied. Clear toggler-opened state upon entering inline mode so a later downward resize does not briefly acquire an overlay scroll lock.
- Fixed nested Offcanvas panels with a different explicit breakpoint being forced into an undismissable overlay by the parent Navbar's responsive match. Invalid runtime breakpoint values now use the component's default mode consistently for state and CSS rather than throwing.
- Updated Navbar examples and playground options, and retained the Scrollspy showcase's plain-navbar wrapping layout.

## 1.0.12

- Changed all `Offcanvas` panels with `useBackdrop={false}` to ignore outside mousedown. They can still close through Escape (when enabled), a dismiss button, the navbar toggler, or the `isShown` prop. This fixes a navbar toggler's second click reopening the panel instead of closing it ([#24](https://github.com/WinkIntel/bootstrap-svelte/issues/24)). Consumers relying on click-away without a backdrop should enable `useBackdrop={true}` or provide their own outside-click handler.
- Fixed clearing `Offcanvas`'s `showOnBreakpoint` prop leaving the previous media query active. Clearing the breakpoint now restores ordinary offcanvas visibility and backdrop behavior, and a later breakpoint uses its own query ([#24](https://github.com/WinkIntel/bootstrap-svelte/issues/24)).
- Preserve explicit visibility changes made while a breakpoint is matched, synchronize body scroll locks when switching between inline and overlay modes, and retain the parent navbar's breakpoint when a nested offcanvas clears its own breakpoint. This also locks body scroll for overlays initially mounted with `isShown={true}`, even without an intro transition; `isBodyScrollable={true}` and responsive inline panels remain exempt.
- Added regression tests for navbar toggling without a backdrop, mixed-backdrop stacking, dismissal behavior, and clearing or replacing responsive breakpoints.

## 1.0.11

- Fixed `Modal` throwing "Maximum update depth exceeded" on Svelte 5.56.5 and newer, which left the modal unable to close from its buttons ([#22](https://github.com/WinkIntel/bootstrap-svelte/issues/22)). `Modal.Title` registration no longer reads the `titleId` state it writes; titles are tracked in an ordered, per-instance registry so the dialog stays labelled by the first mounted title, falls back to the next title when that one unmounts, and follows an id change without reordering.
- Added regression tests for the README quick start flow and for multi-title labelling lifecycles.
- Updated the development Svelte version to `5.57.0`; the `svelte` peer range is unchanged (`^5.29.0`).

## 1.0.10

- Added Markdown content negotiation to the showcase on Vercel without adding runtime functions: every page is prerendered as a `.md` sibling, and static Build Output routes serve it for `Accept: text/markdown` from the same URL (q-values, `q=0`, and wildcards honored; fractional q-values compared on their first decimal digit) with `Vary: Accept` and a `Link` alternate header, answer 406 when nothing the site serves is acceptable, and redirect trailing-slash URLs to their canonical path.
- Added `/llms.txt`, `/llms-full.txt`, `/agents.md`, `/sitemap.xml` (with git-based `lastmod` dates), and `/robots.txt`, plus a real 404 page whose Markdown or HTML body links back to the documentation index.
- Added About, Contact, and Privacy pages, a site footer, canonical and Open Graph/Twitter metadata with an OG image, and JSON-LD describing the site, the package, and Wink, Inc.
- Added SvelteKit integration and Sveltestrap comparison guides, plus explicit Svelte, HTML, JavaScript, CSS, SCSS, and Bash highlighting for documentation examples.
- The home page title now leads with the product name.

## 1.0.9

- Redesigned the showcase landing page and documentation chrome with a responsive navigation shell, install action, component index, live hero demo, and updated visual system.
- Updated the syntax highlighter with a language label and icon-based copy action.
- Scoped documentation table styling to API/reference sections so live component demos retain their stock Bootstrap appearance.
- Added visible focus treatment and reduced-motion safeguards for the new showcase interactions.
- Published as a documentation-only GitHub release; the npm package remained at `1.0.8`.

## 1.0.8

- Removed the Bootstrap JavaScript bundle from the showcase so the site exercises only this package's component behavior and Popper integration.
- Rebuilt the showcase color-mode dropdown with Bootstrap Svelte components and added regression guards against Bootstrap data-API markup returning to live routes.
- Added Dropdown dismissal with Escape from toggles, items, form controls, custom content, and portaled menus, with focus restoration and layered bubble-path isolation.
- Added Tab-out dismissal that follows `autoClose` rules, preserved consumer `onkeydown` handlers, and expanded keyboard behavior documentation and regression coverage.

## 1.0.7

- Updated Svelte, SvelteKit, Vite, Vitest, ESLint, Prettier, and related development dependencies.
- Updated `bezier-easing` and derived its easing-function type from the package's factory return type for compatibility with current typings.
- Reformatted Badge and Toast type unions for the updated formatter.

## 1.0.6

- **Breaking:** Specialized Form input components now accept only their matching `type` literal; mismatched types that were previously accepted but overridden no longer type-check.
- Hardened stateful components against malformed inputs, disabled interactions, interrupted transitions, dynamic registration, and stacked-overlay races.
- Corrected Form bindings, server-rendered accessibility relationships, Bootstrap class normalization, and shared CSS/scrollbar utility behavior.
- Improved Carousel, Dropdown, Modal, Navbar, Offcanvas, Pagination, Scrollspy, and Tooltip lifecycle and interaction handling.
- Consolidated weak tests and added focused regression coverage for the production issues fixed in this release.

## 1.0.5

- Fixed dynamic Modal title ID registration so `aria-labelledby` updates when the title ID changes and stale IDs are unregistered.
- Updated the Modal keyboard listener to Svelte's current event-handler syntax.
- Added `svelte-doctor` tooling and regression coverage for dynamic Modal title IDs.

## 1.0.4

- Improved `uniqueClsx` performance by flattening and deduplicating class inputs directly while preserving clsx-compatible numeric, nested-array, object-key, and ECMAScript-whitespace behavior.
- Hardened the Vitest Web Animations mock by clearing pending animation timers after each test and pinning events to the correct jsdom realm.
- Added regression coverage for numeric class inputs, whitespace-delimited object keys, ECMAScript whitespace, and nested class structures.

## 1.0.3

- Fixed stacked overlay body scroll restoration by refcounting Modal and Offcanvas scroll locks.
- Fixed slide and crossfade Carousel transitions so outgoing items no longer retain a stale `.active` class through the transition window.
- Hardened Dropdown and Tooltip DOM lookups for special-character and digit-leading element IDs.
- Cancelled Carousel transition/resume timers during disposal to avoid post-destroy autoplay work.
- Raised the Svelte peer dependency floor to `^5.29.0` to match the package's `svelte/attachments` usage.
- Expanded regression coverage for scroll locking, Carousel transitions/timers, Accordion behavior, Modal lifecycle/focus, Dropdown IDs, Tooltip IDs, and the Web Animations test mock.

## 1.0.2

- Deployed the docs/showcase site as static SvelteKit output on Vercel.
- Preserved no-op demo link behavior for placeholder and nav demo links.
- Kept package build/publish validation passing for `@winkintel/bootstrap-svelte`.

## 1.0.1

- Corrected `BreakpointListener` documentation examples to close with `</BreakpointListener>` instead of `</BreakpointMonitor>`.
- Recognized first-time community contributor [@munHunger](https://github.com/munHunger) for the documentation fix.

## 1.0.0

- Declared the public Bootstrap Svelte package as the first stable release.
- Published from the public GitHub repository with npm trusted publishing.
- Kept the validated Svelte 5 peer dependency and runtime dependency declarations from the public baseline.

## 0.0.3

- Added GitHub Actions release workflow for npm trusted publishing.
- Added release process documentation for dry runs and npm dist-tag selection.
- Prepared the public repository for tokenless npm publishing through GitHub Actions OIDC.

## 0.0.2

- Published the first usable public npm release under `@winkintel/bootstrap-svelte`.
- Licensed the package under Apache License 2.0.
- Declared runtime dependencies required by packaged output: `@popperjs/core`, `bezier-easing`, and `clsx`.
- Widened the Svelte peer dependency to `^5.0.0` so current Svelte 5 applications can install cleanly.
- Deprecated `0.0.1` because its Svelte peer dependency was too narrow.

## 0.0.1-private-preview

- Initial private GitHub preview prepared from the approved Bootstrap Svelte package source.
- Package renamed for public npm scope preparation: `@winkintel/bootstrap-svelte`.
- License was deferred until public release readiness.
