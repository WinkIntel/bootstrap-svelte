# Contributing

This repository is currently private while WinkIntel prepares the package for public release.

## Local setup

```bash
pnpm install
pnpm dev
```

## Quality checks

Run these before opening a pull request:

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
npm pack --dry-run
```

## Component guidelines

- Keep components generic and reusable for Svelte 5 applications.
- Avoid app-specific assumptions, private URLs, customer data, or internal WinkIntel workflows.
- Keep Bootstrap behavior and accessibility expectations in mind.
- Add or update tests for behavior changes.
- Update the package-local showcase in `src/routes` for new or changed public components.
