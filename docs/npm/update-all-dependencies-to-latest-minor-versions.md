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
3. Ensure `ncu` is available (`ncu --version`). Use a reviewed **19.4.0 or newer 19.x/20.x** release of [npm-check-updates](https://github.com/raineorshine/npm-check-updates), installed globally (`npm install --global npm-check-updates@<reviewed-version>`); it is not a declared devDependency. Numeric cooldown support began in 18.2.0, but this repo's `1d`/`0d` strings require [19.4.0](https://github.com/raineorshine/npm-check-updates/releases/tag/v19.4.0). Before adopting 21+, migrate `.ncurc.js` to `.ncurc.cjs` (and update documentation links) or ESM: [21.0.0 changed config loading](https://github.com/raineorshine/npm-check-updates/releases/tag/v21.0.0), and this repo uses CommonJS config in a `"type": "module"` package.
4. Install from the lockfile, then run the baseline checks once in Phase 1. If anything fails, stop and resolve the baseline failure on the selected target first:
    ```bash
    pnpm install --frozen-lockfile
    ```

---

## Phase 1: Capture a baseline

Run from the repository root. This replaces only the scratch directory `test-results/deps/` (gitignored); copy any baseline you want to retain elsewhere before restarting Phase 1. Do not rerun Phase 1 after updating dependencies: use Phase 4 so the original baseline survives.

The Bash subprocess stops on failed checks or failed pipeline commands without changing the interactive shell's options. Full logs remain available, including failures. Review the audit output and recorded exit status before proceeding; advisories need triage, while registry/network failures mean the audit is incomplete.

```bash
bash -euo pipefail <<'EOF'
rm -rf test-results/deps
mkdir -p test-results/deps
pnpm lint 2>&1 | tee test-results/deps/before-lint.txt
pnpm check-types 2>&1 | tee test-results/deps/before-check-types.txt
pnpm test 2>&1 | tee test-results/deps/before-tests.txt
pnpm build 2>&1 | tee test-results/deps/before-build-log.txt
cp -R dist test-results/deps/before-dist
(cd build && find . -type f | sort) > test-results/deps/before-site-files.txt
cp build/llms.txt test-results/deps/before-llms.txt
cp build/sitemap.xml test-results/deps/before-sitemap.xml
# pnpm build already ran prepack (svelte-package and publint).
npm pack --dry-run --ignore-scripts --json > test-results/deps/before-pack.json
node -e 'const fs = require("node:fs"); const pack = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); console.log(pack[0].files.map(file => file.path).sort().join("\n"));' test-results/deps/before-pack.json > test-results/deps/before-pack-files.txt
# Audit may exit nonzero for advisories or an operational failure; retain both.
audit_status=0
pnpm audit --prod > test-results/deps/before-audit.txt 2>&1 || audit_status=$?
printf '%s\n' "$audit_status" > test-results/deps/before-audit-status.txt
cat test-results/deps/before-audit.txt
EOF
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

Review `packageManager` immediately: ncu 17+ includes it in the default update set, while CI separately pins pnpm in `.github/workflows/ci.yml`. Restore an unintended pnpm bump before reinstalling, or intentionally update CI's `corepack prepare` version to match and validate with that pnpm version. ncu does not update the package's own `version`, and its default dependency sections exclude `peerDependencies`; the Svelte peer floor remains a separate compatibility decision.

During install, watch for:

- **Ignored build scripts.** A new transitive dependency that wants an install script gets reported by pnpm. Only add it to `allowBuilds` after confirming the script is needed and legitimate.
- **Peer dependency warnings.** Resolve them; don't ignore them.
- **Engine errors.** These come from `engine-strict`.

Then tidy the lockfile:

```bash
pnpm dedupe
```

Run Phase 4 to capture and validate the updated tree before committing. If Prettier's formatting output changed, run `pnpm format-all` and commit the reformat **separately**, so the dependency diff stays readable.

```bash
git add package.json pnpm-lock.yaml && git commit -m "chore(deps): update dev dependencies to latest minor"
```

**If a step fails:** find the responsible package (changelog, stack trace). Then either fix the code in its own commit, or revert that package's entry in `package.json` to the previous range, run `pnpm install`, and note it in the PR as deferred. Don't use `--force` or overrides to hide the failure.

---

## Phase 4: Compare against the baseline

Capture the updated tree explicitly. This replaces only `after-dist` when repeated, preserves all `before-` artifacts, and runs the updated quality checks once. As in Phase 1, review the audit output/status and resolve any operational failure before comparing.

```bash
bash -euo pipefail <<'EOF'
test -d test-results/deps/before-dist
rm -rf test-results/deps/after-dist
pnpm lint 2>&1 | tee test-results/deps/after-lint.txt
pnpm check-types 2>&1 | tee test-results/deps/after-check-types.txt
pnpm test 2>&1 | tee test-results/deps/after-tests.txt
pnpm build 2>&1 | tee test-results/deps/after-build-log.txt
cp -R dist test-results/deps/after-dist
(cd build && find . -type f | sort) > test-results/deps/after-site-files.txt
cp build/llms.txt test-results/deps/after-llms.txt
cp build/sitemap.xml test-results/deps/after-sitemap.xml
# pnpm build already ran prepack (svelte-package and publint).
npm pack --dry-run --ignore-scripts --json > test-results/deps/after-pack.json
node -e 'const fs = require("node:fs"); const pack = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); console.log(pack[0].files.map(file => file.path).sort().join("\n"));' test-results/deps/after-pack.json > test-results/deps/after-pack-files.txt
# Audit may exit nonzero for advisories or an operational failure; retain both.
audit_status=0
pnpm audit --prod > test-results/deps/after-audit.txt 2>&1 || audit_status=$?
printf '%s\n' "$audit_status" > test-results/deps/after-audit-status.txt
cat test-results/deps/after-audit.txt
EOF
```

Compare every captured check and artifact below. Run these comparisons individually: `diff` returns 1 for differences, which need review rather than an automatic failure. Timing, audit totals, and test durations may vary.

```bash
diff -ru test-results/deps/before-dist test-results/deps/after-dist
diff test-results/deps/before-lint.txt test-results/deps/after-lint.txt
diff test-results/deps/before-check-types.txt test-results/deps/after-check-types.txt
diff test-results/deps/before-tests.txt test-results/deps/after-tests.txt
diff test-results/deps/before-build-log.txt test-results/deps/after-build-log.txt
diff test-results/deps/before-site-files.txt test-results/deps/after-site-files.txt
diff test-results/deps/before-llms.txt test-results/deps/after-llms.txt
diff test-results/deps/before-pack-files.txt test-results/deps/after-pack-files.txt
diff test-results/deps/before-audit.txt test-results/deps/after-audit.txt
diff test-results/deps/before-audit-status.txt test-results/deps/after-audit-status.txt
diff test-results/deps/before-sitemap.xml test-results/deps/after-sitemap.xml
```

What to look for:

- **`dist/` diffs.** Compiler output churn is normal after a Svelte bump. Changes to public `.d.ts` signatures are not. Investigate those, since they can break consumers' type checking.
- **Pack contents.** Compare the sorted file paths, which should be unchanged. Raw pack JSON is retained for inspection; sizes, shasum, and integrity can change with emitted output. `publint` has already run inside `pnpm build`.
- **Sitemap.** A dependency-only update should leave the sitemap unchanged when Git history for the page sources is available. Investigate any differences: page-source changes or the build-date fallback when history is unavailable can alter `lastmod`.
- **New warnings.** Svelte compiler, `svelte-check`, and Vite deprecation warnings. Fix them now or record them as follow-ups.
- **Audit.** `pnpm audit --prod` should report the same or fewer advisories.

### Showcase smoke test

```bash
pnpm preview           # http://localhost:4176
```

Click through pages that exercise interactive and positioned components: Dropdown and Tooltip/Popover (Popper), Modal, Offcanvas, Carousel (slide transitions using `bezier-easing`), Collapse (transitions), and the Theming page (Sass). Check the browser console for errors. Then confirm the prerendered text and Markdown files are served (local preview does not test Vercel content negotiation):

```bash
curl -s http://localhost:4176/llms.txt | head
curl -s http://localhost:4176/index.md | head    # or any page path + .md
```

Optionally, confirm the Vercel route patching still applies. See [CLAUDE.md](../../CLAUDE.md) under "Showcase agent surface".

```bash
VERCEL=1 pnpm build:site && jq '.routes | length' .vercel/output/config.json
```

### Peer floor compatibility

Do not test the `^5.29.0` consumer floor by downgrading Svelte inside this repository: the installed `@sveltejs/vite-plugin-svelte` 7.2 toolchain requires Svelte `^5.46.4`. Repository checks validate the supported development toolchain, not the minimum consumer version. If minimum-version validation is needed, use a separate consumer fixture with Svelte 5.29.0 and compatible build tooling to compile and exercise the packaged library. That separate compatibility check is outside this dependency-sweep procedure; do not infer peer-floor support from the repository test results.

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
