import { describe, expect, it } from 'vitest';
import { PriorityQueue } from '@structures/priority-queue';

const numberElements = [1, 2, 3, 4, 5],
  priorities = ['low', 'medium', 'high'] as const;

describe('Queue data structure', () => {
  it('should add an element to the queue', () => {
    const queue = new PriorityQueue<string>();
    queue.enqueue('foo');
    expect([...queue]).toEqual(['foo']);
  });

  it('should add an element to the queue priority', () => {
    const queue = new PriorityQueue<string>();

    queue.enqueue('low', 'foo');
    queue.enqueue('medium', 'bar');
    queue.enqueue('high', 'qux');

    expect([...queue]).toEqual(['foo', 'bar', 'qux']);
  });

  it('should add elements to the queue priority', () => {
    const elements = [...numberElements];

    const queue = new PriorityQueue<number>();
    queue.enqueue('low', ...elements);
    expect([...queue]).toEqual(elements);
  });

  it('should remove elements from the specified queue priority', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue();

    queue.enqueue('low', ...elements);

    elements.forEach((element) => expect(queue.dequeue('low')).toBe(element));
    expect(queue.dequeue('low')).toBeUndefined();
  });

  it('should supply a `size` method for the queue', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue();
    expect(queue.size()).toBe(0);

    elements.forEach((element, index) => {
      queue.enqueue(element);
      expect(queue.size()).toBe(index + 1);
    });

    elements.forEach(() => {
      const previousSize = queue.size();
      queue.dequeue();
      expect(queue.size()).toBe(previousSize - 1);
    });

    expect(queue.size()).toBe(0);
  });

  it('should supply a `size` method for the queue priorities', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue();

    expect(queue.size()).toBe(0);

    priorities.forEach((priority) => {
      expect(queue.size(priority)).toBe(0);

      elements.forEach((element, index) => {
        queue.enqueue(priority, element);
        expect(queue.size(priority)).toBe(index + 1);
      });

      elements.forEach(() => {
        const previousSize = queue.size(priority);
        queue.dequeue(priority);
        expect(queue.size(priority)).toBe(previousSize - 1);
      });

      expect(queue.size(priority)).toBe(0);
    });
  });

  it('should supply an `isEmpty` method for the queue', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue();

    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);

    elements.forEach((element) => {
      queue.enqueue(element);
      expect(queue.isEmpty()).toBe(false);
      expect(queue.size()).toBeGreaterThan(0);
    });

    elements.forEach(() => {
      expect(queue.isEmpty()).toBe(false);
      expect(queue.size()).toBeGreaterThan(0);
      queue.dequeue();
    });

    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it('should supply an `isEmpty` method for the queue priorities', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue();

    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);

    priorities.forEach((priority) => {
      expect(queue.isEmpty(priority)).toBe(true);
      expect(queue.size(priority)).toBe(0);

      elements.forEach((element) => {
        queue.enqueue(priority, element);
        expect(queue.isEmpty(priority)).toBe(false);
        expect(queue.size(priority)).toBeGreaterThan(0);
      });

      elements.forEach(() => {
        expect(queue.isEmpty(priority)).toBe(false);
        expect(queue.size(priority)).toBeGreaterThan(0);
        queue.dequeue(priority);
      });

      expect(queue.isEmpty(priority)).toBe(true);
      expect(queue.size(priority)).toBe(0);
    });
  });

  it('should fallback the dequeue to the lower priorities when not specifying a priority', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue<number>();

    queue.enqueue('low', ...elements);
    queue.enqueue('medium', ...elements);
    queue.enqueue('high', ...elements);

    // Priority: high
    elements.forEach((element) => expect(queue.dequeue()).toBe(element));
    expect(queue.isEmpty('high')).toBe(true);

    // Priority: medium
    elements.forEach((element) => expect(queue.dequeue()).toBe(element));
    expect(queue.isEmpty('medium')).toBe(true);

    // Priority: low
    elements.forEach((element) => expect(queue.dequeue()).toBe(element));
    expect(queue.isEmpty('low')).toBe(true);
  });

  it('should clear the queue', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue<number>();

    queue.enqueue('low', ...elements);
    queue.enqueue('medium', ...elements);
    queue.enqueue('high', ...elements);

    queue.clear();

    priorities.forEach((priority) => {
      expect(queue.isEmpty(priority)).toBe(true);
      expect(queue.size(priority)).toBe(0);
    });

    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it('should clear the specified queue priority', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue<number>();

    queue.enqueue('low', ...elements);
    queue.enqueue('medium', ...elements);
    queue.enqueue('high', ...elements);

    const [lower, ...other] = priorities;

    other.forEach((priority) => {
      queue.clear(priority);

      expect(queue.isEmpty(priority)).toBe(true);
      expect(queue.size(priority)).toBe(0);
    });

    expect(queue.isEmpty(lower)).not.toBe(true);
    expect(queue.size(lower)).not.toBe(0);

    expect(queue.isEmpty()).not.toBe(true);
    expect(queue.size()).not.toBe(0);
  });

  it('should get the first element within the queue', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue<number>();

    elements.forEach((element, index) => {
      queue.enqueue('low', element);

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

  it('should peek the specified queue priority', () => {
    const queue = new PriorityQueue<number>();

    queue.enqueue('low', 42);
    queue.enqueue('medium', 62);
    queue.enqueue('high', 102);

    expect(queue.peek('low')).toBe(42);
    expect(queue.peek('medium')).toBe(62);
    expect(queue.peek('high')).toBe(102);
  });

  it('should fallback the peek to the lower priority when not specifying a priority', () => {
    const elements = [...numberElements];
    const queue = new PriorityQueue<number>();

    queue.enqueue('low', ...elements);
    queue.enqueue('medium', ...elements);
    queue.enqueue('high', ...elements);

    // Priority: high
    elements.forEach((element) => {
      expect(queue.peek()).toBe(element);
      queue.dequeue();
    });

    expect(queue.isEmpty('high')).toBe(true);

    // Priority: medium
    elements.forEach((element) => {
      expect(queue.peek()).toBe(element);
      queue.dequeue();
    });

    expect(queue.isEmpty('medium')).toBe(true);

    // Priority: low
    elements.forEach((element) => {
      expect(queue.peek()).toBe(element);
      queue.dequeue();
    });

    expect(queue.isEmpty('low')).toBe(true);
  });
});
