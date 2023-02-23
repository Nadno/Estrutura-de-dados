export interface ISingleLinkedNode<T> {
  value: T;
  next: ISingleLinkedNode<T> | undefined;
  insertNext(value: T | ISingleLinkedNode<T>): void;
  removeNext(): T | undefined;
}
