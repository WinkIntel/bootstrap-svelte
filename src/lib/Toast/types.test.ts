import { describe, expect, it } from 'vitest';
import { transformToastPlacement, type ToastPlacement } from './types.js';

describe('Toast types', () => {
    describe('transformToastPlacement', () => {
        it('should return the correct class for top-start position', () => {
            const position: ToastPlacement = 'top-start';
            expect(transformToastPlacement(position)).toBe('top-0 start-0');
        });

        it('should return the correct class for top-center position', () => {
            const position: ToastPlacement = 'top-center';
            expect(transformToastPlacement(position)).toBe('top-0 start-50 translate-middle-x');
        });

        it('should return the correct class for top-end position', () => {
            const position: ToastPlacement = 'top-end';
            expect(transformToastPlacement(position)).toBe('top-0 end-0');
        });

        it('should return the correct class for middle-start position', () => {
            const position: ToastPlacement = 'middle-start';
            expect(transformToastPlacement(position)).toBe('top-50 start-0 translate-middle-y');
        });

        it('should return the correct class for middle-center position', () => {
            const position: ToastPlacement = 'middle-center';
            expect(transformToastPlacement(position)).toBe('top-50 start-50 translate-middle');
        });

        it('should return the correct class for middle-end position', () => {
            const position: ToastPlacement = 'middle-end';
            expect(transformToastPlacement(position)).toBe('top-50 end-0 translate-middle-y');
        });

        it('should return the correct class for bottom-start position', () => {
            const position: ToastPlacement = 'bottom-start';
            expect(transformToastPlacement(position)).toBe('bottom-0 start-0');
        });

        it('should return the correct class for bottom-center position', () => {
            const position: ToastPlacement = 'bottom-center';
            expect(transformToastPlacement(position)).toBe('bottom-0 start-50 translate-middle-x');
        });

        it('should return the correct class for bottom-end position', () => {
            const position: ToastPlacement = 'bottom-end';
            expect(transformToastPlacement(position)).toBe('bottom-0 end-0');
        });
    });
});
