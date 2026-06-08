import { getContext, hasContext, setContext } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Context } from './context.js';

// Mock Svelte's context functions
vi.mock('svelte', () => ({
    getContext: vi.fn(),
    hasContext: vi.fn(),
    setContext: vi.fn()
}));

const mockGetContext = vi.mocked(getContext);
const mockHasContext = vi.mocked(hasContext);
const mockSetContext = vi.mocked(setContext);

describe('Context', () => {
    let context: Context<string>;
    const contextName = 'test-context';
    const testValue = 'test-value';

    beforeEach(() => {
        context = new Context<string>(contextName);
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('constructor', () => {
        test('should create a context with the given name', () => {
            const ctx = new Context<number>('my-context');
            expect(ctx.key).toEqual(expect.any(Symbol));
            expect(ctx.key.toString()).toBe('Symbol(my-context)');
        });

        test('should create unique keys for different context names', () => {
            const ctx1 = new Context<string>('context-1');
            const ctx2 = new Context<string>('context-2');
            expect(ctx1.key).not.toBe(ctx2.key);
        });

        test('should create unique keys even for contexts with the same name', () => {
            const ctx1 = new Context<string>('same-name');
            const ctx2 = new Context<string>('same-name');
            expect(ctx1.key).not.toBe(ctx2.key);
        });
    });

    describe('key getter', () => {
        test('should return the context key as a symbol', () => {
            const key = context.key;
            expect(typeof key).toBe('symbol');
            expect(key.toString()).toBe(`Symbol(${contextName})`);
        });

        test('should return the same key on multiple calls', () => {
            const key1 = context.key;
            const key2 = context.key;
            expect(key1).toBe(key2);
        });
    });

    describe('exists()', () => {
        test('should return true when context exists', () => {
            mockHasContext.mockReturnValue(true);

            const result = context.exists();

            expect(result).toBe(true);
            expect(mockHasContext).toHaveBeenCalledWith(context.key);
        });

        test('should return false when context does not exist', () => {
            mockHasContext.mockReturnValue(false);

            const result = context.exists();

            expect(result).toBe(false);
            expect(mockHasContext).toHaveBeenCalledWith(context.key);
        });
    });

    describe('get()', () => {
        test('should return the context value when it exists', () => {
            mockGetContext.mockReturnValue(testValue);

            const result = context.get();

            expect(result).toBe(testValue);
            expect(mockGetContext).toHaveBeenCalledWith(context.key);
        });

        test('should throw an error when context does not exist', () => {
            mockGetContext.mockReturnValue(undefined);

            expect(() => context.get()).toThrow(`Context "${contextName}" not found`);
            expect(mockGetContext).toHaveBeenCalledWith(context.key);
        });

        test('should throw an error when context value is explicitly undefined', () => {
            mockGetContext.mockReturnValue(undefined);

            expect(() => context.get()).toThrow(`Context "${contextName}" not found`);
        });

        test('should return null value when context is set to null', () => {
            const nullContext = new Context<string | null>('null-context');
            mockGetContext.mockReturnValue(null);

            const result = nullContext.get();

            expect(result).toBe(null);
        });

        test('should return empty string when context is set to empty string', () => {
            mockGetContext.mockReturnValue('');

            const result = context.get();

            expect(result).toBe('');
        });

        test('should return zero when context is set to zero', () => {
            const numberContext = new Context<number>('number-context');
            mockGetContext.mockReturnValue(0);

            const result = numberContext.get();

            expect(result).toBe(0);
        });

        test('should return false when context is set to false', () => {
            const boolContext = new Context<boolean>('bool-context');
            mockGetContext.mockReturnValue(false);

            const result = boolContext.get();

            expect(result).toBe(false);
        });
    });

    describe('getOr()', () => {
        test('should return the context value when it exists', () => {
            mockGetContext.mockReturnValue(testValue);
            const fallback = 'fallback-value';

            const result = context.getOr(fallback);

            expect(result).toBe(testValue);
            expect(mockGetContext).toHaveBeenCalledWith(context.key);
        });

        test('should return the fallback value when context does not exist', () => {
            mockGetContext.mockReturnValue(undefined);
            const fallback = 'fallback-value';

            const result = context.getOr(fallback);

            expect(result).toBe(fallback);
            expect(mockGetContext).toHaveBeenCalledWith(context.key);
        });

        test('should return the fallback value when context is explicitly undefined', () => {
            mockGetContext.mockReturnValue(undefined);
            const fallback = 'fallback-value';

            const result = context.getOr(fallback);

            expect(result).toBe(fallback);
        });

        test('should return context value even when it is falsy but not undefined', () => {
            mockGetContext.mockReturnValue('');
            const fallback = 'fallback-value';

            const result = context.getOr(fallback);

            expect(result).toBe('');
        });

        test('should work with different fallback types', () => {
            mockGetContext.mockReturnValue(undefined);

            expect(context.getOr(42)).toBe(42);
            expect(context.getOr(true)).toBe(true);
            expect(context.getOr(null)).toBe(null);
            expect(context.getOr([])).toEqual([]);
            expect(context.getOr({})).toEqual({});
        });

        test('should preserve type information for both context and fallback', () => {
            const mixedContext = new Context<string>('mixed-context');
            mockGetContext.mockReturnValue(undefined);

            const result = mixedContext.getOr(123);

            expect(typeof result === 'string' || typeof result === 'number').toBe(true);
            expect(result).toBe(123);
        });
    });

    describe('set()', () => {
        test('should set the context value and return it', () => {
            mockSetContext.mockReturnValue(testValue);

            const result = context.set(testValue);

            expect(result).toBe(testValue);
            expect(mockSetContext).toHaveBeenCalledWith(context.key, testValue);
        });

        test('should work with different value types', () => {
            const numberContext = new Context<number>('number-context');
            const objectContext = new Context<{ key: string }>('object-context');
            const arrayContext = new Context<string[]>('array-context');

            mockSetContext.mockImplementation((_, value) => value);

            expect(numberContext.set(42)).toBe(42);
            expect(objectContext.set({ key: 'value' })).toEqual({ key: 'value' });
            expect(arrayContext.set(['a', 'b'])).toEqual(['a', 'b']);
        });

        test('should work with null values', () => {
            const nullableContext = new Context<string | null>('nullable-context');
            mockSetContext.mockReturnValue(null);

            const result = nullableContext.set(null);

            expect(result).toBe(null);
            expect(mockSetContext).toHaveBeenCalledWith(nullableContext.key, null);
        });

        test('should work with undefined values', () => {
            const undefinedContext = new Context<string | undefined>('undefined-context');
            mockSetContext.mockReturnValue(undefined);

            const result = undefinedContext.set(undefined);

            expect(result).toBe(undefined);
            expect(mockSetContext).toHaveBeenCalledWith(undefinedContext.key, undefined);
        });
    });

    describe('integration scenarios', () => {
        test('should work with complex object types', () => {
            interface ComplexType {
                id: number;
                name: string;
                nested: {
                    value: boolean;
                };
            }

            const complexContext = new Context<ComplexType>('complex-context');
            const complexValue: ComplexType = {
                id: 1,
                name: 'test',
                nested: { value: true }
            };

            mockSetContext.mockReturnValue(complexValue);
            mockGetContext.mockReturnValue(complexValue);

            // Set the context
            const setResult = complexContext.set(complexValue);
            expect(setResult).toBe(complexValue);

            // Get the context
            const getResult = complexContext.get();
            expect(getResult).toBe(complexValue);
            expect(getResult.nested.value).toBe(true);
        });

        test('should handle context lifecycle correctly', () => {
            // Initially context doesn't exist
            mockHasContext.mockReturnValue(false);
            expect(context.exists()).toBe(false);

            // Set the context
            mockSetContext.mockReturnValue(testValue);
            context.set(testValue);

            // Now context exists
            mockHasContext.mockReturnValue(true);
            mockGetContext.mockReturnValue(testValue);

            expect(context.exists()).toBe(true);
            expect(context.get()).toBe(testValue);
            expect(context.getOr('fallback')).toBe(testValue);
        });

        test('should work with generic constraints', () => {
            interface BaseType {
                id: string;
            }

            interface ExtendedType extends BaseType {
                name: string;
            }

            const baseContext = new Context<BaseType>('base-context');
            const extendedValue: ExtendedType = { id: '1', name: 'test' };

            mockSetContext.mockReturnValue(extendedValue);
            mockGetContext.mockReturnValue(extendedValue);

            // Should work with extended types
            baseContext.set(extendedValue);
            const result = baseContext.get();

            expect(result.id).toBe('1');
            // TypeScript should allow this because ExtendedType extends BaseType
            expect((result as ExtendedType).name).toBe('test');
        });
    });

    describe('error handling', () => {
        test('should provide clear error messages with context name', () => {
            const customContext = new Context<string>('my-custom-context');
            mockGetContext.mockReturnValue(undefined);

            expect(() => customContext.get()).toThrow('Context "my-custom-context" not found');
        });

        test('should handle special characters in context names', () => {
            const specialContext = new Context<string>('context-with-special-chars!@#$%');
            mockGetContext.mockReturnValue(undefined);

            expect(() => specialContext.get()).toThrow('Context "context-with-special-chars!@#$%" not found');
        });

        test('should handle empty context names', () => {
            const emptyContext = new Context<string>('');
            mockGetContext.mockReturnValue(undefined);

            expect(() => emptyContext.get()).toThrow('Context "" not found');
        });
    });
});
