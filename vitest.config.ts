import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig({
    ...viteConfig,
    test: {
        onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
            // Ignore invalid_raw_snippet_render errors...
            return !(log.startsWith('[svelte] invalid_raw_snippet_render') && type === 'stderr');
        },
        projects: [
            {
                extends: './vite.config.ts',
                plugins: [svelteTesting()],
                test: {
                    name: 'client',
                    environment: 'jsdom',
                    globals: true,
                    clearMocks: true,
                    include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
                    exclude: ['src/lib/server/**'],
                    setupFiles: ['./vitest-setup-client.ts']
                }
            },
            {
                extends: './vite.config.ts',
                test: {
                    name: 'server',
                    environment: 'node',
                    include: ['src/**/*.{test,spec}.{js,ts}'],
                    exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
                }
            }
        ]
    }
});
