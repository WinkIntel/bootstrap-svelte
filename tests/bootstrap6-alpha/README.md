# Bootstrap 6 alpha CSS fixture

This private fixture characterizes the current Container/Row/Col SSR output against
exact Bootstrap CSS artifacts. It does **not** implement or claim Bootstrap 6 support.
The Bootstrap 5 showcase and production components are unchanged.

From this directory, with Node 26 and npm:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run check
```

The fixture has its own manifest and lockfile. It does not require a root install,
change the library's dependencies/peer range/version, or load Bootstrap JavaScript.
The local `.npmrc` disables install scripts and automatic peer installation: this
fixture only reads Bootstrap CSS and package metadata, so the upstream JavaScript
peers are unnecessary. `npm ci` verifies locked tarball integrity; the check also
rejects a wrong installed version, missing CSS, or changed raw CSS SHA-256 **before
parsing**. Install/check errors fail the job rather than falling back to a CDN,
another version, or an empty stylesheet.

## Exact inputs

| Input          | Version                   | Distributed `dist/css/bootstrap.css` SHA-256                       |
| -------------- | ------------------------- | ------------------------------------------------------------------ |
| Comparison CSS | `bootstrap@5.3.6`         | `1da4b921953cee097fefd2507bf1c77467041d9db28d4003bfc81eca1369a1cf` |
| Target CSS     | `bootstrap@6.0.0-alpha.1` | `ad0d5123040e043dad1451a6d4483dad4df4e2835e6687d6cf5af8a757283371` |

The comparison uses the same Bootstrap version as the showcase CDN link, checked
against `src/app.html`; this fixture hashes expanded `bootstrap.css`, whereas the
showcase loads `bootstrap.min.css`. They are distinct distributed assets; it is not a claim that 5.3.6 is
the latest Bootstrap 5. Alpha 1's npm tarball integrity is
`sha512-snAWSjKDVdQAyPOtR69Upy247tZq13gw86SMDMZS4wNfBXGNdzbHdIP6GAyaAVJwTX4LjWowY8YYaJkSDv2wGQ==`,
also recorded in the lockfile. Upstream npm gitHead:
`780627306eb517ca210310a24e10f8186003c127`.

See the official [alpha announcement](https://blog.getbootstrap.com/2026/10/08/bootstrap-6-alpha/)
and [v6 migration guide](https://getbootstrap.com/docs/6.0/guides/migration/).
Live documentation may change; the pinned distributed CSS is this fixture's oracle.
Review and update the pin, integrity, expectations and compatibility evidence
together when evaluating another upstream prerelease. There is no automatic pin
update and no promise about later alphas, betas or stable 6.x.

## What runs

The fixture compiles the repository's actual Container, Row, Col and shared CSS
helper source with exact Svelte 5.57.0 and `runes: true`, matching project compiler
semantics. Node 26 strips erasable TypeScript syntax natively; no fixture TypeScript
compiler is installed. The actual CSS helper retains its runtime `bezier-easing`
import, so that package remains installed rather than replacing source behavior.
The installed Svelte and easing versions must satisfy the root manifest's configured
development/dependency ranges. This keeps the isolated fixture aligned with the
branch's development toolchain; it does not test the library's minimum Svelte floor.

Cases enumerate scalar and breakpoint-map values from the public grid prop ranges,
including `xs`, `cols="auto"`, `order="first"|"last"`, `offset={0}` and multi-key Rows.
An independent test derives the expected token set from public type ranges and
breakpoint map keys. This covers emitted grid tokens, not every possible prop
combination, user-supplied class, input ordering, or computed layout.

A reference mapping changes only rendered class tokens: for example,
`container-lg` → `lg:container`, `col-lg-6` → `lg:col-6`, and existing public `xxl`
→ CSS `2xl`. The remaining HTML is identical. This is a disposable CSS comparison,
not a production mapping or a decision to replace/add public breakpoint keys.

The bounded source loader supports static `$lib/` and relative imports of local
Svelte/JavaScript/erasable TypeScript files (`.js` may resolve to source `.ts`).
Package imports resolve from the fixture's install. Svelte source and wrapper both
compile in runes mode. Hooks deregister and generated wrappers are removed on
success and failure. This is not a general project bundler: preprocessing,
SvelteKit aliases, CSS/assets and non-erasable TypeScript syntax require a separate
review if future grid source needs them. No arbitrary module fallback is used.

The check indexes selector occurrences separately from isolated class, compound,
ancestor and direct-child roles. Threshold assertions use the first conditional
isolated class or grid direct-child rule, ignoring contextual `.navbar > .class`
mentions and unconditional container structure; container activation requires a
`max-width` declaration. These are static placements, not computed breakpoints.
It records all enclosing at-rules (including layers and containers), declaration
importance and representative declarations in **both** artifacts. Matched tokens
therefore do not imply equivalent declarations or cascade. The examined alpha grid
rules are layered; the stylesheet also contains unlayered rules such as root tokens.

The sole absent baseline/mapped token is `offset-0`, emitted by the current public
API but absent from both pinned stylesheets. It is reported, not fixed in production.
Every non-`xs` responsive spelling changes; the complete missing lists are in the
JSON from `npm run check`. Tests log the static tables once; CI does not repeat a
second report compilation. The marked tables below are generated by
`markdownReport(report)` and checked against the current run to prevent stale counts.

<!-- prettier-ignore-start -->

<!-- fixture-report:start -->
297 generated SSR prop cases cover 254 distinct public grid tokens.

| Static selector occurrence | Found/total | Missing |
| --- | ---: | ---: |
| bootstrap5-current | 253/254 | 1 |
| bootstrap6-current | 43/254 | 211 |
| bootstrap6-mapped-reference | 253/254 | 1 |

| Public key | v5 first conditional rule / container cap | Alpha first conditional rule / container cap |
| --- | --- | --- |
| sm | 576 / 540px | 576 / 540px |
| md | 768 / 720px | 768 / 720px |
| lg | 992 / 960px | 1024 / 960px |
| xl | 1200 / 1140px | 1280 / 1200px |
| xxl | 1400 / 1320px | 1536 / 1440px |

| Representative declaration | Bootstrap 5 | Alpha 1 |
| --- | --- | --- |
| row display | `display: flex` (unlayered) | `display: flex` (layout) |
| row wrap | `flex-wrap: wrap` (unlayered) | `flex-wrap: wrap` (layout) |
| col flex | `flex: 1 0 0` (unlayered) | `flex: 1 0 0` (layout) |
| col-6 width | `width: 50%` (unlayered) | `width: 50%` (layout) |
| row-cols-3 width | `width: 33.33333333%` (unlayered) | `width: 33.3333333333%` (layout) |
| col-auto width | `width: auto` (unlayered) | `width: auto` (layout) |
| offset-2 offset | `margin-left: 16.66666667%` (unlayered) | `margin-inline-start: 16.6666666667%` (layout) |
| order-2 order | `order: 2 !important` (unlayered) | `order: 2` (utilities) |
| container gutter | `padding-left: calc(var(--bs-gutter-x) * 0.5)` (unlayered) | `padding-inline: calc(var(--bs-gutter-x) * 0.5)` (layout) |
<!-- fixture-report:end -->

<!-- prettier-ignore-end -->

Single-edit negative tests cover both artifacts' thresholds/container caps, all
representative declarations, importance/layers, selector removal, legacy-selector
absence, earlier conditional rules, and asset corruption. Styles/SSR render results
are shared within the suite; unchanged CSS indexes are reused for mutation tests.
The arbitrary-working-directory CLI remains a separate end-to-end exercise.

## Browser coverage and limits

**No browser coverage runs locally or in this workflow.** Selector/media/declaration
coverage is not evaluated geometry, cascade correctness or product support.
Computed widths, wrapping, offsets, order, gutters/overflow, RTL, hydration,
interaction, focus and visual comparison remain unverified.

This fixture and its CI do not launch a browser or HTTP server. A later layout
migration should add real-browser coverage for this matrix before claiming visual
or responsive parity.

The planned matrix remains **54 unrun CSS/viewport combinations**: the three modes
above at `375, 575, 576, 767, 768, 991, 992, 1023, 1024, 1199, 1200, 1279, 1280,
1399, 1400, 1535, 1536, 1600` pixels. These sample both old and alpha boundaries;
recording this plan does not count as a browser pass.

`.github/workflows/bootstrap6-alpha.yml` runs this static fixture only on PRs
targeting `3.x-alpha` and pushes to that branch. It has read-only repository access
and no publication/deployment step. A built-in-only verification test in the existing
common CI `release-*.test.mjs` glob checks this fixture workflow independently of
its own steps. It is verification of this fixture, not a change to release
implementation or a malicious-author security boundary; workflow and tests can
be edited together in a PR. Existing library CI and its build gate remain unchanged. A later component/breakpoint migration, Bootstrap peer decision, alpha
showcase and prerelease publication safeguards each require separate review.
