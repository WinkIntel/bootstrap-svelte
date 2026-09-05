# Changelog

All notable changes to Bootstrap Svelte will be documented in this file.

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
