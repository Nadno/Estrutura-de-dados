export type DictionaryKey =
  | symbol
  | string
  | number
  | 'true'
  | 'false'
  | 'null'
  | 'undefined';

export interface IDictionaryNode<TKey extends DictionaryKey, TValue> {
  next?: IDictionaryNode<TKey, TValue>;
  key: TKey;
  value: TValue;
}

export interface IDictionary<TKey extends DictionaryKey, TValue = unknown> {
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
