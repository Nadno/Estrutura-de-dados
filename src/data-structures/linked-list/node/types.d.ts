export interface ISingleLinkedNode<T, TNode = ISingleLinkedNode<T>> {
  value: T;
  next: TNode | undefined;
  /**
   * Insert the next node in the current node.
   */
  insertNext(value: T | TNode): void;
  /**
   * Remove the next node from the current node.
   */
  removeNext(): TNode | undefined;
  /**
   * `attachNext` do the same as the `insertNext`, and also
   * bind the current next node as the next node of the
   * new passed value.
   */
  attachNext(value: T | TNode): void;
  /**
   * `detachNext` do the same as the `removeNext`, and also
   * bind the next node of the removed node to the current node.
   */
  detachNext(): TNode | undefined;
}

export interface IDoublyLinkedNode<T, TNode = IDoublyLinkedNode<T>>
  extends ISingleLinkedNode<T, TNode> {
  prev: TNode | undefined;
  next: TNode | undefined;
  /**
   * Insert the prev node in the current node.
   */
  insertPrev(value: T | TNode): void;
  /**
   * Remove the prev node from the current node.
   */
  removePrev(): TNode | undefined;
  /**
   * `attachPrev` do the same as the `insertPrev`, and also
   * bind the current prev node as the prev node of the
   * new passed value.
   */
  attachPrev(value: T | TNode): void;
  /**
   * `detachPrev` do the same as the `removePrev`, and also
   * bind the prev node of the removed node to the current node.
   */
  detachPrev(): TNode | undefined;
  detach(): TNode | undefined;
}

export type ISingleNode<T> = ISingleLinkedNode<T, ISingleNode<T>>;

export type IDoublyNode<T> = IDoublyLinkedNode<T, IDoublyNode<T>>;
