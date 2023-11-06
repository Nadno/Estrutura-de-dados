export type HashTableKey =
  | string
  | number
  | 'true'
  | 'false'
  | 'null'
  | 'undefined';

export interface IHashTableNode<TKey extends HashTableKey, TValue> {
  next?: IHashTableNode<TKey, TValue>;
  key: TKey;
  value: TValue;
}

export interface IHashTable<TKey extends HashTableKey, TValue = unknown> {
  isEmpty(): boolean;
  size(): number;
  has(key: TKey): boolean;
  get(key: TKey): TValue | undefined;
  set(key: TKey, value: TValue): void;
  remove(key: TKey): TValue | undefined;

  keys(): TKey[];
  values(): TValue[];
  entries(): Array<[TKey, TValue]>;
}
