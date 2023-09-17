import { describe, expect, it } from 'vitest';
import { DNode as Node } from '@structures/linked-list/node';

describe('Linked list Node', () => {
  it('should instantiate a Node passing a `value`', () => {
    const expected = {},
      node = new Node(expected);

    expect(node).toHaveProperty('value', expected);
  });

  it('should instantiate a Node passing the `prev` and `next` node', () => {
    const expected = {prev: {}, next: {}},
      node = new Node('', expected.prev, expected.next);

    expect(node).toHaveProperty('prev.value', expected.prev);
    expect(node).toHaveProperty('next.value', expected.next);
  });

  it('should supply a static `isNode` method', () => {
    const node = new Node(null);
    expect(Node.isNode(node)).toBe(true);
  });

  it('should allow us to remove the `prev` node', () => {
    const expected = {},
      node = new Node('', expected);

    expect(node.prev).toHaveProperty('value', expected);

    expect(node.removePrev()?.value).toBe(expected);
    expect(node).toHaveProperty('prev', undefined);
  });

  it('should allow us to insert the `prev` node passing a node or a value', () => {
    const expectedNodeValue = 42,
      expectedNode = new Node(expectedNodeValue),
      node = new Node(0);

    node.insertPrev(expectedNodeValue);
    expect(node.prev).toHaveProperty('value', expectedNodeValue);

    node.removePrev();
    expect(node.prev).toBeUndefined();

    node.insertPrev(expectedNode);
    expect(node.prev).toBe(expectedNode);
  });

  it('should allow us to remove the `next` node', () => {
    const expected = {},
      node = new Node('', null, expected);

    expect(node.next).toHaveProperty('value', expected);

    expect(node.removeNext()?.value).toBe(expected);
    expect(node).toHaveProperty('next', undefined);
  });

  it('should allow us to insert the `next` node passing a node or a value', () => {
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
