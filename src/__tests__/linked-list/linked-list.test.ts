import { describe, expect, it } from 'vitest';

import {
  SNode,
  DNode,
  SLinkedList,
  DLinkedList,
  SortedLinkedList,
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
  {
    label: 'Sorted',
    Node: SNode,
    LinkedList: SortedLinkedList,
  },
] as const;

const getArrayOfNodes = <T>(
  list: SLinkedList<T> | DLinkedList<T> | SortedLinkedList<T>,
) => {
  const result = Array(list.size);

  let node = list.head,
    index = 0;

  while (node) {
    result[index++] = node;
    node = node.next;
  }

  return result;
};

for (const { label, LinkedList } of lists) {
  describe(`${label} Linked list base`, () => {
    const orderedNumbers = [1, 2, 3, 4, 5];

    it('should implement the Javascript iteration pattern (be iterable)', () => {
      const list = new LinkedList();

      expect(() => {
        Array.from(list);
        [...list];
      }).not.toThrow();
    });

    it('should instantiate a linked list passing its elements', () => {
      const list = new LinkedList<number>(...orderedNumbers);

      expect(list.size).toBe(orderedNumbers.length);
      expect([...list]).toEqual(orderedNumbers);
    });

    if ('push' in LinkedList.prototype) {
      it('should add elements to the end of the linked list', () => {
        const list = new LinkedList<number>() as SLinkedList<number>;

        orderedNumbers.forEach((element, index) => {
          list.push(element);
          expect(list.size).toBe(index + 1);
        });

        expect([...list]).toEqual(orderedNumbers);

        list.push(...orderedNumbers);
        expect(list.size).toBe(orderedNumbers.length * 2);
        expect([...list]).toEqual([...orderedNumbers, ...orderedNumbers]);
      });
    }

    if ('unshift' in LinkedList.prototype) {
      it('should add elements to the beginning of the linked list', () => {
        const list = new LinkedList<number>() as SLinkedList<number>,
          expectedElements = [...orderedNumbers].reverse();

        orderedNumbers.forEach((element, index) => {
          list.unshift(element);
          expect(list.size).toBe(index + 1);
        });

        expect([...list]).toEqual(expectedElements);

        list.unshift(...orderedNumbers);
        expect(list.size).toBe(orderedNumbers.length * 2);
        expect([...list]).toEqual([...expectedElements, ...expectedElements]);
      });
    }

    it('should get a node at the supplied positive index', () => {
      const list = new LinkedList(...orderedNumbers);

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
      const list = new LinkedList(...orderedNumbers),
        nodes = getArrayOfNodes(list);

      let index = list.size - 1;

      while (index >= 0) {
        const negativeIndex = index - list.size;
        expect(list.nodeAt(negativeIndex)).toBe(nodes[index--]);
      }
    });

    it('should get a node value at the supplied positive index', () => {
      const list = new LinkedList(...orderedNumbers);

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
      const list = new LinkedList(...orderedNumbers),
        nodes = getArrayOfNodes(list);

      let index = list.size - 1;

      while (index >= 0) {
        const negativeIndex = index - list.size;
        expect(list.at(negativeIndex)).toBe(nodes[index--].value);
      }
    });

    it('should throw an error when passing invalid indexes to `nodeAt` or `at`', () => {
      const invalidIndexes = [NaN, '', {}, false, true, null, undefined];

      const list = new LinkedList(...orderedNumbers);

      invalidIndexes.forEach((index) => {
        expect(() => list.at(index as number)).toThrow();
        expect(() => list.nodeAt(index as number)).toThrow();
      });
    });

    it('should get a index of a node or value', () => {
      const list = new LinkedList(...orderedNumbers);

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

      const list = new LinkedList<any>(...orderedNumbers);

      elementsOutOfList.forEach((element) =>
        expect(list.indexOf(element)).toBe(-1),
      );
    });
  });
}
