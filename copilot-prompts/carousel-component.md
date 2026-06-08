# Carousel Component

Create a **Carousel component** located in `src/lib/Carousel` that encapsulates all features of the Bootstrap [Carousel component](https://getbootstrap.com/docs/5.3/components/carousel/).

### Requirements:

- Compose all component parts using dot notation (`Carousel.Root`, `Carousel.Inner`, `Carousel.Item`, etc.), structured similarly to the existing Card component (`src/lib/Card`).
- Associate each component explicitly with Bootstrap CSS classes:
  - Root: `"carousel"`
  - Inner: `"carousel-inner"`
  - Item: `"carousel-item"`
- Only create components corresponding directly to elements containing a `"carousel"` or `"carousel-"` CSS class prefix.
- When a component has additional CSS classes conditionally applied (e.g., the `"active"` class on `Carousel.Item`), represent these as component properties:
  - For example, `Carousel.Item` should have an `isActive` boolean property controlling the `"active"` CSS class inclusion.
- Follow existing structural patterns including:
  - `index.ts`
  - `types.ts`
  - `composition.ts`
- Avoid interfaces; strictly utilize type definitions.
- In `composition.ts`, use aliases in the exports for subcomponents and prop types. Refer explicitly to the Card component (`src/lib/Card`) as a reference for these patterns.
- Provide concise, professional-quality comments within the source code, clarifying moderately complex logic, rationale, or non-obvious implementation choices:
  - Exclude trivial or obvious commentary.
  - Ensure comments aid future maintainers in understanding the code clearly and quickly.

> **Note:**
> If any ambiguity arises during implementation, clarify requirements before proceeding to ensure accurate component creation aligned with Bootstrap documentation and Svelte best practices.
