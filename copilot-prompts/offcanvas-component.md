# Offcanvas Component

Create an **Offcanvas component** in `src/lib/Offcanvas` encapsulating Bootstrap's [Offcanvas component](https://getbootstrap.com/docs/5.3/components/offcanvas/).

### Dot Notation Components:

- `Offcanvas.Root`
- `Offcanvas.Header`
- `Offcanvas.Title`
- `Offcanvas.Body`

### Props:

- `placement`: `'offcanvas-start' | 'offcanvas-end' | 'offcanvas-top' | 'offcanvas-bottom'` (default: `'offcanvas-start'`)
- `bodyScrolling`: boolean
- `static`: boolean
- `breakpoint`: support responsive variants (`offcanvas-sm`, etc.)
- `Offcanvas.Title` has `level` prop for heading (`h1`–`h6`)

### Patterns:

- Follow structure from `Nav`:
  - `index.ts`, `types.ts`, `composition.ts`
  - Use type aliases, not interfaces
  - Use alias exports in `composition.ts`

### Exclusions:

- Dark theme (deprecated)

### Playground Page

- Create `OffcanvasPlayground.svelte` in `src/routes/components/offcanvas/`.
- Showcase all documented Bootstrap examples.
- Use Navbar playground as a structural reference.
