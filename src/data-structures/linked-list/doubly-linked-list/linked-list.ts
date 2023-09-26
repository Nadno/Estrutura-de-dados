import { BaseLinkedList } from '../base-linked-list';
import { Element, IDLinkedList, IFilledDLinkedList } from './types';
import { DNode as Node, IDoublyNode as INode } from '../node';

export class DLinkedList<T>
  extends BaseLinkedList<T, INode<T>>
  implements IDLinkedList<T>
{
  public static readonly Node = Node;

  public static from<T>(iterable: Iterable<T>): IDLinkedList<T> {
    return new DLinkedList(...iterable);
  }

  public *[Symbol.iterator]() {
    let node = this.head;

    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  public notEmpty(): this is IFilledDLinkedList<T> {
    return !this.isEmpty;
  }

  public nodeAt(index: number): INode<T> | undefined {
    if (index < 0) index = this.size + index;
    if (this._isOutRangeIndex(index)) return;
    return this._findAt(index).node;
  }

  public push(...elements: Element<T>[]) {
    return this.add(...elements);
  }

  public add(...elements: Element<T>[]): void {
    const elementsQuantity = elements.length;
    if (!elementsQuantity) return;

    const isEmpty = this.isEmpty;
    if (isEmpty) this._insertFirst(elements[0]);
    if (!this.notEmpty()) return;

    for (let index = isEmpty ? 1 : 0; index < elementsQuantity; index++) {
      this.tail.attachNext(elements[index]);
      this.tail = this.tail.next as INode<T>;
      this._size++;
    }
  }

  public pop(): T | undefined {
    if (!this.notEmpty()) return;
    return this.remove(this.tail);
  }

  public unshift(...elements: Element<T>[]): void {
    const elementsQuantity = elements.length;
    if (!elementsQuantity) return;

    const isEmpty = this.isEmpty;
    if (isEmpty) this._insertFirst(elements[0]);
    if (!this.notEmpty()) return;

    for (let index = isEmpty ? 1 : 0; index < elementsQuantity; index++) {
      this.head.attachPrev(elements[index]);
      this.head = this.head.prev as INode<T>;
      this._size++;
    }
  }

  public shift(): T | undefined {
    if (!this.notEmpty()) return;
    return this.remove(this.head);
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
        this.head.prev = tail;
        tail.next = this.head;
        this.head = head;
      } else {
        const second = this.head.next;
        tail.next = second;
        if (second) second.prev = tail;
        head.prev = this.head;
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
    if (prevNode.next) prevNode.next.prev = tail;
    prevNode.next = head;
    head.prev = prevNode;

    if (where === 'after') this.tail = tail;

    this._size += elements.length;
  }

  public remove(node: INode<T>): T | undefined {
    if (this.head === node) {
      this.head = node.next;
    }

    if (this.tail === node) {
      this.tail = node.prev;
    }

    node.detach();
    this._size--;

    return node.value;
  }

  public removeAt(index: number): T | undefined {
    const node = this.nodeAt(index);
    return node && this.remove(node);
  }

  protected _findAt(index: number) {
    const sameIndex = (_: unknown, _index: number) => _index === index;
    return this._isIndexNearTheEnd(index)
      ? this._findFromEnd(sameIndex)
      : this._find(sameIndex);
  }

  protected _findFromEnd(
    predicate: (node: INode<T>, index: number) => boolean,
  ) {
    let count = this.size - 1,
      node = this.tail;

    while (node) {
      if (predicate(node, count)) break;
      count--;
      node = node.prev as INode<T>;
    }

    return { node, index: node ? count : -1 };
  }

  protected _isIndexNearTheEnd(index: number) {
    return this.size - index < Math.floor(this.size / 2);
  }

  protected _isOutRangeIndex(index: number): boolean {
    if (!Number.isInteger(index))
      throw new TypeError(`The index "${index}" must be a valid integer!`);

    if (this.isEmpty) return true;
    return index < 0 || index > this._size - 1;
  }

  protected _isNode(value: any): value is INode<T> {
    return Node.isNode(value);
  }

  protected _nodeFrom(element: Element<T>): INode<T> {
    return this._isNode(element) ? element : new Node<T>(element);
  }

  private _insertFirst(element: Element<T>): void {
    this.head = this._isNode(element) ? element : new Node(element);
    this.tail = this.head;
    this._size++;
  }
}
