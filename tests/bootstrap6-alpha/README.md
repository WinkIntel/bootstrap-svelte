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

The comparison matches the existing showcase CSS; it is not a claim that 5.3.6 is
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
helper source with exact Svelte 5.57.0 and TypeScript 6.0.3. It SSR-renders 36 cases:
base/fluid/responsive Containers, base/static/responsive/multi-key Rows, and static
and responsive Col numeric sizing, `'*'`, `'auto'`, offset and order, including `xs`.
Generated modules are disposable and removed in `finally`.

A reference mapping changes only rendered class tokens: for example,
`container-lg` → `lg:container`, `col-lg-6` → `lg:col-6`, and existing public `xxl`
→ CSS `2xl`. The remaining HTML is identical. This is a disposable CSS comparison,
not a production mapping or a decision to replace/add public breakpoint keys.

The check parses selectors (including numeric CSS escapes), exact media-query
contexts, container caps, and representative flex/wrap/width/logical gutter,
offset and order declarations. Negative tests remove rules, alter thresholds and
corrupt assets to prove these guards reject the changed input.

| Static selector characterization      | Rules found |
| ------------------------------------- | ----------: |
| Bootstrap 5 + current SSR classes     |       49/49 |
| Alpha 1 + current SSR classes         |       10/49 |
| Alpha 1 + fixture-only prefix mapping |       49/49 |

Every non-`xs` responsive spelling changes, not just the final breakpoint.
The 39 absent current classes are included in `npm run check`'s JSON report.

| Public key        | v5 minimum / container cap | Alpha 1 minimum / container cap |
| ----------------- | -------------------------- | ------------------------------- |
| `sm`              | 576 / 540px                | 576 / 540px                     |
| `md`              | 768 / 720px                | 768 / 720px                     |
| `lg`              | 992 / 960px                | 1024 / 960px                    |
| `xl`              | 1200 / 1140px              | 1280 / 1200px                   |
| `xxl` / CSS `2xl` | 1400 / 1320px              | 1536 / 1440px                   |

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
and no publication/deployment step. Existing library CI and its build gate remain
unchanged. A later component/breakpoint migration, Bootstrap peer decision, alpha
showcase and prerelease publication safeguards each require separate review.
