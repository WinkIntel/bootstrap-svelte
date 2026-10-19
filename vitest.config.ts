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
        coverage: {
            provider: 'v8',
            include: ['src/lib/**'],
            exclude: ['src/lib/**/*.{test,spec}.{js,ts}', 'src/lib/**/tests/**'],
            reporter: ['text', 'json-summary'],
            // Combined client/server baseline on 732c1d7 (Node 26):
            // 94.20% lines, 85.73% branches. Svelte source-map lines are approximate;
            // use aggregate coverage as a regression floor, not a substitute for behavior tests.
            thresholds: { lines: 94, branches: 85 }
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
