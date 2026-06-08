# Toast Component

Create a **Toast component** in `src/lib/Toast` encapsulating all the features of the Bootstrap [Toast component](https://getbootstrap.com/docs/5.3/components/toasts/).

### Requirements:

- Use dot notation: `Toast.Root`, `Toast.Header`, `Toast.Body`, `Toast.Container`, etc.
- Match each component with Bootstrap CSS classes:
  - `"toast"`, `"toast-header"`, `"toast-body"`, `"toast-container"`, etc.
- Follow existing Popover component structure (`src/lib/Popover`) including:
  - `index.ts`
  - `types.ts`
  - `composition.ts`
- Use type aliases, not interfaces.
- `composition.ts` must alias all subcomponents and prop types.
- For `Toast.Header`, integrate the `CloseButton` similarly to `Offcanvas.Header`.
- Support events like `onHide`, `onHidden`, etc. on `Toast.Root`, similar to Popover.

### Unit Test

- Create unit test files in `src/lib/Toast/tests/`.
- Use the Tooltip unit test as an example (`src/lib/Tooltip/tests/`).
- Include a `.svelte` test component and `test.ts`.

### Playground Page

- Create `ToastPlayground.svelte` in `src/routes/components/toast/`.
- Showcase all component features from Bootstrap docs.
- Use Tooltip as layout reference.
- Use `SyntaxHighlighter` for code snippets.
- Include an **API Reference** section.
