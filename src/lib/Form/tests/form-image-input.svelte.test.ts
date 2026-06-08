/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FormImageInput from '../form-image-input.svelte';

describe('FormImageInput', () => {
    describe('Rendering', () => {
        it('should render an input element with type image', () => {
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test'
            });

            const imageInput = document.querySelector('input[type="image"]');
            expect(imageInput).toBeInTheDocument();
        });

        it('should render with src attribute when provided', () => {
            const testSrc = '/path/to/image.png';
            render(FormImageInput, {
                src: testSrc,
                alt: 'Test'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.src).toContain(testSrc);
        });

        it('should render with alt attribute when provided', () => {
            const testAlt = 'Test description';
            render(FormImageInput, {
                src: '/test.png',
                alt: testAlt
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.alt).toBe(testAlt);
        });

        it('should render without any default classes', () => {
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.className).toBe('');
        });
    });

    describe('Class Handling', () => {
        it('should apply additional classes when class prop is provided', () => {
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                class: 'custom-class'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.classList.contains('custom-class')).toBe(true);
        });

        it('should apply multiple additional classes', () => {
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                class: 'class1 class2 class3'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.classList.contains('class1')).toBe(true);
            expect(imageInput?.classList.contains('class2')).toBe(true);
            expect(imageInput?.classList.contains('class3')).toBe(true);
        });
    });

    describe('Image Properties', () => {
        it('should support width attribute', () => {
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                width: 100
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.getAttribute('width')).toBe('100');
        });

        it('should support height attribute', () => {
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                height: 50
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.getAttribute('height')).toBe('50');
        });
    });

    describe('Form Integration', () => {
        it('should support name attribute for form submission', () => {
            const testName = 'submit-button';
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                name: testName
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.getAttribute('name')).toBe(testName);
        });

        it('should support disabled attribute', () => {
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                disabled: true
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.disabled).toBe(true);
        });

        it('should support formaction attribute', () => {
            const testAction = '/submit-action';
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                formaction: testAction
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.getAttribute('formaction')).toBe(testAction);
        });
    });

    describe('Accessibility', () => {
        it('should support aria-label attribute', () => {
            const testLabel = 'Submit form';
            render(FormImageInput, {
                src: '/test.png',
                alt: 'Test',
                'aria-label': testLabel
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.getAttribute('aria-label')).toBe(testLabel);
        });
    });

    describe('Use Cases', () => {
        it('should work as a submit button with custom image', () => {
            render(FormImageInput, {
                src: '/images/submit.png',
                alt: 'Submit',
                width: 100,
                height: 40,
                name: 'submit-btn'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.src).toContain('/images/submit.png');
            expect(imageInput?.alt).toBe('Submit');
            expect(imageInput?.getAttribute('width')).toBe('100');
            expect(imageInput?.getAttribute('height')).toBe('40');
        });

        it('should work for login forms', () => {
            render(FormImageInput, {
                src: '/icons/login.svg',
                alt: 'Log In',
                formaction: '/login',
                formmethod: 'POST'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.src).toContain('/icons/login.svg');
            expect(imageInput?.getAttribute('formaction')).toBe('/login');
            expect(imageInput?.getAttribute('formmethod')).toBe('POST');
        });
    });

    describe('Edge Cases', () => {
        it('should handle missing src attribute gracefully', () => {
            render(FormImageInput, {
                alt: 'Missing Source'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput).toBeInTheDocument();
            expect(imageInput?.alt).toBe('Missing Source');
        });

        it('should handle data URLs', () => {
            const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
            render(FormImageInput, {
                src: dataUrl,
                alt: 'Data URL Image'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.src).toBe(dataUrl);
        });

        it('should handle relative URLs', () => {
            const relativeSrc = '../images/button.png';
            render(FormImageInput, {
                src: relativeSrc,
                alt: 'Button'
            });

            const imageInput = document.querySelector('input[type="image"]') as HTMLInputElement;
            expect(imageInput?.getAttribute('src')).toBe(relativeSrc);
        });
    });
});
