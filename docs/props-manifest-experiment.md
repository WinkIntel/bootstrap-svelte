# Showcase prop validation and manifest experiment

This implements the website-only validation and local experiment from [#76](https://github.com/WinkIntel/bootstrap-svelte/issues/76). It does not publish a manifest endpoint or change packaged components.

## Validation

`pnpm test` runs `src/routes/(common)/props-validation.test.ts` in the Node/Vitest server project. It uses the same `renderPageDom` helper as the Markdown exporter to server-render registered site pages, including Accordion's generated rows. Each props/options table declares its source alias with `data-props-type`, for example:

```html
<table data-props-type="ToastContainerProps">
    <!-- Existing handwritten header and prop rows -->
</table>
```

The validator checks each first-column prop name against the resolved type. Missing bindings, unknown aliases, malformed bound tables, and invalid props fail. CSS and event tables are excluded by their column headers; attachment options are included. Keep bindings aligned with actual component exports, independent of display headings. The test snapshots per-page table and row counts, so intentional additions/removals require review of that inventory too.

The compiler reads the project configuration and ambient declarations, resolves intersections and inherited attributes, and collects properties from every union member. Validation uses only a `Set` of names per type; it does not serialize the full manifest. Full type strings and JSDoc are produced only when the experiment requests them. The extractor lives under `src/routes/(common)` so existing formatting, lint and type-check commands cover it; neither the compiler nor the extractor is imported by production pages.

This validates **names**, not the accuracy of handwritten type/default/description columns, runtime behavior, or reverse coverage of every public property. Focused tests also cover the historical Toast `position` drift and Pagination's accessible-label default. Missing Form, Row/Col, and Portal reference tables remain outside this slice.

## Reproduce the manifest spike

With the pinned dependencies installed, run from the repository root using Node 26:

```sh
pnpm exec svelte-kit sync
node 'src/routes/(common)/props-types.ts' > /tmp/components-experiment.json
node --input-type=module -e '
import { readFileSync } from "node:fs";
const output = readFileSync("/tmp/components-experiment.json");
const types = Object.values(JSON.parse(output).types);
console.log({ types: types.length, properties: types.reduce((n, t) => n + t.props.length, 0), bytes: output.length });
'
```

The extractor writes only to stdout. Do not commit its output or place it under `static/`. No new dependencies or package scripts are needed. The commands above report counts for the current checkout; revision-specific measurements and release evidence belong in the PR/issue.

The prototype emits exported `*Props`/`*Options` aliases from `src/lib/*/types.ts`, keyed by source type, with source paths and each property's name, display type, optionality, `memberOnly` flag, JSDoc, and `default: null`. Here `null` means **not inferred**, not a runtime null default. `memberOnly` identifies properties absent from some union members: for example, `for` on `FormCheckLabelProps`. Such properties are accepted by name validation but may require a particular union variant. `optional` is true if a property is absent or optional in any variant. Variant property types and distinct JSDoc are retained; trailing comments and absent comments are not invented as JSDoc.

For example, `ProgressProps.valueMax` retains its actual JSDoc mentioning a default of 100, but the structured default remains unknown. Source type names also are not a reliable component/part tree: public `ProgressBar` uses `ProgressProps`, while `ProgressBarProps` describes its nested `barProps` object; both Carousel controls share `CarouselControlProps`.

**Recommendation:** retain handwritten tables with this name-validation gate. The full dump repeats inherited HTML/Svelte attributes and their documentation for each type, making it unsuitable as a public payload. Before publishing a component → parts → props manifest or generating tables, design a reviewed export-to-type mapping, deduplicate inherited attributes, and define a runtime-default source. Preserve readable union aliases, distinguish inherited/custom properties, and decide how incomplete JSDoc should be displayed. A source-type dump must not become a claimed stable public API.

The public schema/endpoint, generated tables, new Form/Row/Col/Portal references, reverse coverage, and packaged type/JSDoc/default cleanup remain separate work tracked in #76.
