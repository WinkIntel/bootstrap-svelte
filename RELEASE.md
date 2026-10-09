# Release Process

This is the 1.x maintenance branch. Its stable release channel is `maintenance`;
2.x releases are prepared and published from `main`.

`@winkintel/bootstrap-svelte` uses the manually dispatched **Publish** workflow in
`.github/workflows/publish.yml`. Releases require a reviewed commit, passing CI,
and explicit owner approval of the version, source, channel, and release window.
A PR approval or merge alone does not authorize publication.

## Release channels and source

| npm dist-tag  | Package version                      | Allowed workflow ref                                 |
| ------------- | ------------------------------------ | ---------------------------------------------------- |
| `latest`      | Stable 2.x                           | `main` or the matching `v2.x.y` tag                  |
| `maintenance` | Stable 1.x                           | `codex/maintenance-1.x` or the matching `v1.x.y` tag |
| `next`        | 2.x prerelease, such as `2.2.0-rc.1` | `main` or its exact matching prerelease tag          |

Tag names must equal `v` followed by the full package version. The selected commit
must be in the corresponding approved branch's history and contain that branch's
release-policy introduction. Feature branches, wrong majors/channels, 1.x
prereleases, malformed versions, and build-metadata suffixes are rejected.
Create release tags only with separate approval; the workflow does not create them.
Do not reuse historical tags whose workflow predates these controls.

Use `latest` for a stable 2.x dry run and `maintenance` for a stable 1.x dry run.
`next` is reserved for prereleases, including when rehearsing. No channel cleanup
or promotion is performed by this workflow.

## One-time maintainer setup (separate authorization)

Complete and verify these settings before dispatching Publish. Merging the YAML
**does not configure** GitHub protection rules or npm publishing permissions.

1. Create the GitHub environment `npm-publish` before a workflow references it.
   Configure required reviewer(s), disallow administrator bypass, and choose the
   self-review policy deliberately. If the only reviewer also starts the run,
   preventing self-review blocks release. Select branch rules for `main` and
   `codex/maintenance-1.x`, and separate tag rules for `v1.*` and `v2.*`.
2. Protect both release branches with PR review and the required `build` check;
   prohibit force pushes/deletion. Restrict release-tag creation and changes to
   designated maintainers. CI runs on pushes to both branches and on PRs.
3. Inspect npm package **Settings → Trusted publishing** privately. The connection
   must name `WinkIntel`, `bootstrap-svelte`, `publish.yml`, and the exact environment
   `npm-publish`, with direct `npm publish` allowed. Review/remove broader legacy
   connections as part of the approved cutover; a connection that omits the
   environment can leave older workflows authorized. Dist-tag administration is
   not needed by this workflow.
4. Review npm package 2FA/token-access policy and GitHub's default workflow token
   permissions separately. The workflow needs no long-lived npm token and refuses
   `NODE_AUTH_TOKEN`/`NPM_TOKEN` fallback. Do not create credentials or bypass a
   failed trusted-publishing check to unblock a run.

npm currently requires replacing a trusted-publisher connection to change its
identity fields, and a new connection must complete its first successful publish
within two days. Coordinate replacement with an approved release window; do not
register early or publish solely to meet that deadline. Recheck the current
[npm trusted-publisher documentation](https://docs.npmjs.com/trusted-publishers/)
at cutover. The repository uses GitHub-hosted runners, Node 26 and the pnpm version
in `packageManager`; publishing checks for npm CLI 11.5.1 or newer.

## Prepare the release

1. Choose the release line, version, source commit and channel with the owner.
   For an actual package release, update `package.json`, `pnpm-lock.yaml` and
   `CHANGELOG.md` together through review. Workflow-only changes need no version bump.
2. Use Node 26, pnpm 11.5.2 (the pinned `packageManager`), and npm >= 11.5.1
   before running the checks below. Confirm with `node --version`, `pnpm --version`,
   and `npm --version`; the real-npm release test deliberately enforces the publishing
   toolchain requirement instead of silently skipping on older npm.
   Run all checks in the release worktree:

    ```bash
    pnpm install --frozen-lockfile
    node --test scripts/tests/release-*.test.mjs
    pnpm lint
    pnpm check-types
    pnpm test
    pnpm build
    npm pack --dry-run
    ```

    Also validate workflow YAML/expressions with `actionlint` when editing workflows.

3. Obtain owner merge approval, then verify the merged tree and successful CI on
   the exact commit. Apply and review maintenance workflow backports separately.
   Check effective environment and trusted-publisher settings before a release run.

## Rehearse without publishing

With explicit approval to dispatch, select the approved ref in **Actions → Publish**,
choose its matching channel and keep `dry-run: true` (the default). This branch
defaults to `maintenance`; explicitly confirm that channel when dispatching a 1.x ref.

The build job checks policy before installing dependencies, runs the full checks,
builds once, and packs with lifecycle scripts disabled. It records the version and
SHA256, then uploads one tarball with an artifact ID specific to this workflow run.
It has `contents: read` and no OIDC permission.

The rehearsal job waits for `npm-publish` environment approval on a fresh runner.
It downloads that exact artifact, checks its hash and package/ref/channel identity,
checks registry status, and, for an unpublished version (HTTP 404), runs
`npm publish ./artifact/release.tgz --dry-run --ignore-scripts` with explicit registry,
access and channel. For an already-published version (HTTP 200 with matching metadata),
it logs that artifact validation passed and skips the npm call: npm rejects publishing
an existing version even during a dry run. Artifact verification still runs in full.
Other registry responses fail closed. The job does not check out source, install
dependencies, run lifecycle scripts, or receive OIDC permission.

A rehearsal verifies packaging and the approval path. It **does not prove** npm's
OIDC authorization, published provenance, or a successful registry write. Local
unit tests simulate registry responses and npm invocation; only their designated
lifecycle test runs a real, offline npm dry run. They are not live release evidence.

## Publish the approved artifact

Only after separate live-release approval, dispatch the reviewed ref with the same
channel and `dry-run: false`. This is a new run: inspect and approve its exact source,
version, tarball SHA256 and artifact ID, rather than assuming an earlier rehearsal's
artifact was reused. Environment reviewers can inspect the build logs/artifact
before approval. Runs serialize across both release lines without cancelling a
running release. This is not a durable queue: with the current default concurrency
queue, GitHub retains at most one pending run and replaces it when another is queued.
A run waiting for environment approval can hold the package-wide lock and block both
release lines. Finish or explicitly cancel stale approval waits before dispatching
another run, and check the status of any queued run before relying on it. Do not queue
multiple releases or split the lock by channel; both lines publish the same package.

Only the protected publish job receives `id-token: write`. It downloads and verifies
this run's tarball using the same inline checks as rehearsal, then publishes that
file with `--ignore-scripts`; it never rebuilds or executes repository code. A version
already present on npm fails rather than being replaced or silently skipped. Failures
stop the release; do not switch to token credentials or another ref automatically.

## Verify and accept the release

After an authorized publication, confirm:

- The intended version and dist-tag are present, and the other release line's tag
  did not move.
- npm provenance identifies the expected repository/workflow/source commit, and
  the downloaded package's integrity agrees with the approved tarball.
- A clean Svelte/Vite consumer installs and builds from the published package.
- The deferred Modal README correction is present in the released tarball and npm
  documentation. This publication remains tracked in issue #82 until verified;
  a workflow merge or rehearsal does not complete that deferral.

Workflow hardening is an infrastructure rollout, not an npm or website feature
release. Before beginning another issue, obtain the owner's explicit acceptance
of the agreed infrastructure gate, or complete the separately approved package
release if that is the chosen gate. Record remaining live OIDC/provenance checks
as pending; never treat a successful dry run as end-to-end publication verification.
