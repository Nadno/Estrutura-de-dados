import { ISingleNode } from './node';
import { ISingleLinkedNode } from './node/types';
import { Element } from './single-linked-list/types';

export interface IBaseLinkedList<
  TValue,
  TNode extends ISingleLinkedNode<TValue>,
> {
  head: TNode | undefined;
  tail: TNode | undefined;
  size: number;
  isEmpty: boolean;

  at(index: number): TValue | undefined;
  nodeAt(index: number): TNode | undefined;
  indexOf(element: Element<TValue>): number;
}

export abstract class BaseLinkedList<TValue, TNode extends ISingleNode<TValue>>
  implements IBaseLinkedList<TValue, TNode>
{
  public head: TNode | undefined;
  public tail: TNode | undefined;
  protected _size = 0;

  constructor(...elements: Element<TValue>[]) {
    this.add(...elements);
  }

  public get size() {
    return this._size;
  }

  public get isEmpty(): boolean {
    return this._size === 0;
  }

  public at(index: number): TValue | undefined {
    const result = this.nodeAt(index);
    return result && result.value;
  }

  public abstract nodeAt(index: number): TNode | undefined;

  public indexOf(element: Element<TValue>): number {
    const findElement = this._isNode(element)
      ? (node: TNode) => node === element
      : (node: TNode) => node.value === element;

    return this._find(findElement).index;
  }

  public abstract add(...elements: Element<TValue>[]): void;

  protected arrayToLinkedNodes(elements: Element<TValue>[]) {
    let currentElement = 0;

    const head = this._nodeFrom(elements[currentElement++]);

    let tail: TNode = head;

    while (currentElement < elements.length) {
      tail.attachNext(elements[currentElement]);
      if (tail.next) tail = tail.next as TNode;
      currentElement++;
    }

    return { head, tail };
  }

  protected _find(predicate: (node: TNode, index: number) => boolean) {
    let count = 0,
      node = this.head;

    while (node) {
      if (predicate(node, count)) break;
      count++;
      node = node.next as TNode;
    }

    return { node, index: node ? count : -1 };
  }

  protected abstract _findAt(index: number): {
    node: TNode | undefined;
    index: number;
  };

  protected abstract _isOutRangeIndex(index: number): boolean;

  protected abstract _isNode(value: any): value is TNode;

  protected abstract _nodeFrom(element: Element<TValue>): TNode;
}
