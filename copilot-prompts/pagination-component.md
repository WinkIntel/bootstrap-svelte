# Pagination Component

Create a **Pagination component** (`src/lib/Pagination`) encapsulating Bootstrap [Pagination features](https://getbootstrap.com/docs/5.3/components/pagination/).

### Requirements:

- Compose using dot notation (`Pagination.Root`, `Pagination.Item`, `Pagination.Link`).
- Element structure: `<nav>` with child `<ul>`, `<li>` for items, and `<a>` for links.
- Follow Nav component (`src/lib/Nav`) structural patterns (`index.ts`, `types.ts`, `composition.ts`).
- Unit test (`pagination.svelte.test.ts`) referencing Nav tests.
- Playground page (`PaginationPlayground.svelte`) referencing Nav playground.
