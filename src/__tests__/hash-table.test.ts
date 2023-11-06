import { describe, expect, it } from 'vitest';
import { HashTable } from '@structures/hash-table';

const keyValue: [string, any][] = [
  ['foo', 'bar'],
  ['bar', 42],
  ['qux', true],
];

const generateKeyValuePairs = ({
  type,
  length,
}: {
  type: 'sequential' | 'random';
  length: number;
}): [string, number][] => {
  const isRandom = type === 'random',
    minValue = 36000;

  return Array.from({ length: length }, (_, index) => {
    const value = isRandom
        ? Math.round(Math.random() * minValue)
        : (index + 1) * minValue,
      key = value.toString(36);

    return [key, value];
  });
};

describe('Dictionary data structure', () => {
  it('should set and get the dictionary key/value pairs', () => {
    const dic = new HashTable<string, any>();

    expect(dic.isEmpty()).toBe(true);

    keyValue.forEach(([key, value]) => dic.set(key, value));

    expect(dic.isEmpty()).toBe(false);
    expect(dic.size()).toBeGreaterThan(0);
    expect(dic.size()).toBe(keyValue.length);

    keyValue.forEach(([key, value]) => expect(dic.get(key)).toBe(value));
  });

  it('should remove a dictionary item', () => {
    const keyValue = generateKeyValuePairs({
      type: 'sequential',
      length: 100,
    });

    const dic = new HashTable<string, number>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    expect(dic.size()).toBeGreaterThan(0);
    
    keyValue.forEach(([key, value]) => {
      const removedValue = dic.remove(key);
      expect(removedValue).toBe(value);
    });

    expect(dic.size()).toBe(0);
  });

  it('should check if a key exists within a dictionary', () => {
    const keyValue = generateKeyValuePairs({
      type: 'sequential',
      length: 100,
    });

    const dic = new HashTable<string, number>();

    keyValue.forEach(([key, value]) => {
      expect(dic.has(key)).toBe(false);
      dic.set(key, value);
      expect(dic.has(key)).toBe(true);
    });
  });

  it('should count the dictionary items', () => {
    const keyValue = generateKeyValuePairs({
      type: 'sequential',
      length: 100,
    });

    const dic = new HashTable<string, number>();

    expect(dic.size()).toBe(0);

    keyValue.forEach(([key, value], index) => {
      const count = index + 1;
      dic.set(key, value);
      expect(dic.size()).toBe(count);
    });

    expect(dic.size()).toBeGreaterThan(0);

    keyValue.forEach(([key], index) => {
      const count = keyValue.length - (index + 1);
      dic.remove(key);
      expect(dic.size()).toBe(count);
    });

    expect(dic.size()).toBe(0);
  });

  it('should return all the keys within the dictionary', () => {
    const dic = new HashTable<string, any>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    const dicKeys = dic.keys();

    keyValue.forEach(([expectedKey]) =>
      expect(dicKeys.some((key) => key === expectedKey)).toBe(true),
    );
  });

  it('should return all the values within the dictionary', () => {
    const dic = new HashTable<string, any>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    const dicValues = dic.values();

    keyValue.forEach(([, expectedValue]) =>
      expect(dicValues.some((value) => value === expectedValue)).toBe(true),
    );
  });

  it('should return all the entries within the dictionary', () => {
    const dic = new HashTable<string, any>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    const dicKeyValue = dic.entries();

    keyValue.forEach(([expectedKey, expectedValue]) =>
      expect(
        dicKeyValue.some(
          ([key, value]) => key === expectedKey && value === expectedValue,
        ),
      ).toBe(true),
    );
  });
});
