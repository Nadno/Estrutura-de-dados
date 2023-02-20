import { describe, expect, it } from 'vitest';
import { Queue } from '@structures/queue';

const numberElements = [1, 2, 3, 4, 5];

describe('Queue data structure', () => {
  it('should add an element to the queue', () => {
    const queue = new Queue<string>();
    queue.enqueue('foo');
    expect([...queue]).toEqual(['foo']);
  });

  it('should add elements to the queue', () => {
    const elements = [...numberElements];

    const queue = new Queue<number>();
    queue.enqueue(...elements);
    expect([...queue]).toEqual(elements);
  });

  it('should remove elements from the queue', () => {
    const elements = [...numberElements];
    const queue = new Queue(...elements);

    elements.forEach((element) => expect(element).toBe(queue.dequeue()));
  });

  it('should supply a `size` property for the queue', () => {
    const elements = [...numberElements];
    const queue = new Queue();
    expect(queue.size).toBe(0);

    elements.forEach((element, index) => {
      queue.enqueue(element);
      expect(queue.size).toBe(index + 1);
    });

    elements.forEach(() => {
      const previousSize = queue.size;
      queue.dequeue();
      expect(queue.size).toBe(previousSize - 1);
    });

    expect(queue.size).toBe(0);
  });

  it('should supply an `isEmpty` property for the queue', () => {
    const elements = [...numberElements];
    const queue = new Queue();

    expect(queue.isEmpty).toBe(true);
    expect(queue.size).toBe(0);

    elements.forEach((element) => {
      queue.enqueue(element);
      expect(queue.isEmpty).toBe(false);
      expect(queue.size).toBeGreaterThan(0);
    });

    elements.forEach(() => {
      expect(queue.isEmpty).toBe(false);
      expect(queue.size).toBeGreaterThan(0);
      queue.dequeue();
    });

    expect(queue.isEmpty).toBe(true);
    expect(queue.size).toBe(0);
  });

  it('should instantiate the queue with multiple elements', () => {
    const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const queue = new Queue(...elements);

    expect(queue.isEmpty).toBe(false);
    expect(queue.size).toBe(elements.length);
    expect([...queue]).toEqual(elements);
  });

  it('should get the first element within the queue', () => {
    const elements = [...numberElements];
    const queue = new Queue();

    elements.forEach((element, index) => {
      queue.enqueue(element);

      const isAddingTheFirstElement = index === 0;
      isAddingTheFirstElement
        ? expect(element).toBe(queue.peek())
        : expect(element).not.toBe(queue.peek());
    });

    elements.forEach(() => {
      const first = queue.peek();
      expect(queue.dequeue()).toBe(first);
      expect(queue.peek()).not.toBe(first);
    });
  });

  it('should clear the queue', () => {
    const elements = [...numberElements];
    const queue = new Queue(...elements);

    expect(queue.isEmpty).toBe(false);
    expect(queue.size).toBe(elements.length);

    queue.clear();

    expect(queue.isEmpty).toBe(true);
    expect(queue.size).toBe(0);
  });
});
