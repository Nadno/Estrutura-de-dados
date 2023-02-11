export interface IDeque<T> {
  isEmpty: boolean;
  size: number;
  front?: T;
  rear?: T;
  addFront(...elements: T[]): void;
  removeFront(): T | undefined;
  addRear(...elements: T[]): void;
  removeRear(): T | undefined;
  clear(): void;
}