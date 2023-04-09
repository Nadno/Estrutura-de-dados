import type { ISingleLinkedNode as INode } from '../node';

export type Element<T> = T | INode<T>;

export interface ISLinkedList<T> {
  head: INode<T> | undefined;
  tail: INode<T> | undefined;
  size: number;
  isEmpty: boolean;

  notEmpty(): boolean;
  push(...elements: Element<T>[]): void;
  unshift(...elements: Element<T>[]): void;
  at(index: number): T | undefined;
  nodeAt(index: number): INode<T> | undefined;
  indexOf(element: Element<T>): number;
  insert(elements: Element<T> | Element<T>[], index: number): void;
  remove(element: INode<T>): T | undefined;
  removeAt(index: number): T;
}

export interface IFilledSLinkedList<T> extends ISLinkedList<T> {
  head: INode<T>;
  tail: INode<T>;
}
