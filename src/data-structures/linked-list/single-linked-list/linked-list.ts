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
    if (!Number.isInteger(index))
      throw new TypeError(`The index "${index}" must be a valid integer!`);

    const isOutOfRange = index < 0 || index > this.#size - 1;
    if (isOutOfRange)
      throw new RangeError(
        `The index "${index}" is out of the range of the linked list!`,
      );

    let count = 0,
      node = this.head;

    while (node && count < index) {
      count++;
      node = node.next;
    }

    return node;
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
