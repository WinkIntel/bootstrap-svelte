# Changelog

All notable changes to Bootstrap Svelte will be documented in this file.

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
