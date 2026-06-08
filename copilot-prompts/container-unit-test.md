# Copilot Prompt: Add Unit Tests for `elementType` Prop in Container Component

## Objective

Update the existing unit test file `container.svelte.test.ts` to include comprehensive tests for the new `elementType` property introduced in the `Container` component.

## Context Provided

- The `src/lib/Container` folder is available and includes:
  - `container.svelte`: The Svelte source file where the `elementType` prop is implemented.
  - `types.ts`: The type definition file containing valid values for the `elementType` property.
  - `container.svelte.test.ts`: The unit test file where the new tests should be added.

## Property Details

- `elementType` defines the HTML tag used for rendering the container.
- It may default to `div` but should accept other valid tags (e.g., `section`, `article`, `main`, `aside`, etc.).
- The list of valid values is defined in `types.ts`.

## Instructions

- Inspect `types.ts` to extract all possible allowed values of the `elementType` prop.
- For each valid `elementType`, write a unit test that:
  1. Renders the component with that value.
  2. Asserts that the HTML output matches the expected element (e.g., `<section class="container">...</section>`).
- Include an explicit test to confirm the **default** behavior when `elementType` is not provided (i.e., renders as a `<div>`).
- Use consistent test patterns and naming conventions already present in `container.svelte.test.ts`.

## Example Test Case (Conceptual)

```ts
it('renders as a <section> when elementType="section"', () => {
  const { container } = render(Container, { props: { elementType: 'section' } });
  const el = container.querySelector('section');
  expect(el).toBeTruthy();
  expect(el).toHaveClass('container');
});
