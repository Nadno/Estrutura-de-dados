import { createEmptyObject } from '../../utils/create-empty-object';
import type { IQueue } from './types';

export class Queue<T> implements IQueue<T> {
  #start = 0;
  #end = 0;
  #elements = createEmptyObject<number, T>();

  constructor(...elements: T[]) {
    this.enqueue(...elements);
  }

  public get isEmpty(): boolean {
    return this.#start === this.#end;
  }

  public get size(): number {
    return this.#end - this.#start;
  }

  public *[Symbol.iterator]() {
    for (let index = this.#start; index < this.#end; index++) {
      yield this.#elements[index];
    }
  }

  public enqueue(...elements: T[]): void {
    for (const element of elements) {
      this.#elements[this.#end++] = element;
    }
  }

  public dequeue(): T | undefined {
    if (this.isEmpty) return;

    const result = this.#elements[this.#start];
    delete this.#elements[this.#start++];

    return result;
  }

  public peek(): T | undefined {
    if (this.isEmpty) return;
    return this.#elements[this.#start];
  }

  public clear(): void {
    while (!this.isEmpty) {
      this.dequeue();
    }

    this.#start = 0;
    this.#end = 0;
  }
}
