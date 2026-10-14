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

describe('showcase resources and pre-paint theme', () => {
    const html = readFileSync(join(srcDirectory, 'app.html'), 'utf8');
    test('pins every jsDelivr stylesheet with SRI and anonymous CORS', () => {
        const links = html.match(/<link\b[^>]*cdn\.jsdelivr\.net[^>]*>/g) ?? [];
        expect(links).toHaveLength(2);
        for (const link of links) {
            expect(link).toMatch(/integrity="sha384-[A-Za-z0-9+/=]+"/);
            expect(link).toContain('crossorigin="anonymous"');
        }
    });
    test.each([
        ['light', true, 'light'],
        ['dark', false, 'dark'],
        ['auto', true, 'dark'],
        [null, false, 'light'],
        ['invalid', true, 'dark']
    ])('resolves stored %s and system dark %s before hydration', (stored, dark, expected) => {
        const script = html.match(/<script id="color-mode">([\s\S]*?)<\/script>/)?.[1];
        expect(script).toBeTruthy();
        const root = { documentElement: { dataset: { bsTheme: '' } } };
        new Function('document', 'localStorage', 'matchMedia', script!)(root, { getItem: () => stored }, () => ({ matches: dark }));
        expect(root.documentElement.dataset.bsTheme).toBe(expected);
        expect(html.indexOf('id="color-mode"')).toBeLessThan(html.indexOf('rel="stylesheet"'));
    });
    test('uses system preference when storage is blocked', () => {
        const script = html.match(/<script id="color-mode">([\s\S]*?)<\/script>/)?.[1];
        expect(script).toBeTruthy();
        const root = { documentElement: { dataset: { bsTheme: '' } } };
        new Function('document', 'localStorage', 'matchMedia', script!)(
            root,
            {
                getItem: () => {
                    throw new Error('Blocked');
                }
            },
            () => ({ matches: true })
        );
        expect(root.documentElement.dataset.bsTheme).toBe('dark');
    });
    test('showcase images and examples no longer request external placeholder hosts', () => {
        for (const file of getSvelteFiles(routesDirectory)) {
            expect(readFileSync(file, 'utf8')).not.toMatch(/https:\/\/(?:placehold\.co|www\.w3schools\.com\/tags\/img_submit)/);
        }
    });
});
