# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@winkintel/bootstrap-svelte` — a Bootstrap 5 component library for Svelte 5 (runes mode, TypeScript). One package holds two things:

- `src/lib/` — the component library, packaged to `dist/` via `svelte-package`
- `src/routes/` — a SvelteKit showcase/docs app (deployed to Vercel) that demos every public component

See also `AGENTS.md` (usage-level component examples) and `CONTRIBUTING.md`.

## Commands

Package manager is pnpm (`packageManager: pnpm@11.5.2`).

```bash
pnpm dev                  # showcase dev server on http://localhost:5176
pnpm build                # vite build (showcase) + prepack (svelte-package → dist/ + publint)
pnpm check-types          # svelte-kit sync + svelte-check
pnpm lint                 # prettier --check ./src + eslint ./src
pnpm format               # prettier --write on changed/untracked files only
pnpm test                 # vitest run --silent (alias: test:unit)
pnpm test:unit-watch      # vitest watch mode
npm pack --dry-run        # inspect what would be published
```

Run a single test file (drop `--silent` to see console output):

```bash
pnpm vitest run src/lib/Button/button.svelte.test.ts
pnpm vitest run src/lib/Dropdown            # everything under a directory
```

CI (`.github/workflows/ci.yml`) runs: lint → check-types → test → build → `npm pack --dry-run`. All must pass.

## Architecture

### Compound component pattern

Most components are namespaces of sub-components, built per-directory with a fixed file layout (see `src/lib/Dropdown/` as the reference example):

- `composition.ts` — exports sub-components as named exports (`Root`, `Toggle`, `Menu`, `Item`, ...) plus renamed prop types (`DropdownRootProps as RootProps`)
- `index.ts` — `export * as Dropdown from './composition.js'` (the namespace), and may also re-export pieces flat
- `types.ts` — prop type definitions for the component family
- `<name>.svelte`, `<name>-<part>.svelte` — the Root and sub-components
- `<name>.svelte.ts` — runes-based shared state/logic, when needed

Consumers write `<Dropdown.Root>`, `<Card.Header>`, etc. Standalone components (`Alert`, `Badge`, `Button`, `Spinner`) skip the namespace. `src/lib/index.ts` does `export * from` every component directory — new components must be added there. Intra-library imports use `.js` extensions (ESM style).

Parent↔child coordination uses the `Context` class in `src/lib/common/context.ts` (type-safe wrapper over Svelte context with symbol keys). `src/lib/common/` also holds shared CSS/class utilities, DOM helpers, and runes-based utilities (`*.svelte.ts`).

### Testing

The test filename suffix selects the Vitest project (`vitest.config.ts`):

- `*.svelte.test.ts` → "client" project: jsdom, globals enabled, `@testing-library/svelte`, setup in `vitest-setup-client.ts` (mocks `matchMedia` and the Web Animations API — jsdom lacks both)
- `*.test.ts` (non-svelte) → "server" project: plain node environment

Tests are colocated with components. Components that need a wrapper harness to test composition keep `.svelte` test fixtures in a `tests/` subdirectory (e.g. `src/lib/Dropdown/tests/`). `dist/` excludes test files at pack time, so colocating is safe.

### Build/packaging notes

- Runes mode is enforced globally (`compilerOptions.runes: true` in `svelte.config.js`); preprocessing uses `svelte-preprocess` with sass.
- The package ships only `dist/` and declares `svelte`/`types` exports; `svelte@~5.0.0` is a peer dependency. Bootstrap CSS is NOT bundled — consumers import it themselves.
- `publint` runs as part of `prepack`/`build` and will fail the build on packaging mistakes.

## Conventions and constraints

- Keep components generic: no app-specific assumptions, private URLs, or internal WinkIntel workflows (this repo is being prepared for public release; license is a placeholder — do not add publish steps).
- Add/update tests for behavior changes, and update the showcase in `src/routes` when public component APIs change.
- Formatting is Prettier-driven (4-space indent, single quotes); `pnpm lint` fails on unformatted code, so run `pnpm format` before finishing.
