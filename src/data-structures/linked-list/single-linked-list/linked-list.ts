import { SNode as Node, ISingleLinkedNode as INode } from '../node';
import { Element, ISLinkedList, IFilledSLinkedList } from './types';

/**
 * A Single Linked List data structure.
 *
 * Linked Lists consume a bit more memory than an Array,
 * but they can do less expensive operations (e.g add and remove).
 */
export class SLinkedList<T> implements ISLinkedList<T> {
  public static readonly Node = Node;
  public head: INode<T> | undefined;
  public tail: INode<T> | undefined;
  #size = 0;

  constructor(...elements: Element<T>[]) {
    this.push(...elements);
  }

  public get size() {
    return this.#size;
  }

  public *[Symbol.iterator]() {
    let node = this.head;

    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  public get isEmpty(): boolean {
    return !this.notEmpty();
  }

  public notEmpty(): this is IFilledSLinkedList<T> {
    return this.size > 0;
  }

  public at(index: number): T | undefined {
    const result = this.nodeAt(index);
    return result && result.value;
  }

  public nodeAt(index: number): INode<T> | undefined {
    if (this._isOutRangeIndex(index)) return;
    return this._find((_, count) => count === index).node;
  }

  public indexOf(element: Element<T>): number {
    const findElement = Node.isNode(element)
      ? (node: INode<T>) => node === element
      : (node: INode<T>) => node.value === element;

    return this._find(findElement).index;
  }

  private _isOutRangeIndex(index: number) {
    if (!Number.isInteger(index))
      throw new TypeError(`The index "${index}" must be a valid integer!`);

    if (this.isEmpty) return true;
    return index < 0 || index > this.#size - 1;
  }

  private _find(predicate: (node: INode<T>, index: number) => boolean) {
    let count = 0,
      node = this.head;

    while (node) {
      if (predicate(node, count)) break;
      count++;
      node = node.next;
    }

    return { node, index: node ? count : -1 };
  }

  public push(...elements: Element<T>[]): void {
    const elementsQuantity = elements.length;
    if (!elementsQuantity) return;

    const isEmpty = this.isEmpty;
    if (isEmpty) this.insertFirst(elements[0]);
    if (!this.notEmpty()) return;

    for (let index = isEmpty ? 1 : 0; index < elementsQuantity; index++) {
      this.tail.insertNext(elements[index]);
      this.tail = this.tail.next as INode<T>;
      this.#size++;
    }
  }

  public unshift(...elements: Element<T>[]): void {
    const elementsQuantity = elements.length;
    if (!elementsQuantity) return;

    const isEmpty = this.isEmpty;
    if (isEmpty) this.insertFirst(elements[0]);
    if (!this.notEmpty()) return;

    for (let index = isEmpty ? 1 : 0; index < elementsQuantity; index++) {
      const newHead = this.nodeFrom(elements[index]);
      newHead.insertNext(this.head);
      this.head = newHead;
      this.#size++;
    }
  }

  private insertFirst(element: Element<T>): void {
    this.head = this.nodeFrom(element);
    this.tail = this.head;
    this.#size++;
  }

  private nodeFrom(element: Element<T>): INode<T> {
    return Node.isNode<T>(element) ? element : new Node<T>(element);
  }
}
