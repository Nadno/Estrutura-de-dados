import { isPrototypeOf } from '@utils/is-prototype-of';
import { Element } from '../doubly-linked-list/types';
import { IDoublyNode } from './types';

export class DNode<T> implements IDoublyNode<T> {
  public prev: IDoublyNode<T> | undefined;
  public next: IDoublyNode<T> | undefined;

  public static isNode<T>(value: unknown): value is DNode<T> {
    return isPrototypeOf(DNode, value);
  }

  constructor(public value: T, prev?: Element<T>, next?: Element<T>) {
    if (next) this.insertNext(next);
    if (prev) this.insertPrev(prev);
  }

  public insertNext(value: Element<T>): void {
    this.next = DNode.isNode<T>(value)
      ? value
      : (new DNode<T>(value) as IDoublyNode<T>);
  }

  public removeNext(): IDoublyNode<T> | undefined {
    if (!this.next) return;
    const result = this.next;
    this.next = undefined;
    return result;
  }

  public attachNext(value: Element<T>): void {
    const node = DNode.isNode<T>(value)
      ? value
      : (new DNode<T>(value) as IDoublyNode<T>);

    if (this.next) this.next.prev = node;
    node.next = this.next;
    node.prev = this;
    this.next = node;
  }

  public detachNext(): IDoublyNode<T> | undefined {
    if (!this.next) return;
    const node = this.removeNext();
    this.next = node?.next;
    if (this.next) this.next.prev = this;
    return node;
  }

  public insertPrev(value: T | IDoublyNode<T>): void {
    this.prev = DNode.isNode<T>(value) ? value : new DNode<T>(value);
  }

  public removePrev(): IDoublyNode<T> | undefined {
    if (!this.prev) return;
    const result = this.prev;
    this.prev = undefined;
    return result;
  }

  public attachPrev(value: T | IDoublyNode<T>): void {
    const node = DNode.isNode<T>(value) ? value : new DNode<T>(value);
    node.next = this;
    this.prev = node;
  }

  public detachPrev(): IDoublyNode<T> | undefined {
    if (!this.prev) return;
    const node = this.removePrev();
    this.prev = node?.next;
    if (this.prev) this.prev.next = this;
    return node;
  }

  public detach(): IDoublyNode<T> | undefined {
    this.prev && (this.prev.next = this.next);
    this.next && (this.next.prev = this.prev);
    return this;
  }
}
