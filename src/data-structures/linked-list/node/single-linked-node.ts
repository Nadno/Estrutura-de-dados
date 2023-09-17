import { isPrototypeOf } from '@utils/is-prototype-of';
import { Element } from '../single-linked-list/types';
import { ISingleNode } from './types';

export class SNode<T> implements ISingleNode<T> {
  public next: ISingleNode<T> | undefined;

  public static isNode<T>(value: unknown): value is SNode<T> {
    return isPrototypeOf(SNode, value);
  }

  constructor(public value: T, nextValue?: Element<T>) {
    if (nextValue) this.insertNext(nextValue);
  }

  public insertNext(value: Element<T>): void {
    this.next = SNode.isNode<T>(value)
      ? value
      : (new SNode<T>(value) as ISingleNode<T>);
  }

  public removeNext(): ISingleNode<T> | undefined {
    if (!this.next) return;
    const result = this.next;
    this.next = undefined;
    return result;
  }

  public attachNext(value: Element<T>): void {
    const node = SNode.isNode<T>(value)
      ? value
      : (new SNode<T>(value) as ISingleNode<T>);
    node.next = this.next;
    this.next = node;
  }

  public detachNext(): ISingleNode<T> | undefined {
    if (!this.next) return;
    const node = this.removeNext();
    this.next = node?.next;
    return node;
  }
}
