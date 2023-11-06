import { describe, expect, it } from 'vitest';
import { Dictionary } from '@structures/dictionary';

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
    const dic = new Dictionary<string, any>();

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

    const dic = new Dictionary<string, number>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    expect(dic.size()).toBeGreaterThan(0);

    keyValue.forEach(([key, value]) => {
      const removedValue = dic.remove(key);
      expect(removedValue).toBe(value);
    });
  });

  it('should check if a key exists within a dictionary', () => {
    const keyValue = generateKeyValuePairs({
      type: 'sequential',
      length: 100,
    });

    const dic = new Dictionary<string, number>();

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

    const dic = new Dictionary<string, number>();

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
    const dic = new Dictionary<string, any>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    expect(dic.keys()).toEqual(keyValue.map(([key]) => key));
  });

  it('should return all the keys within the dictionary', () => {
    const dic = new Dictionary<string, any>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    expect(dic.values()).toEqual(keyValue.map(([, value]) => value));
  });

  it('should return all the keys within the dictionary', () => {
    const dic = new Dictionary<string, any>();

    keyValue.forEach(([key, value]) => dic.set(key, value));

    expect(dic.entries()).toEqual(keyValue);
  });
});
