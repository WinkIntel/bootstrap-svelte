# Release Process

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
Once separately configured, an approved live publication also creates its matching
source-pinned tag and GitHub release page after verification. Advance/manual tags
still need separate approval.
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
   On `main`, `build` is an always-run aggregate of development and exact-minimum
   Svelte validation; it fails if either prerequisite fails, is cancelled or is
   skipped. Maintenance retains its existing single `build` job.
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

## Check release App authentication without repository writes

After separate approval to merge and dispatch the check, use **Actions → Release
App authentication check → Run workflow**, selecting `main`, then approve its
`npm-publish` environment job. A draft PR or green CI does not authorize dispatch.
The job does not run on PRs, pushes, schedules or maintenance refs. It uses the
existing protected environment without changing its reviewers or rules.

The check pins App **5307158**, client ID `Iv23liEMzHfBJoQL5i2e`, installation
**171145974** and repository `WinkIntel/bootstrap-svelte` (ID **1263210535**).
Replacing the App or installation requires updating these diagnostic pins through
review. These pins are enforced only by this diagnostic: Publish and the
release-page writer check configuration presence, not this identity set, and do
not require a successful diagnostic run before writing. This check is not a
production authorization gate. It uses the same pinned official
token action and environment configuration as the release-page writer. It requests
only Contents write and Workflows write for this repository, with implicit Metadata
read. GitHub [does not grant token permissions the App lacks](https://docs.github.com/en/rest/apps/apps#create-an-installation-access-token-for-an-app),
so successful token creation tests authentication and acceptance of those requested
grants; successful GET requests alone would not prove write grants.

The helper requires the App to declare exactly Contents write, Workflows write
and Metadata read; additional declared permissions fail the check.
It makes only three GET requests: App identity/declared permissions, the
installation token's accessible repositories (exactly this repository), and the
Publish workflow file at the selected commit. It logs a fixed summary, never the
private key, token, headers or raw API responses. No dependencies are installed and
no npm or release writer runs. The only authentication lifecycle writes are token
creation and its normal post-job revocation; no repository content, tag, release,
installation setting or npm state is changed.

Accept the check only after its checks pass **and the token action's post-job log
confirms `Token revoked`**. The pinned action warns rather than fails if revocation
fails; a green job alone is insufficient evidence of cleanup. Do not paste tokens
or private keys into logs, PRs or chat to diagnose a failure.

This check does not prove release-tag ruleset bypass, tag/release creation, npm
trusted publishing or provenance, installation-wide access outside the narrowed
token, or release-page completion. Those still need inspection or an explicitly
authorized live release. An ordinary Publish dry run continues to skip the App.
The check is available on main for the shared App/environment used by both release
lines; maintenance needs no copy to run this main-only diagnostic.

## Check the reusable release configuration

After separate dispatch approval, select **Publish → Run workflow**, choose `main`
or `codex/maintenance-1.x`, and enable **configuration-check**. Approve the
`npm-publish` job when GitHub requests it. This default-off mode takes precedence
over **dry-run**, even if dry-run is false; channel selection does not cause a
publication in this mode. An unprivileged callee guard rejects unsupported
repositories or refs with a failure before requesting environment approval. Its
shell comparison is case-sensitive, including rejection of `MAIN` and other case
variants; the environment's deployment-branch policy remains an additional gate.

The check follows Publish's existing reusable release-page call with its required
named App-key contract. The same protected writer job runs only its configuration preflight,
which receives presence booleans for the client ID and private key and prints a
fixed success or failure message. It skips the build, artifact verification,
rehearsal, npm publication, checkout/setup in the writer, token minting and every
tag/release write. No token is created, so no token cleanup is needed.

A pass establishes effective configuration availability inside the called protected
job. The environment supplies its secret value; a pass does not establish the
origin or value of the caller expression. The required named-secret contract is
still checked structurally, and omitting it is not equivalent to passing an empty
expression. See [GitHub's environment-secret rules](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows#using-inputs-and-secrets-in-a-reusable-workflow).
It does not establish key validity, App authentication, permissions, provenance,
or write access. Ordinary dry runs skip the reusable call, and standalone
recovery/App authentication checks enter directly; those cannot prove this path.
With configuration-check left false, existing rehearsal, live publication and
standalone recovery behavior is retained. Preparing or merging this mode does not
authorize dispatch.

Configuration checks use separate concurrency groups at both the Publish and
reusable release-page levels, so approval waits cannot block or replace queued
publications or recovery runs. The two diagnostic groups are distinct to avoid a
nested-call lock conflict. Multiple diagnostic requests can still replace an older
pending diagnostic; inspect each requested run's result.

## Prepare the release

1. Choose the release line, version, source commit and channel with the owner.
   For an actual package release, update `package.json` and `CHANGELOG.md` together
   through review. Update `pnpm-lock.yaml` only when dependency specifications,
   resolutions, or lockfile metadata need to change; this lockfile has no root
   package-version field, so a version-only bump needs no lockfile edit. Verify
   consistency with `pnpm install --frozen-lockfile` rather than making a no-op edit.
   Workflow-only changes need no version bump.

    Keep a preparation PR in draft with an `Unreleased` heading until the owner
    agrees the release window. Before merge, replace that version's `Unreleased`
    heading with the agreed release date (`YYYY-MM-DD`) in the same PR, review the
    final diff, and verify CI on its final head. If the window moves, update the date
    before proceeding. The build guard and release-page verifier share the same dated exact-version
    changelog validation. Both dry runs and live runs fail before publication when
    the section is missing, invalid, duplicated, empty or still `Unreleased`.

2. Use Node 26, pnpm 11.5.2 (the pinned `packageManager`), and npm >= 11.5.1
   before running the checks below. Confirm with `node --version`, `pnpm --version`,
   and `npm --version`; the real-npm release test runs the workflow's version guard
   and fails on npm < 11.5.1.
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

3. Obtain owner merge approval for the agreed release window, then verify the
   merged tree and successful CI on the exact commit. Do not merge a version bump
   ahead of that window: the website auto-deploys from `main`, and its About page,
   generated agent documentation, structured metadata, and footer use the working
   tree's package version, including wording that calls it published. A merge can
   therefore advertise the new version before npm has it. Keep the merge, merged
   CI, rehearsal, separate live-release approval, and publication coordinated in
   the same window; a short mismatch may still occur. If any gate fails or the
   window lapses, stop and notify the owner to agree corrective website/version
   handling rather than leaving the mismatch open-ended or publishing without
   approval. Maintenance does not deploy the website, but still needs its own
   agreed release window and dated changelog.

    Apply and review maintenance workflow backports separately. Check effective
    environment and trusted-publisher settings before a release run. Record the
    exact merged commit selected for rehearsal and publication. Any separately
    authorized release tag must point to that final approved commit, including the
    dated changelog, rather than an earlier preparation commit.

## Rehearse without publishing

With explicit approval to dispatch, select the approved ref in **Actions → Publish**,
choose its matching channel and keep `dry-run: true` (the default).

The build job checks policy before installing dependencies, runs the full checks,
builds once, and packs with lifecycle scripts disabled. It records the version and
SHA256, then uploads one tarball with an artifact ID specific to this workflow run.
It has `contents: read` and no OIDC permission.

The rehearsal job waits for `npm-publish` environment approval on a fresh runner.
It downloads that exact artifact, checks its hash and package/ref/channel identity,
checks registry status, and, for an unpublished version (HTTP 404), runs
`npm publish ./artifact/release.tgz --dry-run --ignore-scripts` with explicit registry,
access and channel. For an already-published version (HTTP 200 with matching metadata),
it emits a workflow warning and skips the npm call: npm rejects publishing an existing
version even during a dry run. Current-run artifact verification still runs in full;
it does not compare the tarball with the published npm tarball. A green rehearsal of
an existing version cannot be followed by a live publish of that version. Select and
review a new version, then rehearse that release before requesting live approval.
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

## Automatic GitHub release pages

After a successful live `Publish approved tarball` job, Publish calls
`.github/workflows/release-page.yml`. Dry runs never call it. A read-only job
verifies the original run, separate build and publish attempts, successful build
and live publish jobs, approved branch history,
source package version, original unexpired artifact, and byte-for-byte equality
with the npm tarball. `npm audit signatures --json --include-attestations` verifies
cryptographic provenance; the verifier then checks its source commit, workflow,
ref, successful publish run/attempt and artifact digest. The artifact comes from
the successful build attempt, which can precede a rerun of the publish job. Each
attempt must identify the same source. Saved job outputs retain both attempts when
only page jobs are rerun. Registry propagation retries are bounded, including
429/5xx responses and timeouts; authorization and malformed-data errors fail closed. Verification installs only in a temporary directory with lifecycle scripts
disabled and peer packages omitted; it does not execute the published package.
Signature failures in the remaining installed dependency tree still fail closed;
minimizing that tree does not bypass npm verification failures.

The write job uses the existing `npm-publish` environment and a short-lived,
repository-scoped GitHub App token. **This separate job may require a second
explicit environment approval after npm publication.** Until that approval and
successful completion, npm may be published while its GitHub page is still pending.
The job has no npm publishing step or OIDC permission. Its helper code comes from
the reviewed workflow commit; release identity and notes come from the published
source commit. No package installation runs with the App token.

Notes contain only the dated exact-version `CHANGELOG.md` section, plus npm's actual
publication timestamp, exact source commit and original publish-run link. Stable
2.x becomes GitHub latest only when npm latest matches and this does not demote a
newer GitHub release. Stable 1.x stays non-latest; 2.x prereleases stay non-latest
and are marked prerelease. A lagging npm latest tag is retried before writes.
Read-back checks verify the tag, page and applicable latest status, allowing a
short bounded retry for GitHub latest-pointer propagation after creation. Existing
conflicting tags, notes or latest status stop for owner review; nothing is
silently overwritten and version tags are never moved or deleted. Body comparisons
normalize CRLF line endings and terminal newlines only; Markdown spaces and actual
content remain significant. Confirm API read-back behavior during the separately
approved first live App write.

### Proposed App setup — separate owner authorization required

These PRs do not create an App, install it, configure credentials, or change rules.
Before enabling a live publication, approve and perform this exact setup:

| Setting                      | Proposed value                                                                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Installation                 | Only `WinkIntel/bootstrap-svelte`                                                                                                                     |
| Repository permissions       | **Contents: write**, **Workflows: write**; Metadata read is implicit                                                                                  |
| Environment variable         | `npm-publish` → `RELEASE_APP_CLIENT_ID` (App client ID)                                                                                               |
| Environment secret           | `npm-publish` → `RELEASE_APP_PRIVATE_KEY`                                                                                                             |
| Release tag creation ruleset | Add the App's numeric integration ID to ruleset **24938133**, actor type `Integration`, bypass mode `always`; retain the existing administrator entry |
| Immutable tag ruleset        | Leave **24938132** unchanged, with no App bypass                                                                                                      |
| Branch rules                 | No App bypass and no changes                                                                                                                          |

The automatic Publish caller explicitly passes only `RELEASE_APP_PRIVATE_KEY` to
this reusable workflow, which declares that secret required. GitHub permits a
named mapping even when the key exists only in an environment; the callee's
`npm-publish` job receives the environment value after approval. Omitting the
mapping makes the secret empty in a reusable call. See
[GitHub's environment-secret rules](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows#using-inputs-and-secrets-in-a-reusable-workflow).
`required: true` validates the caller contract, not whether a value exists, so the
writer retains its presence preflight. The key stays in the existing environment;
no repository secret copy or broad `secrets: inherit` is needed. Standalone
release-page recovery accesses the same protected environment directly.

No Actions-write, Administration, organization-wide installation, PAT fallback or
npm credential is requested. The pinned official `actions/create-github-app-token`
action requests only Contents/Workflows write, only this repository, and retains
its default post-job token revocation. App client ID and numeric integration ID
serve different purposes; do not interchange them.

GitHub's [Create a release API documentation](https://docs.github.com/en/rest/releases/releases#create-a-release)
explicitly requires Workflows write when the target commit's `.github/workflows`
files differ from the default branch; maintenance and historical recovery can have
that difference. `GITHUB_TOKEN` cannot gain this permission. The
[Create a reference API](https://docs.github.com/en/rest/git/refs#create-a-reference)
also documents the Contents/Workflows permission combination. These permissions
and the creation-only ruleset bypass need owner approval before configuration;
no live App write has been tested by this workflow preparation.

Live Publish checks that both configuration values are present before npm writes;
missing configuration fails clearly. Presence does not prove installation,
permissions, key validity or bypass correctness. Verify those settings during the
separately approved setup. Dry runs do not require the App.

### Release-only recovery

If npm succeeded but the page failed, **never dispatch Publish again for that
version**. After correcting the cause, dispatch **GitHub release page** from a
reviewed release branch, supplying the original `publish-run-id`, successful
`publish-run-attempt`, and artifact `build-run-attempt`. For example, if attempt 1
built the artifact and attempt 2 successfully published it, provide build attempt
`1` and publish attempt `2`; neither input is the later recovery run attempt.
Obtain the protected write-job approval if requested.
Recovery re-verifies the original successful live publication; it has no npm
publish path. It can finish a missing page after the tag was already created and
accepts an exactly matching completed release without additional writes.

Publish artifacts currently expire after seven days. Missing, expired, duplicate
or source-mismatched artifacts fail closed; do not rebuild an artifact or republish
to bypass this. Expired artifacts or conflicts require an owner-reviewed manual
recovery using preserved publication/provenance evidence. Historical releases with
manually written notes may deliberately conflict with generated notes.

Page jobs serialize across both release lines using their own lock. When invoked
from Publish, they remain jobs of that Publish run: **the parent npm publishing
lock remains held until the page jobs finish, including a second environment
approval wait**. That wait can therefore block new Publish runs for both release
lines. A standalone release-page recovery run holds only the page lock. Neither
lock is a durable queue: a newly queued run can replace the existing pending run,
even with `cancel-in-progress: false`. Finish or explicitly cancel stale approval
waits before queuing another release; do not queue multiple recovery runs.
Acceptance includes the verified
source tag, release page, prerelease/latest behavior, npm evidence and consumer
checks; publication success alone does not complete the page gate.
