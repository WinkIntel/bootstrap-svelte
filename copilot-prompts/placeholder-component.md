# Placeholder Component

Create a **Placeholder component** in `src/lib/Placeholder` to encapsulate Bootstrap [Placeholder features](https://getbootstrap.com/docs/5.3/components/placeholders/).

### Components:

- `Placeholder.Root`
- `Placeholder.Item`

### Class Mapping:

- Root uses `placeholder-glow` or `placeholder-wave`.
- Item uses `"placeholder"`.

### Props:

- `type`: `'glow' | 'wave'` (default: `'glow'`)

### Patterns:

- Follow `ListGroup` component structure:
  - `index.ts`, `types.ts`, `composition.ts`
  - Use alias exports in `composition.ts`
- Create unit test: `placeholder.svelte.test.ts` in `src/lib/Placeholder/tests/`

### Playground Page

- Create `PlaceholderPlayground.svelte` in `src/routes/components/placeholder/`.
- Showcase all features as per Bootstrap docs.
- Reference structure from ListGroup playground.
- Update home navigation to include the new placeholder route.
