import { describe, expect, it } from 'vitest';
import { Deque } from '@structures/deque';

const numberElements = [1, 2, 3, 4, 5];

describe('Deque data structure', () => {
  it('should add elements to rear the deque', () => {
    const deque = new Deque<number>();
    deque.addRear(0);
    deque.addRear(...numberElements);
    expect([...deque]).toEqual([0, ...numberElements]);
  });

  it('should add elements to front of the deque', () => {
    const deque = new Deque<number>();
    deque.addFront(0);
    deque.addFront(...numberElements);
    expect([...deque]).toEqual([0, ...numberElements].reverse());
  });

  it('should remove elements from front of the deque', () => {
    const elements = [...numberElements];
    const deque = new Deque(...elements);

    elements.forEach((element) => expect(deque.removeFront()).toBe(element));
  });

  it('should remove elements from rear of the deque', () => {
    const elements = [...numberElements];
    const deque = new Deque(...elements);

    elements
      .reverse()
      .forEach((element) => expect(deque.removeRear()).toBe(element));
  });

  it('should supply a `front` property for the deque', () => {
    const elements = [...numberElements];
    const deque = new Deque();

    expect(deque.front).toBeUndefined();

    elements.forEach((element) => {
      deque.addFront(element);
      expect(deque.front).toBe(element);
    });

    elements.forEach(() => {
      const front = deque.front;
      expect(deque.removeFront()).toBe(front);
      expect(deque.front).not.toBe(front);
    });

    expect(deque.rear).toBeUndefined();
  });

  it('should supply a `rear` property for the deque', () => {
    const elements = [...numberElements];
    const deque = new Deque();

    expect(deque.rear).toBeUndefined();

    elements.forEach((element) => {
      deque.addRear(element);
      expect(deque.rear).toBe(element);
    });

    elements.forEach(() => {
      const rear = deque.rear;
      expect(deque.removeRear()).toBe(rear);
      expect(deque.rear).not.toBe(rear);
    });

    expect(deque.rear).toBeUndefined();
  });

  it('should supply a `size` property for the deque', () => {
    const elements = [...numberElements];
    const deque = new Deque();
    expect(deque.size).toBe(0);

    elements.forEach((element, index) => {
      index % 2 === 0 ? deque.addFront(element) : deque.addRear(element);
      expect(deque.size).toBe(index + 1);
    });

    elements.forEach((_, index) => {
      const previousSize = deque.size;
      index % 2 === 0 ? deque.removeFront() : deque.removeRear();
      expect(deque.size).toBe(previousSize - 1);
    });

    expect(deque.size).toBe(0);
  });

  it('should supply an `isEmpty` property for the deque', () => {
    const elements = [...numberElements];
    const deque = new Deque();

    expect(deque.isEmpty).toBe(true);
    expect(deque.size).toBe(0);

    elements.forEach((element, index) => {
      index % 2 === 0 ? deque.addFront(element) : deque.addRear(element);
      expect(deque.isEmpty).toBe(false);
      expect(deque.size).toBeGreaterThan(0);
    });

    elements.forEach((_, index) => {
      expect(deque.isEmpty).toBe(false);
      expect(deque.size).toBeGreaterThan(0);
      index % 2 === 0 ? deque.removeFront() : deque.removeRear();
    });

    expect(deque.isEmpty).toBe(true);
    expect(deque.size).toBe(0);
  });

  it('should instantiate the deque with multiple elements', () => {
    const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const deque = new Deque(...elements);

    expect(deque.isEmpty).toBe(false);
    expect(deque.size).toBe(elements.length);
    expect([...deque]).toEqual(elements);
  });

  it('should clear the deque', () => {
    const elements = [...numberElements];
    const deque = new Deque(...elements);

    expect(deque.isEmpty).toBe(false);
    expect(deque.size).toBe(elements.length);

    deque.clear();

    expect(deque.isEmpty).toBe(true);
    expect(deque.size).toBe(0);
  });
});
