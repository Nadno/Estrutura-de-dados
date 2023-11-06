import type { ISingleNode as INode } from '../node';
import type { IBaseLinkedList } from '../base-linked-list';

export type Element<T> = T | INode<T>;

export type SortingTypes = 'ASC' | 'DESC';

export type SortingComparerResults = 0 | 1 | -1;

export type SortingComparer<T> = (a: T, b: T) => SortingComparerResults;

export interface ISortedLinkedList<T> extends IBaseLinkedList<T, INode<T>>, Iterable<T> {
  type: SortingTypes;

  add(...element: Element<T>[]): void;
  insert(node: INode<T>): void;
  notEmpty(): boolean;
  removeAt(index: number): T | undefined;
  remove(node: INode<T>): T | undefined;
}

export interface IFilledSortedLinkedList<T> extends ISortedLinkedList<T> {
  head: INode<T>;
  tail: INode<T>;
}
