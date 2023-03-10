import type { IStack } from './types';

export class Stack<T> implements IStack<T> {
  #elements: T[] = [];

  constructor(...elements: T[]) {
    this.push(...elements);
  }

  public get size() {
    return this.#elements.length;
  }

  public get isEmpty() {
    return this.size === 0;
  }

  public *[Symbol.iterator]() {
    for (let index = 0; index < this.size; index++) {
      yield this.#elements[index];
    }
  }

  public push(...elements: T[]): void {
    for (let index = 0; index < elements.length; index++) {
      this.#elements[this.size] = elements[index];
    }
  }

  public pop(): T {
    const result = this.#elements[this.size - 1];

    const oldElements = this.#elements;
    this.clear();

    for (let index = 0; index < oldElements.length - 1; index++) {
      this.#elements[index] = oldElements[index];
    }

    return result;
  }

  public peek(): T {
    return this.#elements[this.size - 1];
  }

  public clear(): void {
    this.#elements = [];
  }
}
