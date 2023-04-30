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
    if (index < 0) index = this.size + index;
    if (this._isOutRangeIndex(index)) return;
    return this._find((_, count) => count === index).node;
  }

  public indexOf(element: Element<T>): number {
    const findElement = Node.isNode(element)
      ? (node: INode<T>) => node === element
      : (node: INode<T>) => node.value === element;

    return this._find(findElement).index;
  }

  public insert(
    where: 'before' | 'after',
    index: number,
    elements: Element<T> | Element<T>[],
  ): void {
    if (index < 0) index = this.size + index;

    if (index !== 0 && this._isOutRangeIndex(index))
      throw new Error(
        `The index "${index}" is out of range of the list of size "${this.size}".`,
      );

    elements = Array.isArray(elements) ? elements : [elements];

    if (index === 0) {
      const { head, tail } = this.arrayToLinkedNodes(elements);

      if (!this.notEmpty()) {
        this.head = head;
        this.tail = tail;
        this.#size += elements.length;
        return;
      }

      if (where === 'before') {
        tail.next = this.head;
        this.head = head;
      } else {
        tail.next = this.head.next;
        this.head.next = head;
      }

      this.#size += elements.length;
      return;
    }

    if (where === 'before') index = index - 1;

    const { node: prevNode } = this._find((_, _index) => _index === index);
    if (!prevNode) return;

    const { head, tail } = this.arrayToLinkedNodes(elements);

    tail.next = prevNode.next;
    prevNode.next = head;

    if (where === 'after') this.tail = tail;

    this.#size += elements.length;
  }

  private arrayToLinkedNodes(elements: Element<T>[]) {
    let currentElement = 0;

    const head = this.nodeFrom(elements[currentElement++]);

    let tail: INode<T> = head;

    while (currentElement < elements.length) {
      tail.insertNext(elements[currentElement]);
      if (tail.next) tail = tail.next;
      currentElement++;
    }

    return { head, tail };
  }

  public removeAt(index: number): T | undefined {
    if (this._isOutRangeIndex(index)) return;

    if (index === 0) {
      const first = this.head as INode<T>;
      this.head = first.next;
      this.#size--;
      return first.value;
    }

    const { node: prevNode } = this._find((_, _index) => _index === index - 1);
    if (!prevNode) return;

    const node = prevNode.removeNext() as INode<T>;
    node.next && prevNode.insertNext(node.removeNext() as INode<T>);
    this.#size--;

    return node && node.value;
  }

  public remove(node: INode<T>): T | undefined {
    if (this.head === node) {
      this.head = this.head.next;
      this.#size--;
      return node.value;
    }

    const { node: prevNode } = this._find((current) => current.next === node);
    if (!prevNode) return;

    prevNode.insertNext(node.removeNext() as INode<T>);
    this.#size--;

    return node.value;
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
