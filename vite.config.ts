import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const { version: packageVersion } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
    build: {
        minify: process.env.NODE_ENV === 'production' // Make it easier to debug in dev mode
    },
    define: {
        // Exposes the package version to the showcase (JSON-LD, about page) without bundling package.json.
        __PACKAGE_VERSION__: JSON.stringify(packageVersion)
    },
    plugins: [sveltekit()],
    resolve: {
        dedupe: ['svelte']
    }
});
