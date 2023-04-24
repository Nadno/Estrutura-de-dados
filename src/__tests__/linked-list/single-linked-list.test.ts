import { SLinkedList as LinkedList } from '@structures/linked-list';
import { describe, expect, it } from 'vitest';

const numberElements = [1, 2, 3, 4, 5];

describe('Single Linked list base', () => {
  it('should implement the Javascript iteration pattern (be iterable)', () => {
    const list = new LinkedList();

    expect(() => {
      Array.from(list);
      [...list];
    }).not.toThrow();
  });

  it('should instantiate a linked list passing its elements', () => {
    const list = new LinkedList<number>(...numberElements);

    expect(list.size).toBe(numberElements.length);
    expect([...list]).toEqual(numberElements);
  });

  it('should add elements to the end of the linked list', () => {
    const list = new LinkedList<number>();

    numberElements.forEach((element, index) => {
      list.push(element);
      expect(list.size).toBe(index + 1);
    });

    expect([...list]).toEqual(numberElements);

    list.push(...numberElements);
    expect(list.size).toBe(numberElements.length * 2);
    expect([...list]).toEqual([...numberElements, ...numberElements]);
  });

  it('should add elements to the beginning of the linked list', () => {
    const list = new LinkedList<number>(),
      expectedElements = [...numberElements].reverse();

    numberElements.forEach((element, index) => {
      list.unshift(element);
      expect(list.size).toBe(index + 1);
    });

    expect([...list]).toEqual(expectedElements);

    list.unshift(...numberElements);
    expect(list.size).toBe(numberElements.length * 2);
    expect([...list]).toEqual([...expectedElements, ...expectedElements]);
  });
});

describe('Single Linked list', () => {
  const randomBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getArrayOfNodes = <T>(list: LinkedList<T>) => {
    const result = Array(list.size);

    let node = list.head,
      index = 0;

    while (node) {
      result[index++] = node;
      node = node.next;
    }

    return result;
  };

  it('should get a node at the supplied positive index', () => {
    const list = new LinkedList(...numberElements);

    let index = 0,
      node = list.head;

    expect(node).not.toBeUndefined();

    while (node) {
      expect(list.nodeAt(index)).toBe(node);

      index++;
      node = node.next;
    }
  });

  it('should get a node at the supplied negative index', () => {
    const list = new LinkedList(...numberElements),
      nodes = getArrayOfNodes(list);

    let index = list.size - 1;

    while (index >= 0) {
      const negativeIndex = index - list.size;
      expect(list.nodeAt(negativeIndex)).toBe(nodes[index--]);
    }
  });

  it('should get a node value at the supplied positive index', () => {
    const list = new LinkedList(...numberElements);

    let index = 0,
      node = list.head;

    expect(node).not.toBeUndefined();

    while (node) {
      expect(list.at(index)).toBe(node.value);

      index++;
      node = node.next;
    }
  });

  it('should get a node value at the supplied negative index', () => {
    const list = new LinkedList(...numberElements),
      nodes = getArrayOfNodes(list);

    let index = list.size - 1;

    while (index >= 0) {
      const negativeIndex = index - list.size;
      expect(list.at(negativeIndex)).toBe(nodes[index--].value);
    }
  });

  it('should throw an error when passing invalid indexes to `nodeAt` or `at`', () => {
    const invalidIndexes = [NaN, '', {}, false, true, null, undefined];

    const list = new LinkedList(...numberElements);

    invalidIndexes.forEach((index) => {
      expect(() => list.at(index as number)).toThrow();
      expect(() => list.nodeAt(index as number)).toThrow();
    });
  });

  it('should get a index of a node or value', () => {
    const list = new LinkedList(...numberElements);

    let index = 0,
      node = list.head;

    expect(node).not.toBeUndefined();

    while (node) {
      expect(list.indexOf(node)).toBe(index);
      expect(list.indexOf(node.value)).toBe(index);

      index++;
      node = node.next;
    }
  });

  it('should return -1 when seeking a index of an element out of the linked list', () => {
    const elementsOutOfList = [
      '',
      'a',
      '1',
      -1,
      1042,
      {},
      null,
      undefined,
      NaN,
    ];

    const list = new LinkedList<any>(...numberElements);

    elementsOutOfList.forEach((element) =>
      expect(list.indexOf(element)).toBe(-1),
    );
  });

  it('should remove the supplied node, always from the begin', () => {
    const list = new LinkedList(...numberElements);

    const listValues = [...list];

    while (list.notEmpty()) {
      const node = list.nodeAt(0);

      expect(node).not.toBeUndefined();
      expect(list.remove(node as any)).toBe(listValues.shift());
      expect(list.nodeAt(0)).not.toBe(node);
    }

    expect(list.isEmpty).toBe(true);
  });

  it('should remove the supplied node, always from the end', () => {
    const list = new LinkedList(...numberElements);

    const reversedListValues = [...list].reverse();

    const removeValue = (value: number) => {
      const index = list.indexOf(value),
        node = list.nodeAt(index);

      expect(node).not.toBeUndefined();
      expect(list.remove(node as any)).toBe(value);
      expect(list.nodeAt(index)).not.toBe(node);
    };

    reversedListValues.forEach(removeValue);
    expect(list.isEmpty).toBe(true);
  });

  it('should remove the randomly supplied nodes', () => {
    const randomListFrom = (list: any[]) => {
      const listLength = list.length,
        randomList = [...list];

      let index = 0;

      while (index < listLength) {
        const randomIndex = randomBetween(index, listLength - 1);
        const item = randomList[randomIndex];
        randomList[randomIndex] = randomList[index];
        randomList[index] = item;
        index++;
      }

      return randomList;
    };

    const numberList = Array.from({ length: 50 }, (_, index) => index + 1),
      randomList = randomListFrom(numberList),
      list = new LinkedList(...numberList);

    const removeValue = (value: number) => {
      const index = list.indexOf(value),
        node = list.nodeAt(index);

      expect(node).not.toBeUndefined();
      expect(list.remove(node as any)).toBe(value);
      expect(list.nodeAt(index)).not.toBe(node);
    };

    randomList.forEach(removeValue);
    expect(list.isEmpty).toBe(true);
  });

  it('should remove the node at index, always from the begin', () => {
    const list = new LinkedList(...numberElements);

    while (list.notEmpty()) {
      const index = 0;
      const expectedValue = list.nodeAt(index)?.value,
        removedValue = list.removeAt(index);

      expect(removedValue).not.toBeUndefined();
      expect(removedValue).toBe(expectedValue);
    }

    expect(list.isEmpty).toBe(true);
  });

  it('should remove the node at index, always from the end', () => {
    const list = new LinkedList(...numberElements);

    while (list.notEmpty()) {
      const index = list.size - 1;
      const expectedValue = list.nodeAt(index)?.value,
        removedValue = list.removeAt(index);

      expect(removedValue).not.toBeUndefined();
      expect(removedValue).toBe(expectedValue);
    }

    expect(list.isEmpty).toBe(true);
  });

  it('should remove the node at the random index', () => {
    const numberList = Array.from({ length: 50 }, (_, index) => index + 1),
      list = new LinkedList(...numberList);

    while (list.notEmpty()) {
      const index = randomBetween(0, list.size - 1);
      const expectedValue = list.nodeAt(index)?.value,
        removedValue = list.removeAt(index);

      expect(removedValue).not.toBeUndefined();
      expect(removedValue).toBe(expectedValue);
    }

    expect(list.isEmpty).toBe(true);
  });
});
