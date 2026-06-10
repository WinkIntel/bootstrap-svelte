# Bootstrap Svelte

> Bootstrap components for Svelte 5 with TypeScript support.

Bootstrap Svelte provides ready-to-use, type-safe Bootstrap components built specifically for Svelte 5 applications. The package follows Bootstrap's design language while exposing Svelte-native component APIs.

## Features

- **Svelte 5 compatible** — built for current Svelte syntax and reactivity.
- **Bootstrap-oriented components** — implements common Bootstrap UI patterns.
- **TypeScript support** — component props and public utilities are typed.
- **Modular exports** — import only the components/utilities you need.
- **Responsive by default** — intended to work with Bootstrap's responsive CSS.
- **Package-local showcase** — the SvelteKit docs/showcase app lives in `src/routes`.

## Installation

```bash
pnpm add @winkintel/bootstrap-svelte

# or
npm install @winkintel/bootstrap-svelte

yarn add @winkintel/bootstrap-svelte
```

### Peer dependency

This package requires Svelte 5:

```bash
pnpm add svelte@~5.0.0
```

## Bootstrap CSS

Import Bootstrap CSS in your application:

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

### Navigation

- `Breadcrumb`
- `Nav`
- `Navbar`
- `Pagination`
- `Tab`

### Interactive

- `Button`
- `ButtonGroup`
- `Carousel`
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
