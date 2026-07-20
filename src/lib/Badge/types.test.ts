import { describe, expect, test } from 'vitest';
import { transformBadgePosition, type BadgePosition } from './types.js';

describe('Badge types', () => {
    describe('transformBadgePosition', () => {
        const positionTestCases: Array<[BadgePosition, string]> = [
            ['top-start', 'position-absolute top-0 start-0 translate-middle'],
            ['top-middle', 'position-absolute top-0 start-50 translate-middle'],
            ['top-end', 'position-absolute top-0 start-100 translate-middle'],
            ['middle-start', 'position-absolute top-50 start-0 translate-middle'],
            ['middle-middle', 'position-absolute top-50 start-50 translate-middle'],
            ['middle-end', 'position-absolute top-50 start-100 translate-middle'],
            ['bottom-start', 'position-absolute top-100 start-0 translate-middle'],
            ['bottom-middle', 'position-absolute top-100 start-50 translate-middle'],
            ['bottom-end', 'position-absolute top-100 start-100 translate-middle']
        ];

        // Generate a test for each position
        test.each(positionTestCases)('transforms %s to correct Bootstrap classes', (position, expected) => {
            const result = transformBadgePosition(position);
            expect(result).toBe(expected);
        });

        test('returns no class for malformed positions', () => {
            const result = transformBadgePosition('invalid-position');

            expect(result).toBeUndefined();
        });
    });
});
