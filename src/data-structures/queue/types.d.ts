export interface IQueue<T> {
  isEmpty: boolean;
  size: number;
  enqueue(...elements: T[]): void;
  dequeue(): T | undefined;
  peek(): T | undefined;
  clear(): void;
}
