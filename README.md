# Bootstrap Svelte

> Bootstrap 5 components for Svelte 5 with TypeScript support.

Bootstrap Svelte provides ready-to-use, type-safe Bootstrap components for Svelte 5 applications. It follows Bootstrap's design language and class conventions while exposing Svelte-native component APIs.

Use it when you want Bootstrap's familiar grid, utilities, and UI patterns in a Svelte app without copying Bootstrap markup by hand.

## Links

- npm: [`@winkintel/bootstrap-svelte`](https://www.npmjs.com/package/@winkintel/bootstrap-svelte)
- Repository: [`WinkIntel/bootstrap-svelte`](https://github.com/WinkIntel/bootstrap-svelte)
- Bootstrap: <https://getbootstrap.com/>
- Svelte: <https://svelte.dev/>

## Why this exists

Bootstrap is still a practical choice for many product, enterprise, and internal applications: it is familiar, well documented, stable, and easy for mixed frontend/backend teams to work with.

This package is for teams that specifically want Bootstrap in a Svelte 5 app, but would rather use maintained Svelte components than hand-roll Bootstrap's required markup and interactive behavior for every project.

It is not trying to replace Tailwind, shadcn-style workflows, or fully custom design systems.

## Features

- **Svelte 5 compatible** — built for current Svelte syntax and reactivity.
- **TypeScript support** — component props and public utilities are typed.
- **Bootstrap-oriented APIs** — keeps components close to Bootstrap's naming and mental model.
- **Modular exports** — import only the components/utilities you need.
- **Responsive by default** — designed to work with Bootstrap's responsive CSS.
- **SvelteKit-friendly project structure** — the package-local showcase/docs app lives in `src/routes`.
- **No bundled Bootstrap CSS** — consumers control their own Bootstrap CSS/SCSS pipeline.

## Requirements

- Svelte 5
- Bootstrap 5 CSS supplied by the consuming application
- A modern Svelte/Vite/SvelteKit-style build pipeline

## Installation

```bash
pnpm add @winkintel/bootstrap-svelte bootstrap

# or
npm install @winkintel/bootstrap-svelte bootstrap

# or
yarn add @winkintel/bootstrap-svelte bootstrap
```

### Peer dependency

This package requires Svelte 5:

```bash
pnpm add svelte@^5.29.0
```

## Bootstrap CSS

Bootstrap CSS is expected to be provided by your application.

Import Bootstrap CSS in your app entry point or root layout:

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

Or use Bootstrap SCSS from your app stylesheet/build pipeline:

```scss
@import 'bootstrap/scss/bootstrap';
```

## Quick start

```svelte
<script>
    import { Alert, Button, Card, Modal } from '@winkintel/bootstrap-svelte';

    let showModal = $state(false);
</script>

<Alert colorVariant="primary" isDismissible>
    Welcome to Bootstrap Svelte!
</Alert>

<Card>
    <Card.Header>
        <Card.Title>Getting Started</Card.Title>
    </Card.Header>
    <Card.Body>
        <Card.Text>This is a card built with Bootstrap Svelte components.</Card.Text>
        <Button colorVariant="primary" onclick={() => (showModal = true)}>
            Open Modal
        </Button>
    </Card.Body>
</Card>

<Modal isShown={showModal}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>Modal content goes here.</Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => (showModal = false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal>
```

## Available components

### Layout

- `Container`
- `Row`
- `Col`
- `Collapse`

### Content

- `Accordion`
- `Alert`
- `Badge`
- `Card`
- `ListGroup`
- `Placeholder`
- `Progress`
- `Spinner`
- `Table`

### Navigation

- `Breadcrumb`
- `Nav`
- `Navbar`
- `Pagination`
- `Scrollspy`
- `Tab`

### Interactive

- `Button`
- `ButtonGroup`
- `Carousel`
- `CloseButton`
- `Dropdown`
- `Modal`
- `Offcanvas`
- `Popover`
- `Toast`
- `Tooltip`

### Forms and utilities

- `Form`
- Form controls and input groups
- `Portal`
- `BreakpointListener`
- CSS/class/style utilities

## Notes for SvelteKit and SSR

Bootstrap Svelte is designed for Svelte 5 projects, including SvelteKit applications. Bootstrap CSS should be imported through the consuming app's normal CSS pipeline.

Interactive components are implemented as Svelte components rather than requiring consumers to wire Bootstrap's JavaScript snippets manually. If you find an SSR or hydration edge case, please open an issue with a minimal reproduction.

## Status and feedback

This package is published as `1.0.6`, but feedback from Svelte developers is still very welcome. Useful feedback includes:

- Component API ergonomics
- Svelte 5 idioms and runes compatibility
- Accessibility issues
- SvelteKit/SSR edge cases
- Missing Bootstrap components or variants
- README/docs gaps

Please use [GitHub Issues](https://github.com/WinkIntel/bootstrap-svelte/issues) for bugs, feature requests, and design/API feedback.

## Local development

```bash
pnpm install
pnpm dev          # starts the SvelteKit showcase on http://localhost:5176
pnpm lint
pnpm check-types
pnpm test
pnpm build
npm pack --dry-run
```

## Project structure

```text
bootstrap-svelte/
├── src/
│   ├── lib/        # component library source
│   └── routes/     # SvelteKit showcase/docs app
├── static/         # showcase static assets
├── dist/           # generated package output
└── package.json
```

## Testing

Components are tested with:

- Vitest
- `@testing-library/svelte`
- `@testing-library/jest-dom`

Example:

```typescript
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Button from './button.svelte';

test('renders button with correct variant', () => {
    render(Button, {
        props: {
            colorVariant: 'primary',
            children: createRawSnippet(() => ({
                render: () => 'Click me'
            }))
        }
    });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn btn-primary');
    expect(button).toHaveTextContent('Click me');
});
```

## TypeScript

Public types can be imported from the package:

```typescript
import type { ButtonRootProps } from '@winkintel/bootstrap-svelte';
```

## Browser support

Bootstrap Svelte targets modern browsers that support:

- Svelte 5
- Bootstrap 5
- ES2020+ JavaScript features

## License

Licensed under the [Apache License 2.0](./LICENSE.md).

Copyright 2026 Wink, Inc.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/)
- [Svelte](https://svelte.dev/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
