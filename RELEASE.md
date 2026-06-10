# Release Process

This package is published to npm as `@winkintel/bootstrap-svelte`.

## Current release model

- Publish pre-1.0 validation releases with the `next` dist-tag by default.
- Promote to `latest` only when the release should be the default install target.
- Keep `package.json`, `pnpm-lock.yaml`, `CHANGELOG.md`, and public docs in sync before publishing.
- Use GitHub Actions trusted publishing once npm is configured for this repository/workflow.

## Trusted publishing setup

In npmjs.com, configure trusted publishing for `@winkintel/bootstrap-svelte`:

- Provider: GitHub Actions
- Organization/owner: `WinkIntel`
- Repository: `bootstrap-svelte`
- Workflow filename: `publish.yml`
- Allowed action: `npm publish`

The workflow file is `.github/workflows/publish.yml`.

Trusted publishing requires npm CLI `11.5.1` or newer and Node.js `22.14.0` or newer. The workflow uses Node.js 26 and the repository's pinned pnpm version.

## Prepare a release

1. Update `package.json` version.
2. Update `CHANGELOG.md`.
3. Run local verification:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm check-types
pnpm test
pnpm build
npm pack --dry-run
```

4. Commit and push through PR or directly to `main`, depending on release risk.
5. Wait for CI to pass on `main`.

## Publish from GitHub Actions

1. Open GitHub Actions for the repository.
2. Run the **Publish** workflow manually.
3. For a validation release, choose:

```text
tag: next
dry-run: true
```

4. If the dry run succeeds, run the same workflow again with:

```text
tag: next
dry-run: false
```

For a default public release, use `tag: latest`.

## Verify after publish

```bash
npm view @winkintel/bootstrap-svelte name version dist-tags license --json
npm install @winkintel/bootstrap-svelte
```

Also smoke-test a fresh Svelte/Vite consumer build before announcing a release.

## Manual fallback

If trusted publishing is unavailable, a maintainer with npm publish rights can publish manually:

```bash
npm publish --access public --tag next
```

Manual publish may require npm 2FA for each write operation.
