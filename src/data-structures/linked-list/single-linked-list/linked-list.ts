import { SNode as Node, ISingleNode as INode } from '../node';
import { BaseLinkedList } from '../base-linked-list';
import { Element, ISLinkedList, IFilledSLinkedList } from './types';

/**
 * A Single Linked List data structure.
 *
 * Linked Lists consume a bit more memory than an Array,
 * but they can do less expensive operations (e.g add and remove).
 */
export class SLinkedList<T>
  extends BaseLinkedList<T, INode<T>>
  implements ISLinkedList<T>
{
  public static readonly Node = Node;

  public static from<T>(iterable: Iterable<T>): ISLinkedList<T> {
    return new SLinkedList(...iterable);
  }

  public *[Symbol.iterator]() {
    let node = this.head;

    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  public notEmpty(): this is IFilledSLinkedList<T> {
    return !this.isEmpty;
  }

  public nodeAt(index: number): INode<T> | undefined {
    if (index < 0) index = this.size + index;
    if (this._isOutRangeIndex(index)) return;
    return this._findAt(index).node;
  }

  public insert(
    where: 'before' | 'after',
    index: number,
    elements: Element<T> | Element<T>[],
  ): void {
    if (index < 0) index = this._size + index;

    if (index !== 0 && this._isOutRangeIndex(index))
      throw new Error(
        `The index "${index}" is out of range of the list of size "${this.size}".`,
      );

    if (!Array.isArray(elements)) elements = [elements];

    if (index === 0) {
      const { head, tail } = this.arrayToLinkedNodes(elements);

      if (!this.notEmpty()) {
        this.head = head;
        this.tail = tail;
        this._size += elements.length;
        return;
      }

      if (where === 'before') {
        tail.next = this.head;
        this.head = head;
      } else {
        tail.next = this.head.next;
        this.head.next = head;
      }

      this._size += elements.length;
      return;
    }

    if (where === 'before') index = index - 1;

    const { node: prevNode } = this._findAt(index);
    if (!prevNode) return;

    const { head, tail } = this.arrayToLinkedNodes(elements);

    tail.next = prevNode.next;
    prevNode.next = head;

    if (where === 'after') this.tail = tail;

    this._size += elements.length;
  }

  public removeAt(index: number): T | undefined {
    if (this._isOutRangeIndex(index)) return;

    if (index === 0) {
      const first = this.head as INode<T>;
      this.head = first.next;
      this._size--;
      return first.value;
    }

    const { node: prevNode } = this._findAt(index - 1);
    if (!prevNode) return;

    const node = prevNode.detachNext();
    this._size--;

    return node && node.value;
  }

  public remove(node: INode<T>): T | undefined {
    if (this.head === node) {
      this.head = this.head.next;
      this._size--;

      if (this.tail === node) this.tail = this.head;

      return node.value;
    }

    const { node: prevNode } = this._find((current) => current.next === node);
    if (!prevNode) return;

    prevNode.detachNext();
    this._size--;

    if (this.tail === node) this.tail = prevNode;

    return node.value;
  }

  protected _isOutRangeIndex(index: number) {
    if (!Number.isInteger(index))
      throw new TypeError(`The index "${index}" must be a valid integer!`);

    if (this.isEmpty) return true;
    return index < 0 || index > this._size - 1;
  }

  public push(...elements: Element<T>[]) {
    return this.add(...elements);
  }

  public add(...elements: Element<T>[]): void {
    const elementsQuantity = elements.length;
    if (!elementsQuantity) return;

    const isEmpty = this.isEmpty;
    if (isEmpty) this.insertFirst(elements[0]);
    if (!this.notEmpty()) return;

    for (let index = isEmpty ? 1 : 0; index < elementsQuantity; index++) {
      this.tail.insertNext(elements[index]);
      this.tail = this.tail.next as INode<T>;
      this._size++;
    }
  }

  public unshift(...elements: Element<T>[]): void {
    const elementsQuantity = elements.length;
    if (!elementsQuantity) return;

    const isEmpty = this.isEmpty;
    if (isEmpty) this.insertFirst(elements[0]);
    if (!this.notEmpty()) return;

    for (let index = isEmpty ? 1 : 0; index < elementsQuantity; index++) {
      const newHead = this._nodeFrom(elements[index]);
      newHead.insertNext(this.head);
      this.head = newHead;
      this._size++;
    }
  }

  private insertFirst(element: Element<T>): void {
    this.head = this._nodeFrom(element);
    this.tail = this.head;
    this._size++;
  }

  protected _findAt(index: number) {
    return this._find((_: unknown, _index: number) => _index === index);
  }

  protected _nodeFrom(element: Element<T>): INode<T> {
    return this._isNode(element) ? element : new Node<T>(element);
  }

  protected _isNode(value: any): value is INode<T> {
    return Node.isNode(value);
  }
}
