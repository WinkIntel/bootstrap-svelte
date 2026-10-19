# Contributing

Thanks for your interest in contributing to Bootstrap Svelte. This project is maintained by Wink, Inc. Breaking changes to public APIs ship in major releases; see [CHANGELOG.md](CHANGELOG.md) and [MIGRATION.md](MIGRATION.md).

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
node --test scripts/tests/release-*.test.mjs
pnpm test:coverage
pnpm build
npm pack --dry-run
```

`pnpm test:coverage` is the CI-equivalent full client/server test run with library
coverage enforcement. `pnpm test` remains a faster full-suite check without coverage.
The floor deliberately measures shipped `src/lib/**` code only; showcase/server
route tests still run, but their source is outside this library coverage denominator.
Tests and `tests/` fixtures are excluded. The text report is visible in CI logs;
`coverage/coverage-summary.json` is an ignored local artifact for comparing baseline
and proposed measurements, not a CI upload or a committed file.

### Coverage changes and toolchain updates

The measured baseline at `732c1d7` is 94.20% lines and 85.73% branches, with reviewed
floors of 94% and 85%. Svelte source-map coverage is approximate: changes to Svelte,
Vite, its Svelte plugin, Vitest or the coverage provider can change attribution.
If a toolchain update fails the floor, compare the full coverage reports on the
base and proposed revisions using the same Node version, frozen lockfiles and
unchanged include/exclude rules. Record versions, totals and affected files in the
PR; distinguish newly uncovered behavior from source-map/counting drift. Add tests
for genuine gaps. A justified floor adjustment requires explicit reviewer approval
in that PR, supporting before/after measurements, and an updated baseline comment.
Do not automatically lower floors, exclude affected production files, or accept a
new baseline merely because CI fails. Retain behavioral regression tests regardless
of any approved attribution adjustment.

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
