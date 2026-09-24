# Update Dependencies to Latest Minor Versions

This guide applies independently to `main` (2.x) and `codex/maintenance-1.x` (1.x). Run the update and validation on each target branch and open a separate PR for each; keep the maintenance package version on 1.x. Do not copy the 2.x manifest or lockfile over the maintenance branch.

## Context

`@winkintel/bootstrap-svelte` is a single package (no workspaces) with two surfaces that updates can break:

- **The published library** (`src/lib/` → `dist/` via `svelte-package`). Changes to `dependencies` (`@popperjs/core`, `bezier-easing`, `clsx`) reach consumers directly. Changes to tooling (`svelte`, `@sveltejs/package`, `typescript`) can change the emitted `.js`/`.d.ts` files without failing any check.
- **The prerendered showcase** (`src/routes/`), including the agent surface (`llms.txt`, `*.md` pages, `sitemap.xml`, Vercel route patches).

This procedure moves every dependency to its latest **minor/patch** version. Major upgrades are separate, one-package-at-a-time changes with their own PR.

There is no E2E suite. Regressions show up through the CI chain, a before/after diff of the build output, and a manual smoke test of the showcase.

---

## Update policy (already configured)

| Setting              | Where                                                                     | Effect                                                                                                                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--target minor`     | `ncu:check` / `ncu:upgrade` scripts in [package.json](../../package.json) | No major bumps                                                                                                                                                                                                                                                                                               |
| `cooldown: '1d'`     | [.ncurc.js](../../.ncurc.js)                                              | Ignores versions published less than 24h ago (limits exposure to compromised or quickly-yanked releases)                                                                                                                                                                                                     |
| Svelte fast-track    | second `ncu` pass with `--cooldown 0d --filter …`                         | `svelte`, `@sveltejs/kit`, `@sveltejs/adapter-static`, `@sveltejs/vite-plugin-svelte`, `svelte-check`, `svelte-preprocess` skip the cooldown                                                                                                                                                                 |
| `reject: ['sass']`   | [.ncurc.js](../../.ncurc.js)                                              | `sass` stays pinned at `1.77.6`. Later Dart Sass releases deprecate `@import` and global built-in functions, which Bootstrap 5's Sass source relies on, and flood the build with deprecation warnings. Don't bump it in a minor sweep; revisit only when Bootstrap moves to the Sass module system (`@use`). |
| `~` ranges           | [package.json](../../package.json)                                        | ncu rewrites the range floor; the lockfile records the exact version                                                                                                                                                                                                                                         |
| `engine-strict=true` | [.npmrc](../../.npmrc)                                                    | Install fails if a new version's `engines` excludes the local Node                                                                                                                                                                                                                                           |
| `allowBuilds`        | [pnpm-workspace.yaml](../../pnpm-workspace.yaml)                          | Only `esbuild` and `svelte-preprocess` may run install scripts. pnpm blocks lifecycle scripts from any other package.                                                                                                                                                                                        |

Two notes:

- `@types/node` uses `^`, not `~`. Review its major separately against the Node version CI runs; the current types major may differ from CI (`node-version` in [.github/workflows/ci.yml](../../.github/workflows/ci.yml)).
- The `svelte` **peer** range (`^5.29.0`) is independent of the `svelte` devDependency. Bumping the devDependency must not raise the peer floor unless the library starts using a newer Svelte API. If it does, raising the floor is a breaking change for consumers and needs a CHANGELOG entry.

---

## Phase 0: Preparation

1. Start with a clean working tree and fetch the target branches:
    ```bash
    git status --short
    git fetch origin
    ```
    Choose **one** target per run:
    ```bash
    # 2.x: PR base is main
    git switch -c codex/deps-minor-main-$(date +%Y-%m-%d) origin/main
    ```
    ```bash
    # 1.x: PR base is codex/maintenance-1.x
    git switch -c codex/deps-minor-1.x-$(date +%Y-%m-%d) origin/codex/maintenance-1.x
    ```
    Use a unique suffix if that update branch already exists. Finish or save the first branch's work before switching to the other target.
2. Confirm the local toolchain matches CI (Node 26, pnpm from `packageManager`):
    ```bash
    node --version && pnpm --version
    ```
3. Ensure `ncu` is available (`ncu --version`). The repository scripts require [npm-check-updates](https://github.com/raineorshine/npm-check-updates), but it is not a declared devDependency. Install a reviewed version globally if needed (`npm install --global npm-check-updates@<reviewed-version>`).
4. Install from the lockfile and confirm a green baseline. If anything fails, stop and resolve the baseline failure on the selected target first:
    ```bash
    pnpm install --frozen-lockfile
    pnpm lint && pnpm check-types && pnpm test && pnpm build && npm pack --dry-run
    ```

---

## Phase 1: Capture a baseline

Save artifacts in `test-results/` (gitignored) so you can compare them after the update.

```bash
set -o pipefail                            # bash/zsh: preserve command failures through pipes
mkdir -p test-results/deps
pnpm check-types 2>&1 | tail -n 5          > test-results/deps/before-check-types.txt
pnpm vitest run 2>&1 | tail -n 15          > test-results/deps/before-tests.txt
pnpm build > test-results/deps/before-build-log.txt 2>&1
cp -R dist                                   test-results/deps/before-dist
(cd build && find . -type f | sort)        > test-results/deps/before-site-files.txt
cp build/llms.txt build/sitemap.xml          test-results/deps/
npm pack --dry-run > test-results/deps/before-pack.txt 2>&1
pnpm audit --prod > test-results/deps/before-audit.txt 2>&1
# A nonzero audit exit needs review; distinguish advisories from network failures.
```

---

## Phase 2: Audit available updates (dry run)

```bash
pnpm ncu:check
pnpm outdated          # includes majors, useful for noting what is intentionally skipped
```

For each proposed bump, read the release notes or CHANGELOG between the current and target versions. Pay extra attention to these packages:

| Package(s)                                      | Why                                                                                                                          |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `@popperjs/core`, `bezier-easing`, `clsx`       | Runtime `dependencies` that ship to consumers                                                                                |
| `svelte`, `@sveltejs/*`, `svelte-check`         | Svelte minors have changed reactivity semantics before (e.g. the Modal update-depth fix in #23) and change compiler warnings |
| `vite`, `vitest`, `jsdom`, `@testing-library/*` | Test environment behavior. jsdom gaps are patched in `vitest-setup-client.ts`.                                               |
| `typescript`, `typescript-eslint`, `eslint*`    | New diagnostics and lint rules                                                                                               |
| `prettier`, `prettier-plugin-svelte`            | Formatting changes can fail `pnpm lint` across many files                                                                    |

Record anything that needs a follow-up (majors skipped, deprecations announced) for the PR description.

---

## Phase 3: Apply updates

This is a single package, so apply updates in two groups. Separate commits keep consumer-facing changes easy to review and easy to revert.

### 3.1 Runtime dependencies (consumer-facing)

```bash
pnpm exec ncu --target minor --dep prod -u --filter "@popperjs/core,bezier-easing,clsx"
pnpm install
pnpm lint && pnpm check-types && pnpm test && pnpm build
git add package.json pnpm-lock.yaml && git commit -m "chore(deps): update runtime dependencies to latest minor"
```

Skip this commit if nothing changed.

### 3.2 Dev tooling

```bash
pnpm ncu:upgrade       # both ncu passes, then pnpm install
git diff -- package.json pnpm-lock.yaml
```

Review the manifest immediately: preserve the selected branch's package version and restore the original `svelte` peer range if ncu raised it unintentionally, then run `pnpm install` again.

During install, watch for:

- **Ignored build scripts.** A new transitive dependency that wants an install script gets reported by pnpm. Only add it to `allowBuilds` after confirming the script is needed and legitimate.
- **Peer dependency warnings.** Resolve them; don't ignore them.
- **Engine errors.** These come from `engine-strict`.

Then tidy the lockfile and verify:

```bash
pnpm dedupe
pnpm lint && pnpm check-types && pnpm test && pnpm build && npm pack --dry-run
```

If Prettier's formatting output changed, run `pnpm format-all` and commit the reformat **separately**, so the dependency diff stays readable.

```bash
git add package.json pnpm-lock.yaml && git commit -m "chore(deps): update dev dependencies to latest minor"
```

**If a step fails:** find the responsible package (changelog, stack trace). Then either fix the code in its own commit, or revert that package's entry in `package.json` to the previous range, run `pnpm install`, and note it in the PR as deferred. Don't use `--force` or overrides to hide the failure.

---

## Phase 4: Compare against the baseline

Re-run the Phase 1 commands with `after-` names. Preserve the original `before-dist` directory and baseline `llms.txt` and `sitemap.xml` files; copy the new versions under different names. Then diff:

```bash
diff -ru test-results/deps/before-dist dist                   # emitted library code and .d.ts
diff test-results/deps/before-site-files.txt <(cd build && find . -type f | sort)
diff test-results/deps/llms.txt build/llms.txt
diff test-results/deps/sitemap.xml build/sitemap.xml          # only lastmod noise is expected
diff test-results/deps/before-pack.txt test-results/deps/after-pack.txt
diff test-results/deps/before-build-log.txt test-results/deps/after-build-log.txt   # new compiler/a11y warnings
```

What to look for:

- **`dist/` diffs.** Compiler output churn is normal after a Svelte bump. Changes to public `.d.ts` signatures are not. Investigate those, since they can break consumers' type checking.
- **Pack contents.** The file list should be identical apart from content hashes. `publint` has already run inside `pnpm build`.
- **New warnings.** Svelte compiler, `svelte-check`, and Vite deprecation warnings. Fix them now or record them as follow-ups.
- **Audit.** `pnpm audit --prod` should report the same or fewer advisories.

### Showcase smoke test

```bash
pnpm preview           # http://localhost:4176
```

Click through pages that exercise interactive and positioned components: Dropdown and Tooltip/Popover (Popper), Modal, Offcanvas, Collapse (transitions and `bezier-easing`), and the Theming page (Sass). Check the browser console for errors. Then confirm the prerendered text and Markdown files are served (local preview does not test Vercel content negotiation):

```bash
curl -s http://localhost:4176/llms.txt | head
curl -s http://localhost:4176/index.md | head    # or any page path + .md
```

Optionally, confirm the Vercel route patching still applies. See [CLAUDE.md](../../CLAUDE.md) under "Showcase agent surface".

```bash
VERCEL=1 pnpm build:site && jq '.routes | length' .vercel/output/config.json
```

### Optional: peer floor check

To confirm the library still works at its declared minimum Svelte version:

```bash
# First commit the intended dependency updates so HEAD contains them.
git status --short       # must be clean before this temporary experiment
pnpm add -D svelte@5.29.0
pnpm check-types && pnpm test
# Run cleanup even if installation or checks failed; restore the update commit.
git restore --source=HEAD -- package.json pnpm-lock.yaml
pnpm install --frozen-lockfile
```

---

## Phase 5: Open the PR

- Push the update branch and open a PR against its original base: `main` for 2.x or `codex/maintenance-1.x` for 1.x. Repeat this procedure independently for the other release line.
- Title: `chore(deps): update dependencies to latest minor versions` (include the release line).
- Body:
    - A table of notable bumps (runtime dependencies first).
    - Any package held back and why.
    - Majors available but intentionally skipped.
    - Anything unexpected from the Phase 4 comparison.
- CI must pass: lint → check-types → test → build → `npm pack --dry-run`.
- If runtime `dependencies` or the `svelte` peer range changed, add a CHANGELOG entry. Updates to dev tooling alone don't need a release.

---

## Rollback

| Scope              | Command                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| One package        | Restore its previous range in `package.json`, then `pnpm install`                 |
| Uncommitted update | `git checkout -- package.json pnpm-lock.yaml && pnpm install --frozen-lockfile`   |
| A committed group  | `git revert <commit>` (runtime and dev commits are separate for this reason)      |
| Whole branch       | Switch away and delete the unmerged update branch; its target branch is untouched |

## Risks

| Risk                                                   | Mitigation                                                                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Svelte minor changes reactivity or transition behavior | Unit tests plus the showcase smoke test on Modal, Offcanvas, and Collapse                                                  |
| Public types change silently                           | `dist/` `.d.ts` diff in Phase 4                                                                                            |
| Runtime dependency regression reaches consumers        | Isolated commit, changelog review, CHANGELOG entry                                                                         |
| Compromised or broken fresh release                    | 1-day ncu cooldown, `allowBuilds` allowlist, `pnpm audit`. Svelte packages skip the cooldown, so read their release notes. |
| Prettier/ESLint bump fails `pnpm lint` everywhere      | Separate reformat commit                                                                                                   |
| Sass/Bootstrap deprecation noise                       | `sass` stays pinned via `.ncurc.js`                                                                                        |

## Verification checklist

- [ ] `pnpm install --frozen-lockfile` succeeds on a clean checkout of the branch
- [ ] `pnpm lint`, `pnpm check-types`, `pnpm test`, `pnpm build`, and `npm pack --dry-run` all pass
- [ ] No new `svelte-check` errors, and no new compiler warnings (or they are documented)
- [ ] No unexpected public `.d.ts` changes in `dist/`
- [ ] Pack file list unchanged
- [ ] Showcase smoke test clean (no console errors; Markdown and `llms.txt` served)
- [ ] `pnpm audit --prod` no worse than the baseline
- [ ] `sass` is still `1.77.6`, and the `svelte` peer range is unchanged (or the change is intentional and in the CHANGELOG)
