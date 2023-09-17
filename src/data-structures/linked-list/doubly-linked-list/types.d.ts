import type { IDoublyNode as INode } from '../node';

export type Element<T> = T | INode<T>;

export interface IDLinkedList<T> extends IBaseLinkedList<T, INode<T>> {
  notEmpty(): boolean;
  push(...elements: Element<T>[]): void;
  pop(): T | undefined;
  unshift(...elements: Element<T>[]): void;
  shift(): T | undefined;
  insert(
    where: 'before' | 'after',
    index: number,
    elements: Element<T> | Element<T>[]
  ): void;
  remove(element: INode<T>): T | undefined;
  removeAt(index: number): T | undefined;
}

export interface IFilledDLinkedList<T> extends IDLinkedList<T> {
  head: INode<T>;
  tail: INode<T>;
}
