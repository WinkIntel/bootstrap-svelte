import { describe, expect, test } from 'vitest';
import { cubicBezier, ease, easeIn, easeInOut, easeOut, fromStyle, toStyle, uniqueClsx } from './css.js';

describe('css.js', () => {
    // Easing function tests
    describe('easing functions', () => {
        // Test for ease function
        describe('ease function', () => {
            test('should return 0 for input 0', () => {
                expect(ease(0)).toBe(0);
            });

            test('should return 1 for input 1', () => {
                expect(ease(1)).toBe(1);
            });

            test('should return proper interpolated values', () => {
                const result = ease(0.5);
                expect(result).toBeGreaterThan(0);
                expect(result).toBeLessThan(1);
                // The actual value with Bezier(0.25, 0.1, 0.25, 1) is approximately 0.8024
                expect(result).toBeCloseTo(0.802, 3);
            });
        });

        // Test for easeIn function
        describe('easeIn function', () => {
            test('should return 0 for input 0', () => {
                expect(easeIn(0)).toBe(0);
            });

            test('should return 1 for input 1', () => {
                expect(easeIn(1)).toBe(1);
            });

            test('should return proper interpolated values', () => {
                // easeIn should return a value less than 0.5 for input 0.5
                // since it starts slow and accelerates
                expect(easeIn(0.5)).toBeLessThan(0.5);
            });
        });

        // Test for easeOut function
        describe('easeOut function', () => {
            test('should return 0 for input 0', () => {
                expect(easeOut(0)).toBe(0);
            });

            test('should return 1 for input 1', () => {
                expect(easeOut(1)).toBe(1);
            });

            test('should return proper interpolated values', () => {
                // easeOut should return a value greater than 0.5 for input 0.5
                // since it starts fast and decelerates
                expect(easeOut(0.5)).toBeGreaterThan(0.5);
            });
        });

        // Test for easeInOut function
        describe('easeInOut function', () => {
            test('should return 0 for input 0', () => {
                expect(easeInOut(0)).toBe(0);
            });

            test('should return 1 for input 1', () => {
                expect(easeInOut(1)).toBe(1);
            });

            test('should return proper interpolated values', () => {
                const result = easeInOut(0.5);
                expect(result).toBeGreaterThan(0);
                expect(result).toBeLessThan(1);
                // For easeInOut with Bezier(0.42, 0, 0.58, 1), the value at 0.5 should be close to 0.5
                // This is because easeInOut is typically symmetric around the midpoint
                expect(result).toBeCloseTo(0.5, 2);
            });
        });

        // Test for cubicBezier function
        describe('cubicBezier function', () => {
            test('returned function should handle input values correctly', () => {
                const customEasing = cubicBezier(0.1, 0.2, 0.3, 0.4);
                expect(customEasing(0)).toBe(0);
                expect(customEasing(1)).toBe(1);
                expect(typeof customEasing(0.5)).toBe('number');
            });

            test('should create easing function that matches ease parameters', () => {
                const customEase = cubicBezier(0.25, 0.1, 0.25, 1);
                // Compare with standard ease function
                expect(customEase(0)).toEqual(ease(0));
                expect(customEase(0.5)).toBeCloseTo(ease(0.5), 6);
                expect(customEase(1)).toEqual(ease(1));
            });

            test('should create easing function that matches easeIn parameters', () => {
                const customEaseIn = cubicBezier(0.42, 0, 1, 1);
                // Compare with standard easeIn function
                expect(customEaseIn(0)).toEqual(easeIn(0));
                expect(customEaseIn(0.5)).toBeCloseTo(easeIn(0.5), 6);
                expect(customEaseIn(1)).toEqual(easeIn(1));
            });

            test('should create easing function that matches easeOut parameters', () => {
                const customEaseOut = cubicBezier(0, 0, 0.58, 1);
                // Compare with standard easeOut function
                expect(customEaseOut(0)).toEqual(easeOut(0));
                expect(customEaseOut(0.5)).toBeCloseTo(easeOut(0.5), 6);
                expect(customEaseOut(1)).toEqual(easeOut(1));
            });

            test('should create easing function that matches easeInOut parameters', () => {
                const customEaseInOut = cubicBezier(0.42, 0, 0.58, 1);
                // Compare with standard easeInOut function
                expect(customEaseInOut(0)).toEqual(easeInOut(0));
                expect(customEaseInOut(0.5)).toBeCloseTo(easeInOut(0.5), 6);
                expect(customEaseInOut(1)).toEqual(easeInOut(1));
            });
        });
    });

    describe('uniqueClsx function', () => {
        test('should handle empty arguments', () => {
            expect(uniqueClsx()).toBe('');
        });

        test('should handle undefined and null inputs', () => {
            expect(uniqueClsx(null, undefined)).toBe('');
        });

        test('should handle single string argument', () => {
            expect(uniqueClsx('test')).toBe('test');
        });

        test('should combine multiple string arguments', () => {
            expect(uniqueClsx('test1', 'test2', 'test3')).toBe('test1 test2 test3');
        });

        test('should handle arrays of class names', () => {
            expect(uniqueClsx(['test1', 'test2'])).toBe('test1 test2');
        });

        test('should handle objects with boolean values', () => {
            expect(uniqueClsx({ test1: true, test2: false, test3: true })).toBe('test1 test3');
        });

        test('should handle mixed input types', () => {
            expect(uniqueClsx('test1', { test2: true, test3: false }, ['test4', 'test5'])).toBe('test1 test2 test4 test5');
        });

        test('should handle conditional string of space delimited class names', () => {
            expect(uniqueClsx('test1', { 'test2 test3': true, 'test4 test5': false }, 'test6 test7')).toBe('test1 test2 test3 test6 test7');
        });

        test('should handle nested arrays', () => {
            expect(uniqueClsx('test1', ['test2', ['test3', 'test4']])).toBe('test1 test2 test3 test4');
        });

        test('should handle array with truthy/falsy values', () => {
            expect(uniqueClsx(['test1', false, 'test2', 0, null, undefined, 'test3'])).toBe('test1 test2 test3');
        });

        // Deduplication tests (uniqueClsx specific functionality)
        test('should remove duplicate class names', () => {
            expect(uniqueClsx('test', 'test')).toBe('test');
        });

        test('should remove duplicates from different argument types', () => {
            expect(uniqueClsx('test1', 'test2', { test1: true }, ['test2', 'test3'])).toBe('test1 test2 test3');
        });

        test('should handle complex case with multiple duplicates', () => {
            const result = uniqueClsx('btn', 'btn-primary', ['btn', 'active'], { 'btn-large': true, 'btn-primary': true, disabled: false }, 'active');
            expect(result).toBe('btn btn-primary active btn-large');
        });

        test('should preserve order after deduplication', () => {
            // When duplicates are removed, the first occurrence should be kept
            // and the order of other classes should be preserved
            const result = uniqueClsx('first', 'second', 'first', 'third', 'second');
            expect(result).toBe('first second third');
        });

        test('should treat whitespace correctly', () => {
            expect(uniqueClsx('  test1  ', ' test2 ')).toBe('test1 test2');
        });

        test('should handle consecutive spaces in inputs', () => {
            expect(uniqueClsx('test1  test2', 'test3')).toBe('test1 test2 test3');
        });

        test('should handle empty string inputs', () => {
            expect(uniqueClsx('test1', '', 'test2', '')).toBe('test1 test2');
        });

        test('should handle combinations of all edge cases', () => {
            const result = uniqueClsx(
                'base',
                null,
                ['base', '', false, 'extra'],
                undefined,
                { active: true, disabled: false, base: true },
                '  duplicate  ',
                ['duplicate']
            );
            expect(result).toBe('base extra active duplicate');
        });

        test('should preserve clsx numeric input behavior', () => {
            expect(uniqueClsx(1, 2, 1, 0)).toBe('1 2');
        });

        test('should split whitespace-delimited object keys', () => {
            expect(uniqueClsx({ 'first\tsecond third': true, ignored: false }, 'second')).toBe('first second third');
        });

        test('should normalize ECMAScript whitespace characters', () => {
            expect(uniqueClsx('first\u00a0second\u2003third\ufefffourth', 'third')).toBe('first second third fourth');
        });

        test('should deduplicate values across nested arrays and objects', () => {
            expect(uniqueClsx(['first', ['second third', { first: true, fourth: true }]], 'second')).toBe('first second third fourth');
        });

        test('preserves clsx traversal semantics for inherited object keys and numeric nested values', () => {
            const inherited = Object.create({ inherited: true }) as { inherited: boolean; own: boolean };
            inherited.own = true;

            expect(uniqueClsx(['first first', [2, { 'third fourth': true }]], inherited, 2)).toBe('first 2 third fourth own inherited');
        });

        test('handles large unique and duplicate inputs deterministically', () => {
            const uniqueTokens = Array.from({ length: 10_000 }, (_, index) => `token-${index}`);
            const duplicateTokens = Array.from({ length: 25_000 }, () => 'duplicate');

            expect(uniqueClsx(uniqueTokens)).toBe(uniqueTokens.join(' '));
            expect(uniqueClsx(duplicateTokens)).toBe('duplicate');
        });
    });

    describe('toStyle function', () => {
        test('should handle empty or invalid inputs', () => {
            expect(toStyle({})).toBe('');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing defensive behavior with intentionally invalid input
            expect(toStyle(null as any)).toBe('');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing defensive behavior with intentionally invalid input
            expect(toStyle(undefined as any)).toBe('');
        });

        test('should convert a simple style object to CSS string', () => {
            const styleObj = {
                color: 'red',
                fontSize: '16px'
            };
            expect(toStyle(styleObj)).toBe('color: red;font-size: 16px');
        });

        test('should convert camelCase properties to kebab-case', () => {
            const styleObj = {
                backgroundColor: 'blue',
                marginTop: '10px',
                borderBottomWidth: '2px'
            };
            expect(toStyle(styleObj)).toBe('background-color: blue;margin-top: 10px;border-bottom-width: 2px');
        });

        test('should handle numeric values correctly', () => {
            const styleObj = {
                width: 100,
                height: 200,
                zIndex: 5
            };
            expect(toStyle(styleObj)).toBe('width: 100;height: 200;z-index: 5');
        });

        test('should handle complex mixed style object', () => {
            const styleObj = {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            };
            const result = toStyle(styleObj);

            // Check individual properties are included with correct formatting
            expect(result).toContain('display: flex');
            expect(result).toContain('flex-direction: column');
            expect(result).toContain('gap: 8px');
            expect(result).toContain('padding: 16px');
            expect(result).toContain('background-color: #f5f5f5');
            expect(result).toContain('border-radius: 4');
            expect(result).toContain('box-shadow: 0 2px 4px rgba(0,0,0,0.1)');
        });
    });

    describe('fromStyle function', () => {
        test('should handle empty or invalid inputs', () => {
            expect(fromStyle('')).toEqual({});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(fromStyle(null as any)).toEqual({});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(fromStyle(undefined as any)).toEqual({});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(fromStyle(123 as any)).toEqual({});
        });

        test('should convert a simple CSS string to style object', () => {
            const cssString = 'color: red;font-size: 16px';
            expect(fromStyle(cssString)).toEqual({
                color: 'red',
                fontSize: '16px'
            });
        });

        test('should convert kebab-case properties to camelCase', () => {
            const cssString = 'background-color: blue;margin-top: 10px;border-bottom-width: 2px';
            expect(fromStyle(cssString)).toEqual({
                backgroundColor: 'blue',
                marginTop: '10px',
                borderBottomWidth: '2px'
            });
        });

        test('should handle numeric values correctly', () => {
            const cssString = 'width: 100;height: 200;z-index: 5';
            expect(fromStyle(cssString)).toEqual({
                width: 100,
                height: 200,
                zIndex: 5
            });
        });

        test('should handle spaces and formatting variations', () => {
            const cssString = '  color : red ; font-size: 16px  ;  margin: 8px  ';
            expect(fromStyle(cssString)).toEqual({
                color: 'red',
                fontSize: '16px',
                margin: '8px'
            });
        });

        test('should skip empty declarations', () => {
            const cssString = 'color: red;;margin: 10px;';
            expect(fromStyle(cssString)).toEqual({
                color: 'red',
                margin: '10px'
            });
        });

        test('should handle incomplete declarations', () => {
            const cssString = 'color: red;invalid;margin:;:10px;';
            expect(fromStyle(cssString)).toEqual({
                color: 'red'
            });
        });

        test('should handle complex values correctly', () => {
            const cssString =
                'box-shadow: 0 2px 4px rgba(0,0,0,0.1);grid-template: 1fr / repeat(3, 1fr);transform: translate(10px, 20px) rotate(45deg)';
            expect(fromStyle(cssString)).toEqual({
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                gridTemplate: '1fr / repeat(3, 1fr)',
                transform: 'translate(10px, 20px) rotate(45deg)'
            });
        });

        test('should handle zero values without units', () => {
            const cssString = 'margin: 0;padding: 0';
            expect(fromStyle(cssString)).toEqual({
                margin: 0,
                padding: 0
            });
        });

        test('should handle values with special characters', () => {
            const cssString = 'content: "Hello, world!";font-family: "Open Sans", Arial, sans-serif';
            expect(fromStyle(cssString)).toEqual({
                content: '"Hello, world!"',
                fontFamily: '"Open Sans", Arial, sans-serif'
            });
        });

        test('should handle CSS variables', () => {
            const cssString = '--primary-color: #ff0000;color: var(--primary-color)';
            expect(fromStyle(cssString)).toEqual({
                '--primary-color': '#ff0000',
                color: 'var(--primary-color)'
            });
        });

        test('should handle conversion roundtrip', () => {
            const originalStyle = {
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f5f5f5',
                padding: '16px',
                borderRadius: 4
            };

            const cssString = toStyle(originalStyle);
            const convertedBack = fromStyle(cssString);

            expect(convertedBack).toEqual(originalStyle);
        });

        test.each([
            [
                'background-image: url("data:image/svg+xml;utf8,<svg viewBox=\'0:0\'></svg>");content: "semi;colon: value"',
                {
                    backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\'0:0\'></svg>")',
                    content: '"semi;colon: value"'
                }
            ],
            [
                'content: "escaped \\" quote; still:value";--Theme-Token: 2;opacity: .5',
                { content: '"escaped \\" quote; still:value"', '--Theme-Token': 2, opacity: 0.5 }
            ],
            [
                'filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=50;Style=1);color: blue',
                { filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=50;Style=1)', color: 'blue' }
            ],
            ['--x: foo\\;bar;color:red', { '--x': 'foo\\;bar', color: 'red' }],
            ['filter: fn(foo\\));color:red', { filter: 'fn(foo\\))', color: 'red' }],
            ['content: escaped\\:colon;color:red', { content: 'escaped\\:colon', color: 'red' }],
            ['color: red', { color: 'red' }],
            [';invalid; color: ; : nope; margin: 0;', { margin: 0 }]
        ])('parses adversarial declarations without splitting protected values', (cssString, expected) => {
            expect(fromStyle(cssString)).toEqual(expected);
        });

        test('ignores an unterminated protected declaration instead of splitting it', () => {
            expect(fromStyle('content: "unterminated;color: red')).toEqual({});
        });

        test('round-trips custom property spelling and quoted function values', () => {
            const originalStyle = {
                '--Theme-Token': 'url("data:text/plain;a:b")',
                content: '"semi;colon"'
            };

            expect(fromStyle(toStyle(originalStyle))).toEqual(originalStyle);
        });
    });
});
