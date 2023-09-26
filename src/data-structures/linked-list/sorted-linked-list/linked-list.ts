import { BaseLinkedList } from '../base-linked-list';
import {
  Element,
  SortingTypes,
  SortingComparer,
  SortingComparerResults,
  ISortedLinkedList,
  IFilledSortedLinkedList,
} from './types';
import { DNode as Node, ISingleNode as INode } from '../node';

export type NodeSortingComparer<T> = (
  a: INode<T>,
  b: INode<T>,
) => SortingComparerResults;

export const DEFAULT_COMPARERS = {
  ASC: (a: any, b: any) => {
    if (a === b) return 0;
    return a > b ? 1 : -1;
  },
  DESC: (a: any, b: any) => {
    if (a === b) return 0;
    return a > b ? -1 : 1;
  },
};

export class SortedLinkedList<T>
  extends BaseLinkedList<T, INode<T>>
  implements ISortedLinkedList<T>
{
  public static readonly Node = Node;

  public static order<T>(
    order: SortingTypes,
    comparer: SortingComparer<T> = DEFAULT_COMPARERS[order],
  ): SortedLinkedList<T> {
    const result = new SortedLinkedList<T>();
    result.__setType(order);
    result.__setComparer(comparer);
    return result;
  }

  private _type: SortingTypes = 'ASC';
  private _compare!: NodeSortingComparer<T>;

  constructor(...elements: Element<T>[]) {
    super();
    this.__setComparer(DEFAULT_COMPARERS.ASC);
    this.add(...elements);
  }

  public *[Symbol.iterator]() {
    let node = this.head;

    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  public __setType(type: SortingTypes) {
    this._type = type;
  }

  public __setComparer(comparer: SortingComparer<T>) {
    this._compare = (a, b) => comparer(a.value, b.value);
  }

  public get type() {
    return this._type;
  }

  public notEmpty(): this is IFilledSortedLinkedList<T> {
    return !this.isEmpty;
  }

  public add(...elements: Element<T>[]): void {
    for (const element of elements) {
      this.insert(this._nodeFrom(element));
    }
  }

  public insert(node: INode<T>): void {
    if (!this.notEmpty()) {
      this.head = node;
      this.tail = node;
      this._size++;
      return;
    }

    if (this._compare(node, this.head) <= 0)
      return this._attachToBeginning(node);

    if (this._compare(node, this.tail) >= 0) return this._attachToEnd(node);

    let previous: INode<T> | undefined = undefined,
      current: INode<T> | undefined = this.head;

    while (current) {
      const result = this._compare(node, current);
      switch (result) {
        case -1: {
          node.next = current;

          if (previous) {
            previous.next = node;
          } else {
            this.head = node;
          }

          break;
        }
        case 0: {
          node.next = current.next;
          current.next = node;
          if (!node.next) this.tail = node;
          break;
        }
        case 1:
          break;
      }

      if (result !== 1) {
        this._size++;
        break;
      }

      previous = current;
      current = current.next;
    }
  }

  private _attachToEnd(node: INode<T>) {
    if (this.tail) this.tail.next = node;
    this.tail = node;
    this._size++;
  }

  private _attachToBeginning(node: INode<T>) {
    node.next = this.head;
    this.head = node;
    this._size++;
  }

  public removeAt(index: number): T | undefined {
    const found = this.nodeAt(index);
    return found && this.remove(found);
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

  public nodeAt(index: number): INode<T> | undefined {
    if (index < 0) index = this._size + index;
    if (this._isOutRangeIndex(index)) return;

    if (!this.notEmpty()) return;

    if (index === 0) return this.head;
    if (index === this._size - 1) return this.tail;

    return this._findAt(index).node;
  }

  protected _findAt(index: number): {
    node: INode<T> | undefined;
    index: number;
  } {
    return this._find((_: unknown, _index: number) => _index === index);
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
}
