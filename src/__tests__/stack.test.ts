import { describe, expect, it } from 'vitest';
import { Stack } from '../main';

const stringElements = ['foo', 'bar', 'qux', 'sinz'];

describe('Stack data structure', () => {
  it('should add an element to the stack', () => {
    const stack = new Stack<string>();
    stack.push('foo');
    expect([...stack]).toEqual(['foo']);
  });

  it('should add elements to the stack', () => {
    const elements = [...stringElements];

    const stack = new Stack<string>();
    stack.push(...elements);
    expect([...stack]).toEqual(elements);
  });

  it('should remove elements from the stack', () => {
    const elements = [...stringElements];
    const stack = new Stack(...elements);

    elements.reverse().forEach((element) => expect(element).toBe(stack.pop()));
  });

  it('should supply a `size` property for the stack', () => {
    const elements = [...stringElements];
    const stack = new Stack();
    expect(stack.size).toBe(0);

    elements.forEach((element, index) => {
      stack.push(element);
      expect(stack.size).toBe(index + 1);
    });

    elements.forEach(() => {
      const previousSize = stack.size;
      stack.pop();
      expect(stack.size).toBe(previousSize - 1);
    });
  });

  it('should supply a `isEmpty` property for the stack', () => {
    const elements = [...stringElements];
    const stack = new Stack();

    expect(stack.isEmpty).toBe(true);
    expect(stack.size).toBe(0);

    elements.forEach((element) => {
      stack.push(element);
      expect(stack.isEmpty).toBe(false);
      expect(stack.size).toBeGreaterThan(0);
    });

    elements.forEach(() => {
      expect(stack.isEmpty).toBe(false);
      expect(stack.size).toBeGreaterThan(0);
      stack.pop();
    });

    expect(stack.isEmpty).toBe(true);
    expect(stack.size).toBe(0);
  });

  it('should instantiate the stack with multiple elements', () => {
    const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const stack = new Stack(...elements);

    expect(stack.isEmpty).toBe(false);
    expect(stack.size).toBe(elements.length);
    expect([...stack]).toEqual(elements);
  });

  it('should get the top element within the stack', () => {
    const elements = [...stringElements];
    const stack = new Stack();

    elements.forEach((element) => {
      stack.push(element);
      expect(element).toBe(stack.peek());
    });

    elements.forEach(() => {
      const top = stack.peek();
      expect(stack.pop()).toBe(top);
      expect(stack.peek()).not.toBe(top);
    });
  });

  it('should clear the stack', () => {
    const elements = [...stringElements];
    const stack = new Stack(...elements);

    expect(stack.isEmpty).toBe(false);
    expect(stack.size).toBe(elements.length);

    stack.clear();

    expect(stack.isEmpty).toBe(true);
    expect(stack.size).toBe(0);
  });
});
