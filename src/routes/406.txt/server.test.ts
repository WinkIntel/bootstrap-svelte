import { describe, expect, test } from 'vitest';
import { GET, prerender } from './+server.js';

describe('406.txt endpoint', () => {
    test('is prerendered', () => {
        expect(prerender).toBe(true);
    });

    test('serves the Not Acceptable explanation as plain text', async () => {
        const response = await GET({} as unknown as Parameters<typeof GET>[0]);
        expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
        expect(await response.text()).toContain('text/markdown');
    });
});
