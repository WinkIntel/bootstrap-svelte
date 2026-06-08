# Container Component

Create a **Container component** (`src/lib/Container`) encapsulating Bootstrap [Container layout](https://getbootstrap.com/docs/5.3/layout/containers/).

### Requirements:

- Follow Badge component patterns (`src/lib/Badge`).
- Properties:
  - `breakpoint` (optional Bootstrap breakpoints).
  - `isFluid` (boolean for `container-fluid`).
- Unit test (`container.svelte.test.ts`) referencing Badge tests.
- Playground page (`ContainerPlayground.svelte`) referencing Badge playground structure.


# Copilot Prompt: Add Element Type Control to Container Playground

## Objective

Update the `ContainerPlayground.svelte` file (located in `src/routes/components/container/`) to support interactive testing of the `elementType` property on the Container component.

## Context Provided

- The source file `ContainerPlayground.svelte` is attached.
- The Container component source folder (`src/lib/Container`) is also available in context.
- The supported `elementType` values are:

```ts
type ContainerElementType = 'article' | 'aside' | 'div' | 'footer' | 'header' | 'main' | 'section';
