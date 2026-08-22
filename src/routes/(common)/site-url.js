// @ts-check
// Plain JavaScript so that svelte.config.js and the Vercel middleware (neither of which can load TypeScript) share it with the app.

export const SITE_URL = 'https://bootstrap-svelte.vercel.app';

/**
 * Path of the Markdown representation of a page: `/` → `/index.md`, `/components/button` → `/components/button.md`.
 * @param {string} pathname
 * @returns {string}
 */
export function markdownPath(pathname) {
    return pathname === '/' ? '/index.md' : `${pathname}.md`;
}
