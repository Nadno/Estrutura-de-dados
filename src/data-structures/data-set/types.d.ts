export type DataSetKey =
  | symbol
  | string
  | number
  | 'true'
  | 'false'
  | 'null'
  | 'undefined';

export type DataSetValue =
  | symbol
  | string
  | number
  | boolean
  | null
  | undefined;

export interface IDataSet<TValue extends DataSetValue>
  extends Iterable<TValue> {
  size(): number;
  clear(): this;
  add(...elements: TValue[]): this;
  delete(element: TValue): TValue | undefined;
  has(element: TValue): boolean;
  values(): TValue[];

  isSubsetOf(elements: IDataSet<TValue>): boolean;

  union(elements: IDataSet<TValue>): IDataSet<TValue>;
  intersection(elements: IDataSet<TValue>): IDataSet<TValue>;
  difference(elements: IDataSet<TValue>): IDataSet<TValue>;
}
