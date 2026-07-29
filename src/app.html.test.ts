import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const srcDirectory = fileURLToPath(new URL('.', import.meta.url));
const routesDirectory = join(srcDirectory, 'routes');

// Bootstrap's JS activates markup exclusively through these data-API attributes.
// `data-bs-theme` is deliberately absent: it is a CSS-only feature and stays in use.
const dataApiAttributes = ['data-bs-toggle', 'data-bs-target', 'data-bs-dismiss', 'data-bs-ride', 'data-bs-slide', 'data-bs-spy', 'data-bs-parent'];

function getSvelteFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) return getSvelteFiles(entryPath);
        return entry.name.endsWith('.svelte') ? [entryPath] : [];
    });
}

// Documentation is not live markup. Two categories of false positive exist:
// `SyntaxHighlighter` code examples, which live as template literals inside the
// `<script>` block, and `<code>` class-reference lists in docs prose.
function stripDocumentation(source: string): string {
    return source.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<code\b[\s\S]*?<\/code>/g, '');
}

describe('bootstrap JS bundle removal', () => {
    test('app.html loads no bootstrap script', () => {
        const appHtml = readFileSync(join(srcDirectory, 'app.html'), 'utf8');
        const scriptTags = appHtml.match(/<script\b[^>]*>/g) ?? [];
        const bootstrapScripts = scriptTags.filter((tag) => /\bsrc\s*=\s*["'][^"']*bootstrap[^"']*["']/.test(tag));

        expect(bootstrapScripts).toEqual([]);
    });

    test('live route markup uses no bootstrap data-API attributes', () => {
        const offenders = getSvelteFiles(routesDirectory).flatMap((filePath) => {
            const markup = stripDocumentation(readFileSync(filePath, 'utf8'));
            return dataApiAttributes
                .filter((attribute) => markup.includes(attribute))
                .map((attribute) => `${filePath.slice(srcDirectory.length)}: ${attribute}`);
        });

        expect(offenders).toEqual([]);
    });
});
