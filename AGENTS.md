# AGENTS.md — bootstrap-svelte

AI assistant guidance for the standalone Bootstrap Svelte component library.

## Overview

A comprehensive Svelte 5 component library implementing the Bootstrap design system with full TypeScript support.

Package name: `@winkintel/bootstrap-svelte`.

Consumer install command: `pnpm add @winkintel/bootstrap-svelte bootstrap`.

Svelte peer dependency: `svelte ^5.29.0`.

## Quick Reference

```bash
pnpm dev                  # Component showcase/dev server (port 5176)
pnpm build                # Build showcase + package output
pnpm check-types          # Svelte + TypeScript checks
pnpm lint                 # Prettier check + ESLint
pnpm test:unit            # Run unit tests
npm pack --dry-run        # Inspect npm package contents
```

## Component Architecture

Most components use a compound pattern with a `Root` component and sub-components:

```svelte
<script>
    import { Button, Card, Dropdown, Modal } from '@winkintel/bootstrap-svelte';
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Title</Card.Title>
    </Card.Header>
    <Card.Body>
        <Card.Text>Content</Card.Text>
    </Card.Body>
    <Card.Footer>Footer</Card.Footer>
</Card.Root>

<Modal.Root isShown={showModal}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>Content</Modal.Body>
            <Modal.Footer>
                <Button onclick={() => (showModal = false)}>Close</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>

<Dropdown.Root>
    <Dropdown.Toggle>Menu</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item href="/link">Link</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onclick={handleClick}>Action</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown.Root>
```

Standalone components include `Alert`, `Badge`, `Button`, and `Spinner`.

## Gotchas & Tips

### Dropdown.Root Display Property

When using `Dropdown.Root` inline with other elements, prefer `d-inline-block` so the menu has a proper positioning box:

```svelte
<Dropdown.Root class="d-inline-block">
    <Dropdown.Toggle>Menu</Dropdown.Toggle>
    <Dropdown.Menu>...</Dropdown.Menu>
</Dropdown.Root>
```

## CSS Import

Consumers must import Bootstrap CSS in their application:

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

Or with SCSS:

```scss
@import 'bootstrap/scss/bootstrap';
```

## TypeScript

All components are typed. Import public types from the package root. Standalone component props use flat type exports, and compound component props are exposed from their namespaces:

```typescript
import type { ButtonRootProps, Card, Modal } from '@winkintel/bootstrap-svelte';

const buttonProps: ButtonRootProps = { colorVariant: 'primary' };
const cardRootProps: Card.RootProps = { class: 'shadow-sm' };
const modalRootProps: Modal.RootProps = { isShown: true };
```
