# Contributing

Thanks for your interest in contributing to Bootstrap Svelte. This project is maintained by Wink, Inc. and is in early pre-1.0 development, so public APIs may change as the package matures.

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

## License

By intentionally submitting a contribution, you agree that your contribution is provided under the Apache License 2.0, consistent with this repository's license.
