import { describe, expect, it } from 'vitest';

import {
  SNode,
  DNode,
  SLinkedList,
  DLinkedList,
} from '@structures/linked-list';

const lists = [
  {
    label: 'Single',
    Node: SNode,
    LinkedList: SLinkedList,
  },
  {
    label: 'Doubly',
    Node: DNode,
    LinkedList: DLinkedList,
  },
] as const;

for (const { label, LinkedList } of lists) {
  describe(`${label} Linked list base`, () => {
    const numberElements = [1, 2, 3, 4, 5];

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
}
