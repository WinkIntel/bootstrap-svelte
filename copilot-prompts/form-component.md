You are generating a unit test for a Svelte 5 component using Vitest and @testing-library/svelte.
Follow the exact style and structure used in the example test file at:
`src/lib/Form/tests/row.svelte.test.ts` (imports, jest-dom/vitest setup, describe/test blocks, expectations).

## What to create
- **New test file** at: `src/lib/Form/tests/form-check-input.svelte.test.ts`
- The component under test is located at: `src/lib/Form/form-check-input.svelte`
- The test must import the component using a relative path from the test file’s folder.

## Tech & conventions
- Test runner: Vitest
- DOM matchers: `@testing-library/jest-dom/vitest`
- Library: `@testing-library/svelte`
- Use `render`, query via `container`, and assertions like `toBeInTheDocument`, `toHaveClass`, `toHaveAttribute`, etc.
- Prefer role/label queries when appropriate; otherwise use `container.querySelector`.
- Keep tests deterministic and minimal; avoid over-mocking.
- No snapshots.

## Component behavior to assert (derive from the source code):
Component: **Form.CheckInput** (checkbox input)
Source path: `src/lib/Form/form-check-input.svelte`

**Baseline behavior**
1) Renders without crashing.
2) Renders an `<input type="checkbox">` element.
3) Applies the base Bootstrap class for a checkbox input: **`form-check-input`**.
4) Accepts and merges custom classes passed via the `class` prop (e.g., `'custom-class another-class'`).

**Props**
- `checked?: boolean`
- `class?: string`
- `elementRef?: HTMLInputElement`
- `isIndeterminate?: boolean`
- `isInvalid?: boolean`
- `isValid?: boolean`
- Spreads `...restOfProps` onto the `<input>` (id, name, value, disabled, aria-*, data-* etc.)

**Class logic (Bootstrap semantics)**
5) When `isValid === true`, it includes the class `is-valid`.
6) When `isInvalid === true`, it includes the class `is-invalid`.
7) When neither is provided (or both are `undefined`), neither validation class is present.
8) (If both `isValid` and `isInvalid` are true, assert both classes are present unless the component explicitly prevents it. Prefer a test asserting **both present**—remove this if the component forbids it.)

**State & refs**
9) `checked` prop: when `checked` is true, the input is initially checked; when false/undefined, it is not checked.
10) `isIndeterminate === true` sets `input.indeterminate === true` on mount (use `await tick()` if needed for timing).
11) `elementRef` is bound to the underlying `<input>` (you can assert the element exists and is an instance of `HTMLInputElement`).

**Prop forwarding**
12) Forwards `id`, `name`, and `value` props to the underlying input (e.g., `id="checkDefault"`, etc.).
13) Forwards accessibility attributes like `aria-label` or `aria-describedby`.
14) Forwards boolean attributes like `disabled` and reflects them on the DOM element.

## Test cases to implement
Create *separate tests* for each of the following:

- **renders**: component renders and is in the document.
- **type and base class**: element is `input[type="checkbox"]` and has `form-check-input`.
- **custom classes**: merges custom classes with the base class.
- **valid state**: `isValid: true` → has `is-valid`; undefined → not present.
- **invalid state**: `isInvalid: true` → has `is-invalid`; undefined → not present.
- **valid+invalid together** (only if component allows): both `is-valid` and `is-invalid` present.
- **checked state**: `checked: true` renders as checked; `checked: false` renders as not checked.
- **indeterminate**: `isIndeterminate: true` results in `input.indeterminate === true` after mount (`await tick()` if necessary).
- **prop forwarding**: forwards `id`, `name`, `value`, `disabled`, and `aria-label` to the `<input>` (assert attributes).
- **elementRef bound**: the input element exists and can be referenced (e.g., via container queries; optionally assert it’s an `HTMLInputElement`).

## Coding style (match the example file)
- Include `/// <reference types="@testing-library/jest-dom" />` at the top.
- `import '@testing-library/jest-dom/vitest';`
- `import { render } from '@testing-library/svelte';`
- `import { describe, expect, test } from 'vitest';`
- Import the component with a relative path: `import CheckInput from '../form-check-input.svelte';`
  - Note: the test file will be at `src/lib/Form/tests`, so `../form-check-input.svelte` is the correct relative path.
- Use `describe('Form.CheckInput', ...)`.

## Example assertions to use (adapt to real DOM)
- `expect(container).toBeInTheDocument();`
- `const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;`
- `expect(input).toHaveClass('form-check-input');`
- `expect(input).toHaveClass('custom-class');`
- `expect(input).toHaveClass('is-valid');`
- `expect(input).not.toHaveClass('is-valid');`
- `expect(input.checked).toBe(true);`
- `expect(input).toHaveAttribute('id', 'checkDefault');`
- `expect(input).toHaveAttribute('aria-label', 'Some label');`
- For indeterminate: `await tick(); expect(input.indeterminate).toBe(true);`

## Deliverable
Produce the full contents of `src/lib/Form/tests/form-check-input.svelte.test.ts` implementing the tests above, clean and ready to run with `vitest`. Do not modify the component. Keep the test focused and readable.
