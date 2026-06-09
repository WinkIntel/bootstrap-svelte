<script lang="ts">
    import SyntaxHighlighter from '../(common)/SyntaxHighlighter.svelte';

    const cssImportCode = `import 'bootstrap/dist/css/bootstrap.min.css';`;
    const scssCode = `// app.scss
$primary: #563d7c;
$border-radius: .5rem;

@import 'bootstrap/scss/bootstrap';`;
    const themeCode = `<div data-bs-theme="dark">
    <Button colorVariant="primary">Dark themed action</Button>
</div>`;
</script>

<div>
    <div class="mb-5">
        <h1>Theming</h1>
        <p class="lead">Bootstrap Svelte follows Bootstrap's design tokens instead of shipping a separate theme layer.</p>
        <hr />
    </div>

    <section class="mb-5">
        <h2 class="wk-quick-link">Bootstrap CSS</h2>
        <p>Consumers must include Bootstrap CSS once in their application. The components emit Bootstrap-compatible classes and markup.</p>
        <SyntaxHighlighter code={cssImportCode} label="Bootstrap CSS import" />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">SCSS Variables</h2>
        <p>Override Bootstrap Sass variables before importing Bootstrap if your build pipeline compiles SCSS.</p>
        <SyntaxHighlighter code={scssCode} label="Bootstrap SCSS variables example" />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">CSS Variables and Color Modes</h2>
        <p>
            Bootstrap 5.3 exposes runtime CSS variables and supports <code>data-bs-theme</code>. Use those primitives for light, dark, or scoped theme
            regions.
        </p>
        <SyntaxHighlighter code={themeCode} label="Bootstrap data-bs-theme example" />
    </section>

    <section class="mb-5">
        <h2 class="wk-quick-link">Contrast Responsibilities</h2>
        <p>
            Some Bootstrap utility combinations, especially outline warning, outline info, and outline light on white backgrounds, can miss WCAG AA
            text contrast before hover or active states. Prefer contrast-safe combinations in production, or override the relevant Bootstrap CSS
            variables for the preview surface.
        </p>
    </section>
</div>
