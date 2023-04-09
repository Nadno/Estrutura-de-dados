import { describe, expect, it } from 'vitest';
import { SNode as Node } from '@structures/linked-list/node';

describe('Linked list Node', () => {
  it('should instantiate a Node passing a `value`', () => {
    const expected = {},
      node = new Node(expected);

    expect(node).toHaveProperty('value', expected);
  });

  it('should instantiate a Node passing the `next` node', () => {
    const expected = {},
      node = new Node('', expected);

    expect(node.next).toHaveProperty('value', expected);
  });

  it('should supply a statick `isNode` method', () => {
    const node = new Node(null);
    expect(Node.isNode(node)).toBe(true);
  });

  it('should allow us to remove the next node', () => {
    const expected = {},
      node = new Node('', expected);

    expect(node.next).toHaveProperty('value', expected);

    expect(node.removeNext()?.value).toBe(expected);
    expect(node).toHaveProperty('next', undefined);
  });

  it('should allow us to instert the next node passing a node or a value', () => {
    const expectedNodeValue = 42,
      expectedNode = new Node(expectedNodeValue),
      node = new Node(0);

    node.insertNext(expectedNodeValue);
    expect(node.next).toHaveProperty('value', expectedNodeValue);

    node.removeNext();
    expect(node.next).toBeUndefined();

    node.insertNext(expectedNode);
    expect(node.next).toBe(expectedNode);
  });
});
