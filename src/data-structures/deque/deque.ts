import { createEmptyObject } from '../../main';
import { IDeque } from './types';

export class Deque<T> implements IDeque<T> {
  #start = 0;
  #end = 0;
  #elements = createEmptyObject<number, T>();

  constructor(...elements: T[]) {
    this.addRear(...elements);
  }

  get front(): T | undefined {
    if (this.isEmpty) return;
    return this.#elements[this.#start];
  }

  get rear(): T | undefined {
    if (this.isEmpty) return;
    return this.#elements[this.#end - 1];
  }

  get isEmpty(): boolean {
    return this.#start === this.#end;
  }

  get size(): number {
    const result = this.#end - this.#start;
    if (this.#end < 0) return result * -1;
    return result;
  }

  public *[Symbol.iterator]() {
    for (let index = this.#start; index < this.#end; index++) {
      yield this.#elements[index];
    }
  }

  public addFront(...elements: T[]): void {
    for (const element of elements) {
      this.#elements[--this.#start] = element;
    }
  }

  public removeFront(): T | undefined {
    if (this.isEmpty) return;
    const result = this.front;
    delete this.#elements[this.#start++];
    return result;
  }

  public addRear(...elements: T[]): void {
    for (const element of elements) {
      this.#elements[this.#end++] = element;
    }
  }

  public removeRear(): T | undefined {
    if (this.isEmpty) return;
    const result = this.rear;
    delete this.#elements[this.#end--];
    return result;
  }

  public clear(): void {
    while (!this.isEmpty) {
      this.removeFront();
      this.removeRear();
    }

    this.#start = 0;
    this.#end = 0;
  }
}
