import { isPrototypeOf } from '@utils/is-prototype-of';
import { ISingleLinkedNode } from './types';

export class SNode<T> implements ISingleLinkedNode<T> {
  public next: ISingleLinkedNode<T> | undefined;

  public static isNode<T>(value: unknown): value is SNode<T> {
    return isPrototypeOf(SNode, value);
  }

  constructor(public value: T, nextValue?: T | ISingleLinkedNode<T>) {
    if (nextValue) this.insertNext(nextValue);
  }

  public insertNext(value: T | ISingleLinkedNode<T>): void {
    this.next = SNode.isNode<T>(value) ? value : new SNode<T>(value);
  }

  public removeNext(): ISingleLinkedNode<T> | undefined {
    if (!this.next) return;
    const result = this.next;
    this.next = undefined;
    return result;
  }
}
