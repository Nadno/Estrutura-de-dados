import { createEmptyObject } from '@utils/create-empty-object';
import { IDataSet, DataSetValue, DataSetKey } from './types';

export class DataSet<TValue extends DataSetValue> implements IDataSet<TValue> {
  #elements = createEmptyObject<DataSetKey, TValue>();
  #size = 0;

  constructor(elements?: Iterable<TValue>) {
    if (elements) this.add(...elements);
  }

  public *[Symbol.iterator]() {
    for (const key in this.#elements) {
      yield this.#elements[key];
    }
  }

  public size(): number {
    return this.#size;
  }

  public clear(): this {
    this.#elements = createEmptyObject<DataSetKey, TValue>();
    this.#size = 0;
    return this;
  }

  public add(...elements: TValue[]): this {
    elements.forEach((element) => {
      if (this.has(element)) return;
      this.#elements[String(element)] = element;
      this.#size++;
    });

    return this;
  }

  public delete(element: TValue): TValue | undefined {
    if (!this.has(element)) return;

    const result = this.#elements[String(element)];

    delete this.#elements[String(element)];
    this.#size--;

    return result;
  }

  public has(element: TValue): boolean {
    return Object.hasOwn(this.#elements, String(element));
  }

  public values(): TValue[] {
    return Object.values(this.#elements);
  }

  public isSubsetOf(elements: IDataSet<TValue>): boolean {
    if (this.size() > elements.size()) return false;
    return this.values().every((element) => elements.has(element));
  }

  public union(elements: IDataSet<TValue>): IDataSet<TValue> {
    const result = new DataSet<TValue>(this);

    for (const element of elements) {
      result.add(element);
    }

    return result;
  }

  public intersection(elements: IDataSet<TValue>): IDataSet<TValue> {
    const isOuterSmallerThanThis = elements.size() <= this.size(),
      smallerSet = isOuterSmallerThanThis ? elements : this,
      biggerSet = isOuterSmallerThanThis ? this : elements;

    const result = new DataSet<TValue>();

    for (const element of smallerSet) {
      if (biggerSet.has(element)) result.add(element);
    }

    return result;
  }

  public difference(elements: IDataSet<TValue>): IDataSet<TValue> {
    const result = new DataSet(this);

    for (const element of elements) {
      if (result.has(element)) result.delete(element);
    }

    return result;
  }
}
