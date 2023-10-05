import { Queue } from '@structures/queue';
import { Behavior, IPriorityQueue, Priority } from './types';
import { createEmptyObject } from '@utils/create-empty-object';

export type DefaultPriorities = 'low' | 'medium' | 'high';

export class PriorityQueue<
  TValue,
  TPriorities extends Priority = DefaultPriorities,
> implements IPriorityQueue<TValue, TPriorities>
{
  #size = 0;
  #queues: Record<TPriorities, Queue<TValue>> = createEmptyObject();

  #priorities: TPriorities[] = ['low', 'medium', 'high'] as TPriorities[];
  #lowPriority: TPriorities = 'low' as TPriorities;
  #highPriority: TPriorities = 'high' as TPriorities;

  constructor(
    priorities?: TPriorities extends DefaultPriorities
      ? undefined
      : TPriorities[],
  ) {
    if (!priorities) return;

    this.#priorities = priorities as TPriorities[];
    this.#lowPriority = priorities[0] as TPriorities;
    this.#highPriority = priorities[priorities.length - 1] as TPriorities;
  }

  public *[Symbol.iterator]() {
    const queues = this.#queues;

    for (const priority of this.#priorities) {
      if (!Object.hasOwn(queues, priority)) continue;
      for (const item of queues[priority]) {
        yield item;
      }
    }
  }

  public isEmpty(priority: TPriorities): boolean;
  public isEmpty(): boolean;
  public isEmpty(priority?: TPriorities): boolean {
    if (priority == null) return this.#size === 0;
    if (!this._hasPriority(priority)) return true;

    return this.#queues[priority].isEmpty;
  }

  public size(priority: TPriorities): number;
  public size(): number;
  public size(priority?: TPriorities): number {
    if (priority == null) return this.#size;
    if (!this._hasPriority(priority)) return 0;

    return this.#queues[priority].size;
  }

  public enqueue(priority: TPriorities, ...elements: TValue[]): void;
  public enqueue(element: TValue): void;
  public enqueue(
    priorityOrElement?: TPriorities | TValue,
    ...elements: TValue[]
  ): void {
    const hasPriority = arguments.length > 1,
      priority = hasPriority
        ? (priorityOrElement as TPriorities)
        : this.#lowPriority;

    if (!hasPriority) elements = [priorityOrElement as TValue];

    this.#size += elements.length;

    if (!this._hasPriority(priority)) {
      this.#queues[priority] = new Queue(...elements);
      return;
    }

    this.#queues[priority].enqueue(...elements);
  }

  public dequeue(
    priority: TPriorities,
    behavior?: Behavior,
  ): TValue | undefined;
  public dequeue(): TValue | undefined;
  public dequeue(
    priority?: TPriorities,
    behavior?: Behavior,
  ): TValue | undefined {
    const hasPriorityArg = !!priority;

    if (!behavior) behavior = hasPriorityArg ? 'none' : 'fallback';

    if (!priority) priority = this.#highPriority;
    if (!this._hasPriority(priority)) {
      if (behavior !== 'fallback') return;

      const lowerPriority = this._getLowerPriority(priority);
      return lowerPriority && this.dequeue(lowerPriority, behavior);
    }

    const queue = this.#queues[priority],
      result = queue.dequeue();

    this.#size--;

    if (queue.isEmpty) delete this.#queues[priority];

    return result;
  }

  public peek(priority: TPriorities, behavior?: Behavior): TValue | undefined;
  public peek(): TValue | undefined;
  public peek(priority?: TPriorities, behavior?: Behavior): TValue | undefined {
    const hasPriorityArg = !!priority;

    if (!behavior) behavior = hasPriorityArg ? 'none' : 'fallback';
    if (!priority) priority = this.#highPriority;

    if (!this._hasPriority(priority)) {
      if (behavior !== 'fallback') return;

      const lowerPriority = this._getLowerPriority(priority);
      return lowerPriority && this.peek(lowerPriority, behavior);
    }

    return this.#queues[priority].peek();
  }

  public clear(priority: TPriorities): void;
  public clear(): void;
  public clear(priority?: TPriorities): void {
    if (priority === undefined) {
      this.#priorities.forEach((priority) => this.clear(priority));
      this.#size = 0;
      return;
    }

    if (!this._hasPriority(priority)) return;

    const queue = this.#queues[priority];
    this.#size -= queue.size;
    queue.clear();
  }

  private _hasPriority(priority: TPriorities): boolean {
    return Object.hasOwn(this.#queues, priority);
  }

  private _getLowerPriority(priority: TPriorities): TPriorities | undefined {
    if (this.#lowPriority === priority) return;
    return this.#priorities[this._getPriorityLevel(priority) - 1];
  }

  private _getPriorityLevel(priority: Priority): number {
    return this.#priorities.indexOf(priority as TPriorities);
  }
}
