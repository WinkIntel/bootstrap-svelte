# Showcase prop validation and manifest experiment (#76)

This is the approved website-only slice of [#76](https://github.com/WinkIntel/bootstrap-svelte/issues/76). It adds a CI check and a reproducible local experiment. It does not change the library, package metadata, or public endpoints. #63 remains separate.

## Validation

`pnpm test` runs `src/routes/(common)/props-validation.test.ts` in the existing Node/Vitest server project. It server-renders every showcase page, including Accordion's generated rows, and checks each props/options table's first column against TypeScript's resolved properties. At this revision, that is **434 rows in 84 tables across 27 pages**. The page/table inventory is asserted so a removed or unrecognized table cannot silently reduce coverage. CSS and event tables are excluded; Scrollspy attachment options are included.

The compiler reads the project's TypeScript configuration and ambient declarations. It resolves intersections and inherited HTML attributes, rejects source type errors and unresolved types, and retains explicit mappings for public names that differ from source type names (for example `Dropdown.ItemText` → `DropdownTextProps`, `ProgressBar` → `ProgressProps`). These mappings must be reviewed when component exports change.

Corrections found by the check:

- Nav.Root: `as` → `elementType`, including the surrounding explanatory prose.
- Pagination.Root and Pagination.Link: `ariaLabel` → `aria-label`.
- ListGroup.Item: remove unsupported `isDisabled`; it remains valid on ItemAction.
- Tab.Pane: correct the table heading previously labeled Tab.NavLink.
- Tooltip.Inner: move the “all div element props” pseudo-property into prose.

The historical Toast `position` finding was already corrected; a negative test now proves the checker rejects it. This check validates **names**, not the accuracy of handwritten type/default/description columns, runtime behavior, or reverse coverage of every public property. Missing Form, Row/Col, and Portal reference tables remain deferred.

## Reproduce the manifest spike

With the pinned dependencies installed and SvelteKit synchronized (as in CI), run from the repository root using Node 26:

```sh
pnpm exec svelte-kit sync
node scripts/docs/props-manifest.ts > /tmp/components-experiment.json
```

The command writes only to stdout. Do not commit its output or place it under `static/`. No new dependencies or package scripts are needed.

The prototype emits 137 exported `*Props`/`*Options` aliases from `src/lib/*/types.ts`, keyed by source type, with the source path and each property's name, display type, optionality, JSDoc, and `default: null`. Here `null` means **not inferred**, not a runtime null default. For example, `ProgressProps.valueMax` retains its actual JSDoc mentioning a default of 100, but the structured default remains unknown. Trailing comments and absent comments are not invented as JSDoc.

The experiment produced 59,577 property entries and 14,740,933 bytes of pretty-printed JSON with the current lockfile. Most of that is repeated inherited HTML/Svelte attributes and their documentation. This is useful for validation but unsuitable as the public manifest format. Source type names also are not a reliable component/part tree: the public `ProgressBar` uses `ProgressProps`, while `ProgressBarProps` describes its nested `barProps` object; both Carousel controls share `CarouselControlProps`.

**Recommendation:** keep handwritten tables with this name-validation gate for now. Before publishing a component → parts → props manifest or generating tables, design a reviewed export-to-type mapping, deduplicate inherited attributes, and define a runtime-default source. Preserve readable union aliases, distinguish inherited/custom properties, and decide how incomplete JSDoc should be displayed. A source-type dump must not become a claimed stable public API.

## Deferred from the original issue

- A stable component/part schema and `/api/components.json` endpoint.
- Generating showcase tables from the manifest.
- New Form, Row/Col, and Portal API reference sections and reverse prop coverage.
- Type/JSDoc cleanup and runtime default extraction in packaged source.

Record this outcome on #76, keep the issue open for the remaining scope, and release this slice as a website-only change after owner approval. No npm release is needed: all packaged files and package metadata must remain byte-identical to 2.1.2. Starting another issue still requires approval and the agreed production-release gate.
