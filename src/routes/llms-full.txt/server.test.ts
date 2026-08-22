import { describe, expect, test } from 'vitest';
import { GET, prerender } from './+server.js';

describe('llms-full.txt endpoint', () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('serves every page in one plain-text Markdown document', async () => {
        const response = await GET({} as unknown as Parameters<typeof GET>[0]);
        const text = await response.text();
        expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
        expect(text.startsWith('# Bootstrap Svelte — full documentation\n')).toBe(true);
        expect(text).toContain('\n# Button\n');
        expect(text).toContain('\n# Theming\n');
        expect(text).toContain('\n# About Bootstrap Svelte\n');
    });
});
