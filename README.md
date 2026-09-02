# Bootstrap Svelte

[![npm version](https://img.shields.io/npm/v/@winkintel/bootstrap-svelte.svg)](https://www.npmjs.com/package/@winkintel/bootstrap-svelte)
[![weekly downloads](https://img.shields.io/npm/dw/@winkintel/bootstrap-svelte.svg)](https://www.npmjs.com/package/@winkintel/bootstrap-svelte)
[![CI](https://github.com/WinkIntel/bootstrap-svelte/actions/workflows/ci.yml/badge.svg)](https://github.com/WinkIntel/bootstrap-svelte/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@winkintel/bootstrap-svelte.svg)](https://github.com/WinkIntel/bootstrap-svelte/blob/main/LICENSE.md)
[![documentation](https://img.shields.io/badge/docs-bootstrap--svelte.vercel.app-7952b3.svg)](https://bootstrap-svelte.vercel.app/)

> Bootstrap 5 components for Svelte 5 with TypeScript support.

Bootstrap Svelte provides ready-to-use, type-safe Bootstrap components for Svelte 5 applications. It follows Bootstrap's design language and class conventions while exposing Svelte-native component APIs.

Use it when you want Bootstrap's familiar grid, utilities, and UI patterns in a Svelte app without copying Bootstrap markup by hand.

## Links

- Documentation: <https://bootstrap-svelte.vercel.app/>
- npm: [`@winkintel/bootstrap-svelte`](https://www.npmjs.com/package/@winkintel/bootstrap-svelte)
- Repository: [`WinkIntel/bootstrap-svelte`](https://github.com/WinkIntel/bootstrap-svelte)
- Bootstrap: <https://getbootstrap.com/>
- Svelte: <https://svelte.dev/>

## Machine-readable documentation

The showcase at <https://bootstrap-svelte.vercel.app> is published for AI agents and tools as well as people:

- `/llms.txt` indexes every page with one-line summaries ([llms.txt format](https://llmstxt.org)); `/llms-full.txt` bundles every page into one Markdown file.
- Every page is available as Markdown from its own URL with `Accept: text/markdown` (quality values are honored; the response carries `Vary: Accept` and a `Link` alternate header), or by appending `.md` to the path, for example `/components/button.md`.
- `/agents.md` explains when to use the library and how to integrate it; `/sitemap.xml` and `/robots.txt` serve crawlers, and `pnpm indexnow` pushes changed URLs to Bing and the other [IndexNow](https://www.indexnow.org/) engines after a deploy.
- Paths that do not exist return a real HTTP 404 with a Markdown or HTML body that links back to the documentation index.

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

This package requires Svelte `^5.29.0` as a peer dependency. Keep Svelte installed in your application; do not replace the package/bootstrap install command with a Svelte install command.

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

<Alert colorVariant="primary" isDismissible>Welcome to Bootstrap Svelte!</Alert>

<Card.Root>
    <Card.Header>
        <Card.Title>Getting Started</Card.Title>
    </Card.Header>
    <Card.Body>
        <Card.Text>This is a card built with Bootstrap Svelte components.</Card.Text>
        <Button colorVariant="primary" onclick={() => (showModal = true)}>Open Modal</Button>
    </Card.Body>
</Card.Root>

<Modal.Root isShown={showModal}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>Modal content goes here.</Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => (showModal = false)}>Close</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>
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

This package is published as `1.0.10`, but feedback from Svelte developers is still very welcome. Useful feedback includes:

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
