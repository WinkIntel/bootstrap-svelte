/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('/guides/sveltekit-bootstrap-5/+page.svelte', () => {
    test('marks the package install command as bash', () => {
        render(Page);

        const installSection = screen.getByRole('heading', { name: 'Install' }).closest('section');
        expect(installSection?.querySelector('.wk-code-lang')).toHaveTextContent('bash');
        expect(installSection?.querySelector('pre')).toHaveAttribute('data-language', 'bash');
        expect(installSection).toHaveTextContent('pnpm add @winkintel/bootstrap-svelte bootstrap');
    });
});
