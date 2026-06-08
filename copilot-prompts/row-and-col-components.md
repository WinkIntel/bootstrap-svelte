# Copilot Prompt: Create `Row` and `Col` Svelte Components for Bootstrap-Svelte

## Objective

Create two new Svelte components named `Row` and `Col` in the `bootstrap-svelte` project that emulate the functionality of Bootstrap v5's row and column layout classes.

---

## Component #1: Row

### Location
- Directory: `src/lib/Row/`
- Files to generate:
  - `row.svelte`
  - `types.ts`
  - `index.ts`
  - `row.svelte.test.ts`

### Features
- Accept a `sizing` prop of type:
  ```ts
  type SizingMap = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  ```
- Enforce values to be between 1 and 12.
- Output class string based on the `sizing` values:
  - Example: `sizing={{ xs: 12, sm: 6 }}` results in: `row-xs-12 row-sm-6`
- If no `sizing` is provided, output class: `row`
- Render a `<div>` element wrapping slot content.

---

## Component #2: Col

### Location
- Directory: `src/lib/Col/`
- Files to generate:
  - `col.svelte`
  - `types.ts`
  - `index.ts`
  - `col.svelte.test.ts`

### Features
- Accept the same `sizing` prop as the Row component.
- Output class string based on the `sizing` values:
  - Example: `sizing={{ xs: 12, sm: 6 }}` results in: `col-xs-12 col-sm-6`
- If no `sizing` is provided, output class: `col`
- Render a `<div>` element wrapping slot content.

---

## Shared Behavior

- Follow the same component structure, naming, and test strategy used in the `src/lib/Spinner/` folder:
  - Use `types.ts` for prop definitions.
  - Style and organize props and component logic cleanly.
- Add unit tests that:
  - Validate class output for various `sizing` prop values.
  - Test the fallback class (`row` or `col`) when `sizing` is not provided.

---

## Update Index Exports

Update `src/lib/index.ts` to export both components:

```ts
export * from './Row/index.js';
export * from './Col/index.js';
```

> Follow all naming, folder, and code style conventions as found in the `Spinner` component implementation.

