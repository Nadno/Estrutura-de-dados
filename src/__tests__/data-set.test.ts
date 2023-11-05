import { describe, expect, it } from 'vitest';
import { DataSet } from '@structures/data-set';

const numberElements = [1, 2, 3, 4, 5];

describe('DataSet data structure', () => {
  it('should instantiate the set passing an list of elements', () => {
    const elements = new DataSet<number>(numberElements);

    expect(elements.values()).toEqual(numberElements);
    expect(elements.size()).toBe(numberElements.length);
  });

  it('should avoid adding duplicated elements', () => {
    const elements = new DataSet<number>(numberElements);

    elements.add(...numberElements);
    elements.add(...numberElements);
    elements.add(...numberElements);
    elements.add(...numberElements);

    expect(elements.values()).toEqual(numberElements);
    expect(elements.size()).toBe(numberElements.length);
  });

  it('should add elements to the set', () => {
    const elements = new DataSet<number>();

    expect(elements.values()).toEqual([]);
    expect(elements.size()).toBe(0);

    numberElements.forEach((number, index) => {
      elements.add(number);

      const expectedElements = numberElements.slice(0, index + 1);

      expect(elements.values()).toEqual(expectedElements);
      expect(elements.size()).toBe(expectedElements.length);
    });
  });

  it('should check for an existing element within the set', () => {
    const inSet = [...numberElements],
      notInSet = numberElements.map((number) => number * 32);

    const elements = new DataSet<number>(numberElements);

    inSet.forEach((element) => expect(elements.has(element)).toBe(true));
    notInSet.forEach((element) => expect(elements.has(element)).toBe(false));
  });

  it('should delete an element from the set', () => {
    const numbers = [...numberElements];
    const elements = new DataSet<number>(numberElements);

    const deletedElements = [
      numbers.shift(),
      ...numbers.splice(numberElements.length / 2, 1),
      numbers.pop(),
    ] as number[];

    deletedElements.forEach((element) => elements.delete(element));

    expect(elements.values()).toEqual(numbers);
    expect(elements.size()).toBe(numbers.length);
  });

  it('should clear the set', () => {
    const elements = new DataSet<number>(numberElements);

    expect(elements.values()).toEqual(numberElements);
    expect(elements.size()).toBe(numberElements.length);

    elements.clear();

    expect(elements.values()).toEqual([]);
    expect(elements.size()).toBe(0);
  });
});

describe('DataSet set math operations', () => {
  it('should union the sets', () => {
    const first = new DataSet(numberElements),
      second = new DataSet(numberElements.map((number) => number * 32));

    const union = first.union(second);

    expect(union.size()).toBeGreaterThan(0);
    expect(union.size()).toBe(first.size() + second.size());

    [...first, ...second].forEach((value) =>
      expect(union.has(value)).toBe(true),
    );
  });

  it('should intersect the sets', () => {
    const randomNumbers = Array.from({ length: 100 }, () =>
      Math.round(Math.random() * 100),
    );

    const mid = Math.floor(randomNumbers.length / 2),
      expected = randomNumbers.slice(mid - 5, mid + 5);

    const first = new DataSet(randomNumbers),
      second = new DataSet(expected);

    const intersection = first.intersection(second);

    expect(intersection.size()).toBeGreaterThan(0);
    expect(intersection.size()).toBe(second.size());

    [...first, ...second].forEach((value) => {
      if (!first.has(value) || !second.has(value)) return;
      expect(intersection.has(value)).toBe(true);
    });
  });

  it('should differ the sets', () => {
    const randomNumbers = Array.from({ length: 100 }, () =>
      Math.round(Math.random() * 100),
    );

    const mid = Math.floor(randomNumbers.length / 2),
      expected = randomNumbers.slice(mid - 5, mid + 5);

    const sourceSet = new DataSet(randomNumbers),
      excludedSet = new DataSet(expected);

    const difference = sourceSet.difference(excludedSet);

    expect(difference.size()).toBeGreaterThan(0);
    expect(difference.size()).toBe(sourceSet.size() - excludedSet.size());

    [...excludedSet].forEach((value) => {
      expect(difference.has(value)).toBe(false);
    });
  });

  it('should check if the set is a subset of another', () => {
    const randomNumbers = Array.from({ length: 100 }, () =>
      Math.round(Math.random() * 100),
    );

    const mid = Math.floor(randomNumbers.length / 2),
      expected = randomNumbers.slice(mid - 5, mid + 5);

    const sourceSet = new DataSet(randomNumbers),
      subSet = new DataSet(expected);

    expect(subSet.size()).toBeGreaterThan(0);
    expect(subSet.isSubsetOf(sourceSet)).toBe(true);
  });
});
