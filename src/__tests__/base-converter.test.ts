import { describe, expect, it } from 'vitest';
import { baseConverter } from '@utils/base-converter';

describe('Util base converter', () => {
  const randomNumbers = (min = 1, max = 100, length = 10) => {
    return Array.from({ length }, () =>
      Math.max(min, Math.floor(Math.random() * max)),
    );
  };

  const bases = Array.from({ length: 35 }, (_, index) => index + 2);

  for (const base of bases) {
    it(`should convert base ten numbers to base (${base})`, () => {
      const numbers = randomNumbers(1, 500, 500);

      for (const number of numbers) {
        const expected = number.toString(base),
          result = baseConverter(number, base);

        expect(result).toBe(expected);
      }
    });
  }

  it('should throw an error wheen using a base number outside the range (2, 36)', () => {
    const invalidBases = [-1, 0, 1, 37];

    invalidBases.forEach((base) =>
      expect(() => baseConverter(42, base)).toThrow(),
    );
  });
});
