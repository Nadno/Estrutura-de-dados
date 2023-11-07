import { DataSet, IDataSet } from '@structures/data-set';
import { HashTableKey, IHashTable, IHashTableNode as INode } from './types';

class Node<TKey extends HashTableKey, TValue> implements INode<TKey, TValue> {
  public next?: INode<TKey, TValue>;

  constructor(public key: TKey, public value: TValue) {}
}

export class HashTable<TKey extends HashTableKey, TValue>
  implements IHashTable<TKey, TValue>
{
  public static readonly DEFAULT_LENGTH: number = 100;

  readonly #indexSize: number = HashTable.DEFAULT_LENGTH;

  #indexes: IDataSet<number> = new DataSet();
  #list: Array<INode<TKey, TValue> | undefined>;
  #size = 0;

  constructor(length: number = HashTable.DEFAULT_LENGTH) {
    this.#list = new Array(length);
    this.#indexSize = length;
  }

  public isEmpty(): boolean {
    return this.#size === 0;
  }

  public size(): number {
    return this.#size;
  }

  public has(key: TKey): boolean {
    if (this.isEmpty()) return false;

    const hash = this._hash(key),
      index = this._hashIndex(hash);

    let node = this.#list[index];

    while (node) {
      if (node.key === key) return true;
      node = node.next;
    }

    return false;
  }

  public get(key: TKey): TValue | undefined {
    if (this.isEmpty()) return;

    const hash = this._hash(key),
      index = this._hashIndex(hash);

    let node = this.#list[index];

    while (node) {
      if (node.key === key) return node.value;
      node = node.next;
    }

    return;
  }

  public set(key: TKey, value: TValue): void {
    const hash = this._hash(key),
      index = this._hashIndex(hash);

    let node = this.#list[index];

    const isEmptyIndex = !node;
    if (isEmptyIndex) {
      this.#list[index] = new Node(key, value);
      this.#indexes.add(index);
      this.#size++;
      return;
    }

    while (node) {
      if (node.key === key) {
        node.value = value;
        return;
      }

      if (!node.next) {
        node.next = new Node(key, value);
        this.#size++;
        return;
      }

      node = node.next;
    }
  }

  public remove(key: TKey): TValue | undefined {
    if (this.isEmpty()) return;

    const hash = this._hash(key),
      index = this._hashIndex(hash);

    let node = this.#list[index],
      prev: Node<TKey, TValue> | undefined;

    while (node) {
      if (node.key === key) {
        const value = node.value;

        if (!prev) {
          if (node.next) {
            this.#list[index] = node.next;
          } else {
            delete this.#list[index];
            this.#indexes.delete(index);
          }
        } else {
          prev.next = node.next;
        }

        this.#size--;

        return value;
      }

      prev = node;
      node = node.next;
    }

    return;
  }

  private _hash(key: TKey): number {
    const stringKey = String(key);

    let result = 5381;

    for (let index = 0; index < stringKey.length; index++) {
      result = (result << 5) + result + stringKey.charCodeAt(index);
      result = result & result;
    }

    return result;
  }

  private _hashIndex(key: number): number {
    return key % this.#indexSize;
  }

  public keys(): TKey[] {
    if (this.isEmpty()) return [];

    const result: TKey[] = new Array(this.#size);
    let index = 0;

    for (const hashTableIndex of this.#indexes.values()) {
      let node = this.#list[hashTableIndex];

      while (node) {
        result[index++] = node.key;
        node = node.next;
      }
    }

    return result;
  }

  public values(): TValue[] {
    if (this.isEmpty()) return [];

    const result: TValue[] = new Array(this.#size);
    let index = 0;

    for (const hashTableIndex of this.#indexes.values()) {
      let node = this.#list[hashTableIndex];

      while (node) {
        result[index++] = node.value;
        node = node.next;
      }
    }

    return result;
  }

  public entries(): [TKey, TValue][] {
    if (this.isEmpty()) return [];

    const result: [TKey, TValue][] = new Array(this.#size);

    let index = 0;

    for (const hashTableIndex of this.#indexes.values()) {
      let node = this.#list[hashTableIndex];

      while (node) {
        result[index++] = [node.key, node.value];
        node = node.next;
      }
    }

    return result;
  }
}
