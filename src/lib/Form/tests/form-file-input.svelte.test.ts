/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import FileInput from '../form-file-input.svelte';
import FileInputBindingTest from './form-file-input-binding-test.svelte';

describe('Form.FileInput', () => {
    test('binds a user-selected platform FileList instead of a value attribute', async () => {
        render(FileInputBindingTest);
        const input = screen.getByTestId('file-input') as HTMLInputElement;
        const user = userEvent.setup();
        const file = new File(['photo'], 'photo.png', { type: 'image/png' });

        await user.upload(input, file);

        expect(input).not.toHaveAttribute('value');
        expect(input.files).toHaveLength(1);
        expect(input.files?.[0]).toBe(file);
        expect(screen.getByTestId('bound-file-name')).toHaveTextContent('photo.png');
        expect(screen.getByTestId('callback-file-name')).toHaveTextContent('photo.png');
    });

    test('syncs parent-driven file replacement and clearing to the DOM files property', async () => {
        render(FileInputBindingTest);
        const input = screen.getByTestId('file-input') as HTMLInputElement;
        const replacementSource = screen.getByTestId('replacement-file-source') as HTMLInputElement;
        const user = userEvent.setup();

        await user.upload(replacementSource, new File(['replacement'], 'replacement.txt', { type: 'text/plain' }));
        // userEvent installs a getter-only FileList shim; make the target writable
        // so this test can exercise parent-to-DOM propagation in jsdom.
        Object.defineProperty(input, 'files', { configurable: true, value: input.files, writable: true });

        await fireEvent.click(screen.getByTestId('set-files'));

        expect(screen.getByTestId('bound-file-name')).toHaveTextContent('replacement.txt');
        expect(input.files?.[0]?.name).toBe('replacement.txt');

        await fireEvent.click(screen.getByTestId('clear-files'));

        expect(screen.getByTestId('bound-file-name')).toHaveTextContent('none');
        expect(input.files).toBeNull();
    });

    test('normalizes malformed parent files without throwing and clears the native selection', async () => {
        render(FileInputBindingTest);
        const input = screen.getByTestId('file-input') as HTMLInputElement;
        const user = userEvent.setup();

        await user.upload(input, new File(['photo'], 'photo.png', { type: 'image/png' }));
        expect(input.files).toHaveLength(1);

        await expect(fireEvent.click(screen.getByTestId('set-malformed-files'))).resolves.toBe(true);

        expect(screen.getByTestId('bound-file-name')).toHaveTextContent('none');
        expect(input.files).toHaveLength(0);
    });

    test('does not allow rest props to replace the file type or validation aria state', () => {
        const { container } = render(FileInput, {
            props: { isInvalid: true, type: 'text', value: 'not-allowed', 'aria-invalid': 'false' } as never
        });
        const input = container.querySelector('input') as HTMLInputElement;

        expect(input).toHaveAttribute('type', 'file');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).not.toHaveAttribute('value');
        expect(input.value).toBe('');
    });
    test('renders input with type file and default form-control class', () => {
        const { container } = render(FileInput);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('form-control');
    });

    test('merges custom classes with base classes', () => {
        const { container } = render(FileInput, {
            props: {
                class: 'custom-class another-class'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('another-class');
    });

    test('applies is-valid class when isValid is true', () => {
        const { container } = render(FileInput, {
            props: {
                isValid: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('is-valid');
    });

    test('does not apply is-valid class when isValid is undefined', () => {
        const { container } = render(FileInput);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-valid');
    });

    test('applies is-invalid class when isInvalid is true', () => {
        const { container } = render(FileInput, {
            props: {
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('is-invalid');
    });

    test('does not apply is-invalid class when isInvalid is undefined', () => {
        const { container } = render(FileInput);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).not.toHaveClass('is-invalid');
    });

    test('isInvalid and isValid can both be applied when provided (independent)', () => {
        const { container } = render(FileInput, {
            props: {
                isValid: true,
                isInvalid: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        // Both flags operate independently now: both classes should be present when both are true
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('is-valid');
    });

    test('when isValid is false and isInvalid is undefined, no validation classes are applied', () => {
        const { container } = render(FileInput, {
            props: {
                isValid: false
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        // Validation flags are independent: false/undefined should not add validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('is-valid');
    });

    test('applies small sizing class when sizing is sm', () => {
        const { container } = render(FileInput, {
            props: {
                sizing: 'sm'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-sm');
    });

    test('applies large sizing class when sizing is lg', () => {
        const { container } = render(FileInput, {
            props: {
                sizing: 'lg'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control-lg');
    });

    test('does not apply sizing class when sizing is undefined', () => {
        const { container } = render(FileInput);
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).not.toHaveClass('form-control-sm');
        expect(input).not.toHaveClass('form-control-lg');
    });

    test('forwards id attribute to input', () => {
        const { container } = render(FileInput, {
            props: {
                id: 'file-upload'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('id', 'file-upload');
    });

    test('forwards name attribute to input', () => {
        const { container } = render(FileInput, {
            props: {
                name: 'upload-file'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('name', 'upload-file');
    });

    test('forwards disabled attribute to input', () => {
        const { container } = render(FileInput, {
            props: {
                disabled: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('disabled');
        expect(input.disabled).toBe(true);
    });

    test('forwards accept attribute to input', () => {
        const { container } = render(FileInput, {
            props: {
                accept: '.png,.jpg,image/png,image/jpeg'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('accept', '.png,.jpg,image/png,image/jpeg');
    });

    test('forwards multiple attribute to input', () => {
        const { container } = render(FileInput, {
            props: {
                multiple: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('multiple');
        expect(input.multiple).toBe(true);
    });

    test('forwards capture attribute to input', () => {
        const { container } = render(FileInput, {
            props: {
                capture: 'environment'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('capture', 'environment');
    });

    test('forwards accessibility attributes to input', () => {
        const { container } = render(FileInput, {
            props: {
                'aria-label': 'Upload files',
                'aria-describedby': 'file-help'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('aria-label', 'Upload files');
        expect(input).toHaveAttribute('aria-describedby', 'file-help');
    });

    test('forwards data attributes to input', () => {
        const { container } = render(FileInput, {
            props: {
                'data-testid': 'file-input',
                'data-custom': 'custom-value'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('data-testid', 'file-input');
        expect(input).toHaveAttribute('data-custom', 'custom-value');
    });

    test('forwards title attribute to input', () => {
        const { container } = render(FileInput, {
            props: {
                title: 'Choose files to upload'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('title', 'Choose files to upload');
    });

    test('combines sizing with validation classes', () => {
        const { container } = render(FileInput, {
            props: {
                sizing: 'lg',
                isValid: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
    });

    test('combines sizing with custom classes', () => {
        const { container } = render(FileInput, {
            props: {
                sizing: 'sm',
                class: 'custom-file-input'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-sm');
        expect(input).toHaveClass('custom-file-input');
    });

    test('handles various file types in accept attribute', () => {
        const testAcceptValues = ['.pdf,.doc,.docx', 'image/*', 'audio/*,video/*', '.txt,.csv,.json', 'application/pdf,text/plain'];

        testAcceptValues.forEach((accept) => {
            const { container } = render(FileInput, {
                props: {
                    accept
                }
            });
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;

            expect(input).toHaveAttribute('accept', accept);
        });
    });

    test('handles all combinations of validation states', () => {
        // Test all possible combinations
        const combinations = [
            { isValid: undefined, isInvalid: undefined, expectValid: false, expectInvalid: false },
            { isValid: true, isInvalid: undefined, expectValid: true, expectInvalid: false },
            { isValid: false, isInvalid: undefined, expectValid: false, expectInvalid: false },
            { isValid: undefined, isInvalid: true, expectValid: false, expectInvalid: true },
            { isValid: undefined, isInvalid: false, expectValid: false, expectInvalid: false }
        ];

        combinations.forEach(({ isValid, isInvalid, expectValid, expectInvalid }) => {
            const { container } = render(FileInput, {
                props: {
                    isValid,
                    isInvalid
                }
            });
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;

            if (expectValid) {
                expect(input).toHaveClass('is-valid');
            } else {
                expect(input).not.toHaveClass('is-valid');
            }

            if (expectInvalid) {
                expect(input).toHaveClass('is-invalid');
            } else {
                expect(input).not.toHaveClass('is-invalid');
            }
        });
    });

    test('renders with all props combined', () => {
        const { container } = render(FileInput, {
            props: {
                id: 'document-upload',
                name: 'documents',
                sizing: 'lg',
                isValid: true,
                disabled: false,
                multiple: true,
                accept: '.pdf,.doc,.docx',
                title: 'Upload documents',
                class: 'custom-file-input',
                'data-testid': 'document-uploader'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-lg');
        expect(input).toHaveClass('is-valid');
        expect(input).toHaveClass('custom-file-input');
        expect(input).toHaveAttribute('id', 'document-upload');
        expect(input).toHaveAttribute('name', 'documents');
        expect(input).toHaveAttribute('title', 'Upload documents');
        expect(input).toHaveAttribute('accept', '.pdf,.doc,.docx');
        expect(input).toHaveAttribute('data-testid', 'document-uploader');
        expect(input.disabled).toBe(false);
        expect(input.multiple).toBe(true);
    });

    test('handles required attribute', () => {
        const { container } = render(FileInput, {
            props: {
                required: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('required');
        expect(input.required).toBe(true);
    });

    test('handles form attribute', () => {
        const { container } = render(FileInput, {
            props: {
                form: 'upload-form'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('form', 'upload-form');
    });

    test('handles capture attribute variations', () => {
        const captureValues: ('user' | 'environment')[] = ['user', 'environment'];

        captureValues.forEach((capture) => {
            const { container } = render(FileInput, {
                props: {
                    capture
                }
            });
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;

            expect(input).toHaveAttribute('capture', capture);
        });
    });

    test('supports webkitdirectory attribute for directory uploads', () => {
        const { container } = render(FileInput, {
            props: {
                webkitdirectory: true
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('webkitdirectory');
    });

    test('always applies form-control class regardless of other props', () => {
        const { container } = render(FileInput, {
            props: {
                sizing: 'sm',
                isInvalid: true,
                class: 'custom-class'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('form-control-sm');
        expect(input).toHaveClass('is-invalid');
        expect(input).toHaveClass('custom-class');
    });

    test('validates that only one sizing class is applied at a time', () => {
        const sizingTests: Array<{ sizing: 'sm' | 'lg' | undefined; expected: string | null; notExpected: string | string[] }> = [
            { sizing: 'sm', expected: 'form-control-sm', notExpected: 'form-control-lg' },
            { sizing: 'lg', expected: 'form-control-lg', notExpected: 'form-control-sm' },
            { sizing: undefined, expected: null, notExpected: ['form-control-sm', 'form-control-lg'] }
        ];

        sizingTests.forEach(({ sizing, expected, notExpected }) => {
            const { container } = render(FileInput, {
                props: { sizing }
            });
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;

            if (expected) {
                expect(input).toHaveClass(expected);
            }

            if (Array.isArray(notExpected)) {
                notExpected.forEach((cls) => {
                    expect(input).not.toHaveClass(cls);
                });
            } else if (notExpected) {
                expect(input).not.toHaveClass(notExpected);
            }
        });
    });

    test('updates the bound files before forwarding the consumer change handler', async () => {
        const onchange = vi.fn((event: Event) => (event.currentTarget as HTMLInputElement).files?.[0]?.name);
        const { container } = render(FileInput, {
            props: { onchange }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(['event'], 'event.txt', { type: 'text/plain' });

        await userEvent.upload(input, file);

        expect(input.files?.[0]).toBe(file);
        expect(onchange).toHaveBeenCalledTimes(1);
        expect(onchange).toHaveReturnedWith('event.txt');
    });

    test('supports tabindex attribute', () => {
        const { container } = render(FileInput, {
            props: {
                tabindex: 5
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveAttribute('tabindex', '5');
    });

    test('combines validation with multiple file selection', () => {
        const { container } = render(FileInput, {
            props: {
                multiple: true,
                isValid: true,
                accept: 'image/*'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        expect(input).toHaveClass('form-control');
        expect(input).toHaveClass('is-valid');
        expect(input.multiple).toBe(true);
        expect(input).toHaveAttribute('accept', 'image/*');
    });

    test('applies all Bootstrap file input classes correctly', () => {
        const { container } = render(FileInput, {
            props: {
                sizing: 'lg',
                isValid: true,
                class: 'additional-class'
            }
        });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        // Verify all expected classes are present
        expect(input.className).toContain('form-control');
        expect(input.className).toContain('form-control-lg');
        expect(input.className).toContain('is-valid');
        expect(input.className).toContain('additional-class');

        // Verify no unexpected validation classes
        expect(input).not.toHaveClass('is-invalid');
        expect(input).not.toHaveClass('form-control-sm');
    });

    // aria-invalid attribute tests
    test('sets aria-invalid to true when isInvalid is true', () => {
        const { container } = render(FileInput, {
            props: {
                isInvalid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when isValid is true', () => {
        const { container } = render(FileInput, {
            props: {
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'false');
    });

    test('does not render aria-invalid when neither isValid nor isInvalid are set', () => {
        const { container } = render(FileInput);

        const field = container.querySelector('input') as HTMLElement;
        expect(field).not.toHaveAttribute('aria-invalid');
    });

    test('aria-invalid is true when isInvalid is true even if isValid is also true', () => {
        const { container } = render(FileInput, {
            props: {
                isInvalid: true,
                isValid: true
            }
        });

        const field = container.querySelector('input') as HTMLElement;
        expect(field).toHaveAttribute('aria-invalid', 'true');
    });
});
