import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    build: {
        minify: process.env.NODE_ENV === 'production' // Make it easier to debug in dev mode
    },
    plugins: [sveltekit()],
    resolve: {
        dedupe: ['svelte']
    }
});
