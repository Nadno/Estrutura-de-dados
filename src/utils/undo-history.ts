import { Stack } from '../data-structures/stack';

export type UndoHistoryActions = 'undo' | 'redo';

export class UndoHistory<T> {
  #done = new Stack<T>();
  #undone = new Stack<T>();

  get isEmpty() {
    return this.#done.isEmpty && this.#undone.isEmpty;
  }

  public push(...values: T[]): void {
    if (!this.#undone.isEmpty) this.#undone.clear();
    this.#done.push(...values);
  }

  public undo(): T | undefined {
    if (this.#done.isEmpty) return;
    const value = this.#done.pop();
    this.#undone.push(value);
    return value;
  }

  public redo(): T | undefined {
    if (this.#undone.isEmpty) return;
    const value = this.#undone.pop();
    this.#done.push(value);
    return value;
  }

  public peek(): T | undefined {
    return this.#done.peek();
  }

  public can(action: UndoHistoryActions) {
    return action === 'undo' ? !this.#done.isEmpty : !this.#undone.isEmpty;
  }

  public clear(): void {
    this.#done.clear();
    this.#undone.clear();
  }

  public doneValues() {
    return [...this.#done];
  }

  public undoneValues() {
    return [...this.#undone];
  }
}
