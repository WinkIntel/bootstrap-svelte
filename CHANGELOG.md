# Changelog

All notable changes to Bootstrap Svelte will be documented in this file.

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
