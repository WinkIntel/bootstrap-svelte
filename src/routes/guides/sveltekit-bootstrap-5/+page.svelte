<script lang="ts">
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    const installCode = `pnpm add @winkintel/bootstrap-svelte bootstrap`;
    const cssCode = `// src/routes/+layout.ts
import 'bootstrap/dist/css/bootstrap.min.css';

export const prerender = true;`;
    const scssCode = `// src/app.scss
@import 'bootstrap/scss/bootstrap';

// src/routes/+layout.ts
import '../app.scss';`;
    const buttonCode = `<script lang="ts">
    import { Button } from '@winkintel/bootstrap-svelte';
\u003c/script>

<Button colorVariant="primary" onclick={() => console.log('saved')}>
    Save changes
</Button>`;
    const navbarCode = `<script lang="ts">
    import { Container, Nav, Navbar } from '@winkintel/bootstrap-svelte';
\u003c/script>

<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
    <Container isFluid={true}>
        <Navbar.Brand href="/">Acme</Navbar.Brand>
        <Navbar.Toggler ariaLabel="Toggle navigation">
            <Navbar.TogglerIcon />
        </Navbar.Toggler>
        <Navbar.Collapse id="mainNavbar">
            <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                <Nav.Item><Nav.Link isActive={true} href="/">Home</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="/settings">Settings</Nav.Link></Nav.Item>
            </Navbar.Nav>
        </Navbar.Collapse>
    </Container>
</Navbar.Root>`;
    const formCode = `<script lang="ts">
    import { Button, Form } from '@winkintel/bootstrap-svelte';

    let email = $state('');
    let accepted = $state(false);
\u003c/script>

<Form.Root method="post" class="needs-validation">
    <div class="mb-3">
        <Form.InputLabel for="email">Email address</Form.InputLabel>
        <Form.EmailInput id="email" name="email" bind:value={email} aria-describedby="email-help" required />
        <Form.HelperText id="email-help">Use a work email address.</Form.HelperText>
    </div>
    <Form.Check class="mb-3">
        <Form.CheckInput id="terms" name="terms" bind:checked={accepted} required />
        <Form.CheckLabel for="terms">I accept the terms</Form.CheckLabel>
    </Form.Check>
    <Button type="submit" colorVariant="primary">Create account</Button>
</Form.Root>`;
    const modalCode = `<script lang="ts">
    import { Button, Modal } from '@winkintel/bootstrap-svelte';

    let isModalShown = $state(false);
\u003c/script>

<Button colorVariant="primary" onclick={() => (isModalShown = true)}>
    Open modal
</Button>

<Modal.Root isShown={isModalShown} onHidden={() => (isModalShown = false)}>
    <Modal.Dialog>
        <Modal.Content>
            <Modal.Header isDismissible={true}>
                <Modal.Title level={2} class="fs-5">Confirm action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Review the details before continuing.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button colorVariant="secondary" onclick={() => (isModalShown = false)}>Cancel</Button>
                <Button colorVariant="primary">Continue</Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Dialog>
</Modal.Root>`;
</script>

<div>
    <div class="mb-4">
        <h1>Use Bootstrap 5 with SvelteKit and Svelte 5</h1>
        <p class="lead">
            Add <code>@winkintel/bootstrap-svelte</code> to a SvelteKit app with Svelte 5, TypeScript/runes APIs, and Bootstrap 5 CSS while leaving Bootstrap
            JavaScript out of the bundle.
        </p>
        <hr />
    </div>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Install</h2>
        <p>Install Bootstrap Svelte and Bootstrap together. Svelte <code>^5.29.0</code> is a peer dependency supplied by your SvelteKit app.</p>
        <SyntaxHighlighter code={installCode} />
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Add Bootstrap CSS</h2>
        <p>
            Bootstrap CSS is required because the components render Bootstrap-compatible classes and markup. Import it once from the root layout or
            your app stylesheet pipeline.
        </p>
        <SyntaxHighlighter code={cssCode} label="Bootstrap CSS in a root layout module" />
        <p class="mt-3">If your SvelteKit project already compiles Sass, import Bootstrap SCSS instead.</p>
        <SyntaxHighlighter code={scssCode} label="Optional Bootstrap SCSS setup" />
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">SSR and Hydration</h2>
        <p>
            The package components are Svelte components that render during SSR and hydrate in the browser. Do not load Bootstrap's JavaScript bundle
            or individual Bootstrap plugins for the same controls; Bootstrap Svelte owns the component behavior.
        </p>
        <ul>
            <li>Keep DOM-only work in Svelte lifecycle code such as <code>onMount</code>.</li>
            <li>Use component state, for example <code>$state(false)</code>, to control modals, collapses, and offcanvas panels.</li>
            <li>Import Bootstrap CSS once so server-rendered HTML and hydrated HTML use the same class styling.</li>
        </ul>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Button Example</h2>
        <p>Use <a href="/components/button">Button</a> for typed Bootstrap button variants, sizes, links, and events.</p>
        <SyntaxHighlighter code={buttonCode} />
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Navbar Example</h2>
        <p>Use <a href="/components/navbar">Navbar</a> with <a href="/components/nav">Nav</a> and <a href="/layout/container">Container</a>.</p>
        <SyntaxHighlighter code={navbarCode} />
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Form Example</h2>
        <p>Use <a href="/form/form-controls">form controls</a> with Svelte bindings and Bootstrap validation classes.</p>
        <SyntaxHighlighter code={formCode} />
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Modal Example</h2>
        <p>Use <a href="/components/modal">Modal</a> state instead of Bootstrap JavaScript data attributes.</p>
        <SyntaxHighlighter code={modalCode} />
    </section>
</div>
