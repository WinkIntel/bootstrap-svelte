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
node --test scripts/tests/form-package.test.mjs
pnpm test:svelte-consumer
```

### Packed form compatibility

The packed consumer checks the unchanged Svelte `^5.29.0` minimum with
`skipLibCheck: false`, verifies accepted props and bindings, rejects unsupported
bindings, and compiles every packaged component for client and server. A second
consumer builds with the frozen development toolchain. These are separate checks:
the current development Vite plugin requires newer Svelte than the 1.x peer floor.
Neither the library peer range nor its dependencies are raised by this check.
The repository type check also verifies the real SvelteKit `enhance` action without
shipping a SvelteKit-only type import in the library.

Type import aliases are compiler-error exceptions, not a naming convention.
The existing root-component namespace aliases avoid reproduced TypeScript
`TS2440` conflicts in generated declarations. Keep original names elsewhere
unless the strict consumer demonstrates a conflict.

Five large DOM-prop unions also reproduce `TS2590` when used directly with
Svelte's `Component` type. The guarded prepack step prepares only Button,
Dropdown.Toggle, Form.CheckLabel, Form.InputGroupText and ListGroup.Root with a
private structural component type. Original props, bindable keys, instance
methods and static metadata are preserved by type contracts and packed-consumer
checks. Unexpected emitter signatures fail before any declaration is rewritten.
Do not broaden the preparation map or weaken types to accept a changed emitter.

## Dependency updates

See [Update dependencies to latest minor versions](docs/npm/update-all-dependencies-to-latest-minor-versions.md) for the update policy, validation, and separate PR workflows for `main` (2.x) and `codex/maintenance-1.x` (1.x).

## Component guidelines

- Keep components generic and reusable for Svelte 5 applications.
- Avoid app-specific assumptions, private URLs, customer data, or internal WinkIntel workflows.
- Keep Bootstrap behavior and accessibility expectations in mind.
- Add or update tests for behavior changes.
- Update the package-local showcase in `src/routes` for new or changed public components.

## License

By intentionally submitting a contribution, you agree that your contribution is provided under the Apache License 2.0, consistent with this repository's license.
