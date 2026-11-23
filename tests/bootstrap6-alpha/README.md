# Bootstrap 6 alpha CSS fixture

This private fixture characterizes the current Container/Row/Col SSR output against
exact Bootstrap 5, 6 alpha.1 and 6 alpha.2 CSS artifacts. It does **not** implement or claim Bootstrap 6 support.
The Bootstrap 5 showcase and production components are unchanged.

From this directory, with Node 26 and npm:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run check
npm run browser:generate # writes a self-contained measurement page; does not launch it
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

| Input           | Version                   | Distributed `dist/css/bootstrap.css` SHA-256                       |
| --------------- | ------------------------- | ------------------------------------------------------------------ |
| Comparison CSS  | `bootstrap@5.3.6`         | `1da4b921953cee097fefd2507bf1c77467041d9db28d4003bfc81eca1369a1cf` |
| Alpha 1 control | `bootstrap@6.0.0-alpha.1` | `ad0d5123040e043dad1451a6d4483dad4df4e2835e6687d6cf5af8a757283371` |
| Alpha 2 target  | `bootstrap@6.0.0-alpha.2` | `4df5807d5807353e17dda52a7ee6c0acb9aabb1401553b026136a2b3e145b480` |

The comparison uses the same Bootstrap version as the showcase CDN link, checked
against `src/app.html`; this fixture hashes expanded `bootstrap.css`, whereas the
showcase loads `bootstrap.min.css`. They are distinct distributed assets; it is not a claim that 5.3.6 is
the latest Bootstrap 5. Alpha 1's npm tarball integrity is
`sha512-snAWSjKDVdQAyPOtR69Upy247tZq13gw86SMDMZS4wNfBXGNdzbHdIP6GAyaAVJwTX4LjWowY8YYaJkSDv2wGQ==`,
also recorded in the lockfile. Upstream npm gitHead:
`780627306eb517ca210310a24e10f8186003c127`.

Alpha 2's exact npm tarball integrity is
`sha512-AX+LxV8OVqkCOyXGnShIUYLupJ7TSjXwzPUM//xt3YaR01xQoQWXfFNfWFo3rjIuDdTqeZC3k0dXKkf/i6X03A==`,
with upstream npm gitHead `03f96cae5c9f8c66908d684a19ac1ac6897870ab`.
The private `bootstrap6alpha2` alias adds a third artifact; it never replaces either
control. The upstream [alpha 2 release](https://github.com/twbs/bootstrap/releases/tag/v6.0.0-alpha.2)
and project [alpha tracker #166](https://github.com/WinkIntel/bootstrap-svelte/issues/166)
provide context. Selector/declaration expectations come from the installed bytes.

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
importance and representative declarations in **all three** artifacts. Matched tokens
therefore do not imply equivalent declarations or cascade. The examined alpha grid
rules are layered; the stylesheet also contains unlayered rules such as root tokens.

The sole absent baseline/mapped token is `offset-0`, emitted by the current public
API but absent from all three pinned stylesheets. It is reported, not fixed in production.
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
| bootstrap6-alpha2-current | 43/254 | 211 |
| bootstrap6-alpha2-mapped-reference | 253/254 | 1 |

| Public key | v5 first conditional rule / container cap | Alpha first conditional rule / container cap |
| --- | --- | --- |
| sm | 576 / 540px | 576 / 540px |
| md | 768 / 720px | 768 / 720px |
| lg | 992 / 960px | 1024 / 960px |
| xl | 1200 / 1140px | 1280 / 1200px |
| xxl | 1400 / 1320px | 1536 / 1440px |

| Representative declaration | Bootstrap 5 | Alpha 1 | Alpha 2 |
| --- | --- | --- | --- |
| row display | `display: flex` (unlayered) | `display: flex` (layout) | `display: flex` (layout) |
| row wrap | `flex-wrap: wrap` (unlayered) | `flex-wrap: wrap` (layout) | `flex-wrap: wrap` (layout) |
| col flex | `flex: 1 0 0` (unlayered) | `flex: 1 0 0` (layout) | `flex: 1 0 0` (layout) |
| col-6 width | `width: 50%` (unlayered) | `width: 50%` (layout) | `width: calc((100% + 0px) * 0.5 - 0px)` (layout) |
| row-cols-3 width | `width: 33.33333333%` (unlayered) | `width: 33.3333333333%` (layout) | `width: calc((100% + var(--bs-gutter-x, 0px)) / 3 - var(--bs-gutter-x, 0px))` (layout) |
| col-auto width | `width: auto` (unlayered) | `width: auto` (layout) | `width: auto` (layout) |
| offset-2 offset | `margin-left: 16.66666667%` (unlayered) | `margin-inline-start: 16.6666666667%` (layout) | `margin-inline-start: calc((100% + 0px) * 0.1666666667)` (layout) |
| order-2 order | `order: 2 !important` (unlayered) | `order: 2` (utilities) | `order: 2` (utilities) |
| container gutter | `padding-left: calc(var(--bs-gutter-x) * 0.5)` (unlayered) | `padding-inline: calc(var(--bs-gutter-x) * 0.5)` (layout) | `padding-inline: calc(var(--bs-gutter-x) * 0.5)` (layout) |

| Alpha 2 scoped rule | Declaration (layout layer) |
| --- | --- |
| `.row` | `gap: var(--bs-gutter-y) var(--bs-gutter-x)` |
| `.row` | `--bs-gutter-x: 1.5rem` |
| `.row` | `--bs-gutter-y: 0` |
| `.row > *` | `box-sizing: border-box` |
| `.row > *` | `flex-shrink: 0` |
| `.row > *` | `width: 100%` |
| `.row > *` | `max-width: 100%` |
| `:where(.row) > .col-6` | `width: calc((100% + var(--bs-gutter-x, 0px)) * 0.5 - var(--bs-gutter-x, 0px))` |
| `:where(.row) > .offset-2` | `margin-inline-start: calc((100% + var(--bs-gutter-x, 0px)) * 0.1666666667)` |
| `.gx-0` | `--bs-gutter-x: 0px` |
| `.gy-0` | `--bs-gutter-y: 0` |
<!-- fixture-report:end -->

<!-- prettier-ignore-end -->

Single-edit negative tests cover all three artifacts' thresholds/container caps, all
representative declarations, importance/layers, selector removal, legacy-selector
absence, earlier conditional rules, and asset corruption. Styles/SSR render results
are shared within the suite; unchanged CSS indexes are reused for mutation tests.
The arbitrary-working-directory CLI remains a separate end-to-end exercise.

## Alpha 2 grid delta

Alpha 1 keeps negative row margins and child gutter padding/margins. Alpha 2 uses
`gap: var(--bs-gutter-y) var(--bs-gutter-x)` and removes that older row/child gutter
mechanism. The checker asserts the absence of the old declarations as well as
native gap, child sizing, exact layer and importance. It retains the original
subject/context checks for alpha 1 and records the alpha 2 contextual rules
separately; an occurrence of `.col-6` does not identify the applicable width.

For a row content width `W` and horizontal gap `G`, the shipped alpha 2 row-child
`.col-6` formula is `(W + G) * 0.5 - G`, while isolated `.col-6` uses a literal
zero gap. Row-child `.offset-2` uses `(W + G) * 0.1666666667`; isolated offsets also
use zero gap. `row-cols-3 > *` uses `(W + G) / 3 - G`. These are declaration
relationships, not observed geometry. Treating alpha 2 as alpha 1 fails at the
actual checker entry point (`alpha col-6: expected width: 50% in layout context`).
Responsive token spellings and thresholds match alpha 1; matching counts therefore
hide a substantial gutter/width/offset semantic change.

## Browser coverage and limits

**Browser measurements remain UNRUN.** Neither tests nor the fixture workflow
launches a browser or HTTP server. Selector/media/declaration coverage and HTML
generation do not establish evaluated geometry, cascade correctness or support.
No enabled browser surface was available for this spike; no alternate browser or
file-URL workaround was attempted.

`npm run browser:generate` writes `.generated-browser/index.html` (gitignored).
The CLI also accepts `--output /explicit/task-local/path/index.html` and runs from
arbitrary working directories. This is a self-contained, server-free page with
verified CSS, actual Container/Row/Col SSR markup, the same disposable token mapping
and inline measurement code; no remote assets, Bootstrap JavaScript or hydration.
Generation only prepares the experiment. Opening it requires a permitted browser
path supplied separately by the controller; this command does not open it.

The static report retains its planned **90 unrun CSS/viewport combinations**:
five modes at `375, 575, 576, 767, 768, 991, 992, 1023, 1024, 1199, 1200, 1279, 1280,
1399, 1400, 1535, 1536, 1600` pixels. The generated page prepares **100 sequential
frames**: the middle 16 widths in LTR for responsive checks, plus 375 and 1600px
in both LTR and RTL for ten layout/cascade cases, across all five modes.
One iframe is attached/measured/removed at a time to bound the active DOM.

The ten cases are equal columns, numeric half-column wrapping, row-cols wrapping,
zero gutters, independently overridden x/y gutters, nested rows, numeric offset,
responsive Container/Row/Col, a controlled cascade comparison and a full-width
flex break compared with two separate Rows under nonzero vertical gutters.
The zero-height full-width break can occupy its own flex line and introduce two
vertical gaps; separate Rows record their own separation without pretending that
a row gap automatically supplies spacing between Rows. This comparison is prepared,
not a measured result. The cascade
case declares a consumer layer before Bootstrap, then supplies a later unlayered
consumer override. Relationship expectations use measured row width/gap and the
verified declarations, rather than guessed pixel widths. Expected mismatches of
current alpha responsive tokens are labeled separately from unexpected mismatches;
the mapped reference is an experiment, not a public API change or support claim.

The page exposes `window.__bootstrapGridSpike`: `status`, `complete`, exact artifact
hashes, user agent, planned/observed frames, errors, summary and raw per-case
container/row/child rectangles, content/client/scroll widths, gaps, padding,
margins, gutter variables and order. Each frame records requested and actual
viewport/client widths and direction. Nested rows are measured separately. Each
relationship records observed/expected values and interpretation; the readable
summary separates expected current-token mismatches. A script error ends with an
error status and partial evidence rather than a pass. Generator tests parse the
script and serialized plan; they do not execute DOM measurements.

Alpha 2 ships logical rules without a separate RTL distribution. This page tests
those rules under `dir=rtl` when executed. The v5 control uses its pinned **LTR**
CSS under `dir=rtl`, records physical margins, and skips a logical-offset parity
assertion in that combination. It is not full Bootstrap 5 RTL parity. No browser
parity flag is asserted by generation. Hydration, interactive behavior, focus,
full RTL distribution comparison and visual review remain outside this CSS spike.

`.github/workflows/bootstrap6-alpha.yml` runs this static fixture only on PRs
targeting `3.x-alpha` and pushes to that branch. It has read-only repository access
and no publication/deployment step. A built-in-only verification test in the existing
common CI `release-*.test.mjs` glob checks this fixture workflow independently of
its own steps. It is verification of this fixture, not a change to release
implementation or a malicious-author security boundary; workflow and tests can
be edited together in a PR. Existing library CI and its build gate remain unchanged. A later component/breakpoint migration, Bootstrap peer decision, alpha
showcase and prerelease publication safeguards each require separate review.
