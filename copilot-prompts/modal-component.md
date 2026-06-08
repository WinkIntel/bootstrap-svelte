# Modal Component

Create a **Modal component** in `src/lib/Modal` that encapsulates all features of the Bootstrap [Modal component](https://getbootstrap.com/docs/5.3/components/modal/).

### Component Parts:

Use dot notation: `Modal.Root`, `Modal.Dialog`, `Modal.Content`, `Modal.Header`, `Modal.Title`, `Modal.Body`, `Modal.Footer`.

### Class Mappings:

- `"modal"`, `"modal-dialog"`, `"modal-content"`, `"modal-header"`, etc.

### Features & Properties:

- `Modal.Title`: add a `level` prop (`h1`–`h6`) like `Offcanvas.Title`.
- `Modal.Dialog`:
  - `isScrollable`: controls `"modal-dialog-scrollable"`.
  - `isVerticallyCentered`: controls `"modal-dialog-centered"`.
  - `size`: controls modal sizing classes (optional type).
  - `fullscreenOnBreakpoint`: handles responsive fullscreen classes.
- `Modal.Root`:
  - `useFade`: toggles `"fade"` class.
  - `static`: toggles static backdrop behavior.
  - Support `onHide`, `onHidden`, etc.
- Use `CloseButton` in `Modal.Header` like in `Offcanvas.Header`.
- Use Container component for `container`/`container-fluid`.
- Use normal HTML for Grid—Svelte components not yet created.

### Exclusions:

- Tooltips/popovers: ignore for now.
- Data attribute passing: do not emulate.
- Varying modal content: skip.

### Structure:

- Follow `Offcanvas` patterns for `index.ts`, `types.ts`, `composition.ts`.
- Avoid interfaces—use type aliases only.

### Playground Page

- Located at `src/routes/components/modal/` as `ModalPlayground.svelte`.
- Structure content in sections:
  - Basic
  - Static backdrop
  - Scrollable content
  - Vertically centered
  - Using grid
  - Toggle between modals
  - Remove fade animation
  - Fullscreen modal
- Use existing examples from `+page.svelte`.
- Include **API Reference** section.

### Unit Test

- Create tests in `src/lib/Modal/tests/`.
- Use `Offcanvas/tests/` as a template.
