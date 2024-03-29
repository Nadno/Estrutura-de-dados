import type { ISingleNode as INode } from '../node';

export type Element<T> = T | INode<T>;

export interface ISLinkedList<T> extends IBaseLinkedList<T, INode<T>> {
  notEmpty(): boolean;
  push(...elements: Element<T>[]): void;
  unshift(...elements: Element<T>[]): void;
  insert(
    where: 'before' | 'after',
    index: number,
    elements: Element<T> | Element<T>[]
  ): void;
  remove(element: INode<T>): T | undefined;
  removeAt(index: number): T | undefined;
}

export interface IFilledSLinkedList<T> extends ISLinkedList<T> {
  head: INode<T>;
  tail: INode<T>;
}
