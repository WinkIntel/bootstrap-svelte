import { describe, expect, test } from 'vitest';
import { transformBadgePosition, type BadgePosition } from './types.js';

describe('Badge types', () => {
    describe('transformBadgePosition', () => {
        // Test cases for each possible position value
        const positionTestCases: Array<[BadgePosition, string]> = [
            // Vertical: top
            ['top-start', 'position-absolute top-0 start-0 translate-middle'],
            ['top-middle', 'position-absolute top-0 start-50 translate-middle'],
            ['top-end', 'position-absolute top-0 start-100 translate-middle'],

            // Vertical: middle
            ['middle-start', 'position-absolute top-50 start-0 translate-middle'],
            ['middle-middle', 'position-absolute top-50 start-50 translate-middle'],
            ['middle-end', 'position-absolute top-50 start-100 translate-middle'],

            // Vertical: bottom
            ['bottom-start', 'position-absolute top-100 start-0 translate-middle'],
            ['bottom-middle', 'position-absolute top-100 start-50 translate-middle'],
            ['bottom-end', 'position-absolute top-100 start-100 translate-middle']
        ];

        // Generate a test for each position
        test.each(positionTestCases)('transforms %s to correct Bootstrap classes', (position, expected) => {
            const result = transformBadgePosition(position);
            expect(result).toBe(expected);
        });

        // Additional tests for edge cases

        test('should handle custom positions gracefully', () => {
            // @ts-expect-error - Testing with invalid position value
            const result = transformBadgePosition('invalid-position');

            // Should still return a string with position-absolute class
            expect(result).toContain('position-absolute');
            expect(typeof result).toBe('string');
        });

        test('should always include position-absolute and translate-middle classes', () => {
            // Test with a valid position
            const result = transformBadgePosition('top-start');

            expect(result).toContain('position-absolute');
            expect(result).toContain('translate-middle');
        });
    });
});
