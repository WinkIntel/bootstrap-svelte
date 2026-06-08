# Dropdown Component

Create a **Dropdown component** located in `src/lib/Dropdown` that encapsulates all the features of the Bootstrap [Dropdown component](https://getbootstrap.com/docs/5.3/components/dropdowns/).

### Requirements:

- Compose component parts similarly to the existing Card component (`src/lib/Card`) using dot notation in the markup (`Dropdown.Root`, `Dropdown.Menu`, `Dropdown.Item`, etc.).
- Each of these subcomponents corresponds exactly to Bootstrap's CSS classes:
  - Root: `"dropdown"`
  - Menu: `"dropdown-menu"`
  - Item: `"dropdown-item"`
- Only create components for elements having the `"dropdown"` or `"dropdown-"` CSS class prefix.
- If additional CSS classes are conditionally added (e.g., `"active"` on `Dropdown.Item`), represent these through component properties:
  - `Dropdown.Item` component should have an `isActive` boolean property controlling the `"active"` CSS class.
- Follow existing structural patterns for files:
  - `index.ts`
  - `types.ts`
  - `composition.ts`
- Do **not** use interfaces; exclusively use types.
- In `composition.ts`, use aliases in exports for subcomponents and prop types. Refer to the Card component as a model for this pattern.
- Include concise, high-quality comments in source code to explain moderately complex logic, rationale, or anything non-trivial for maintainability:
  - Avoid trivial or obvious comments.
  - Use professional phrasing and best practices.

### Dropdown Playground and Demo Page

Create/update the Dropdown demo page located at `src/routes/components/dropdown/`:

- Showcase **all** features from the Bootstrap documentation on the [Dropdown component](https://getbootstrap.com/docs/5.3/components/dropdowns/).
- Include a dedicated playground page component: `DropdownPlayground.svelte`.
- Use the Spinner demo page (`src/routes/components/spinner/`) as a structural reference.
- Attempt to replicate each demo from the Bootstrap documentation accurately.
- Utilize the `SyntaxHighlighter` component to display code snippet previews.
- Generate an "API Reference" section explicitly showcasing the component properties (props).

> **Note:**
> The existing demo page (`+page.svelte`) contains useful examples drawn from Bootstrap’s documentation. Reference and reuse this code to ensure fidelity to Bootstrap examples.
