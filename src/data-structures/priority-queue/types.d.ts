export type Priority = string | number | symbol;

export type Behavior = 'fallback' | 'none';

export interface IPriorityQueue<TValue, TPriorities extends Priority> {
  isEmpty(priority: TPriorities): boolean;
  isEmpty(): boolean;
  size(priority: TPriorities): number;
  size(): number;

  enqueue(priority: TPriorities, ...elements: TValue[]): void;
  enqueue(element: TValue): void;

  dequeue(priority: TPriorities, behavior?: Behavior): TValue | undefined;
  dequeue(): TValue | undefined;

  peek(priority: TPriorities, behavior?: Behavior): TValue | undefined;
  peek(): TValue | undefined;

  clear(priority: TPriorities): void;
  clear(): void;
}
