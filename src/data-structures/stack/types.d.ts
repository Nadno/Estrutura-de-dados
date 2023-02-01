export interface IStack<T> {
  isEmpty: boolean;
  size: number;
  push(...elements: T[]): void;
  pop(): T;
  peek(): T;
  clear(): void;
}
