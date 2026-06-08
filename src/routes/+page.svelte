<script lang="ts">
    import SyntaxHighlighter from './(common)/SyntaxHighlighter.svelte';

    // Sample code examples for documentation
    const importExample = `import {Button, Badge} from '@winkintel/bootstrap-svelte';`;
    const buttonExample = `<script>
  import {Button} from '@winkintel/bootstrap-svelte';
\u003c/script>

<Button colorVariant="primary">Click Me</Button>
<Button colorVariant="outline-secondary">Cancel</Button>`;
</script>

<div class="wk-pb-16">
    <p class="lead">This is a Storybook-like environment built with SvelteKit to develop and showcase Bootstrap components built with Svelte 5.</p>
    <p>Select a component from the sidebar to view its documentation, examples, and API.</p>

    <h2 class="wk-quick-link mt-4">Getting Started</h2>
    <p>To use these components in your project, import them from the library:</p>
    <SyntaxHighlighter code={importExample} />

    <h2 class="wk-quick-link mt-4">Development</h2>
    <p>This environment allows you to:</p>
    <ul>
        <li>View components in isolation</li>
        <li>Explore different component states</li>
        <li>View component documentation</li>
        <li>Test component interactions</li>
    </ul>

    <h2 class="wk-quick-link mt-4">Run Locally While Developing</h2>
    <p>To run this documentation site locally while developing components to easily reference utilities and components.</p>
    <ol>
        <li>Navigate to the <code>bootstrap-svelte</code> directory</li>
        <li>Open in <code>Integrated Terminal</code></li>
        <li>Run <code>pnpm install && pnpm dev</code> to install dependencies and start the development server</li>
        <li>Open <code>http://localhost:5176</code> in your browser</li>
    </ol>
    <h2 class="wk-quick-link mt-4">Standalone Package</h2>
    <p>Bootstrap Svelte is maintained as a standalone Svelte 5 component package.</p>
    <ul>
        <li><strong>Library source</strong>: components live in <code>src/lib</code></li>
        <li><strong>Showcase source</strong>: documentation and examples live in <code>src/routes</code></li>
    </ul>
    <p>When developing components, keep public package consumers in mind and avoid app-specific assumptions.</p>

    <h2 class="wk-quick-link mt-4">Component Usage Examples</h2>
    <p>Here's a basic example of using a Button component:</p>
    <SyntaxHighlighter code={buttonExample} />

    <h2 class="wk-quick-link mt-4">API Documentation</h2>
    <p>Each component has a dedicated API documentation page accessible through the sidebar. The documentation includes:</p>
    <ul>
        <li>Props and their types</li>
        <li>Events</li>
        <li>Snippets</li>
        <li>CSS classes, variables and customization options</li>
    </ul>
</div>
