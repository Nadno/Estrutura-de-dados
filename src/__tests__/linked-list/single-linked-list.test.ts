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
  it('should get a node at the supplied index', () => {
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

  it('should get a node value at the supplied index', () => {
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

  it('should throw an error when passing invalid indexes to `nodeAt` or `at`', () => {
    const invalidIndexes = [
      -1,
      numberElements.length,
      NaN,
      '',
      {},
      false,
      true,
      null,
      undefined,
    ];

    const list = new LinkedList(...numberElements);

    invalidIndexes.forEach((index) => {
      expect(() => list.at(index as number)).toThrow();
      expect(() => list.nodeAt(index as number)).toThrow();
    });
  });
});
