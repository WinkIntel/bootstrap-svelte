/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import SyntaxHighlighter from './SyntaxHighlighter.svelte';

describe('SyntaxHighlighter', () => {
    test('renders a named focusable code region', () => {
        const { container } = render(SyntaxHighlighter, {
            props: {
                code: '<Button>Save</Button>',
                label: 'Button usage example'
            }
        });

        const codeRegion = screen.getByLabelText('Button usage example');
        expect(codeRegion).toHaveAttribute('tabindex', '0');
        expect(container.querySelector('.wk-code-lang')).toHaveTextContent('svelte');
        expect(container.querySelector('pre')).toHaveAttribute('data-language', 'html');
    });

    test('renders and highlights bash examples when requested', () => {
        const { container } = render(SyntaxHighlighter, {
            props: {
                code: 'echo "$HOME"',
                language: 'bash'
            }
        });

        expect(container.querySelector('.wk-code-lang')).toHaveTextContent('bash');
        expect(container.querySelector('pre')).toHaveAttribute('data-language', 'bash');
        expect(container.querySelector('code')).toHaveTextContent('echo "$HOME"');
        expect(container.querySelector('code .hljs-variable')).toHaveTextContent('$HOME');
    });

    test('copies code with accessible feedback', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText }
        });

        render(SyntaxHighlighter, {
            props: {
                code: '<Button>Save</Button>',
                label: 'Button usage example'
            }
        });

        await fireEvent.click(screen.getByRole('button', { name: 'Copy button usage example' }));

        expect(writeText).toHaveBeenCalledWith('<Button>Save</Button>');
        expect(screen.getByText('Code copied to clipboard.')).toBeInTheDocument();
    });
});
