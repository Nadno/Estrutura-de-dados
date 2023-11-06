import { DictionaryKey, IDictionary, IDictionaryNode } from './types';

class DictionaryNode<TKey extends DictionaryKey, TValue>
  implements IDictionaryNode<TKey, TValue>
{
  public next?: IDictionaryNode<TKey, TValue>;

  constructor(public key: TKey, public value: TValue) {}
}

export class Dictionary<TKey extends DictionaryKey, TValue>
  implements IDictionary<TKey, TValue>
{
  #head?: DictionaryNode<TKey, TValue>;
  #size = 0;

  #lastHasResult?: {
    found: boolean;
    key: TKey;
    node: DictionaryNode<TKey, TValue>;
    prev?: DictionaryNode<TKey, TValue>;
  };

  public isEmpty(): boolean {
    return this.#size === 0;
  }

  public size(): number {
    return this.#size;
  }

  public has(key: TKey): boolean {
    if (this.isEmpty()) return false;

    let prev: DictionaryNode<TKey, TValue> | undefined,
      node = this.#head;

    while (node) {
      if (node.key === key) {
        this.#lastHasResult = {
          found: true,
          key,
          node,
          prev,
        };

        return true;
      }

      if (!node.next) {
        this.#lastHasResult = {
          found: false,
          key,
          node,
        };
      }

      prev = node;
      node = node.next;
    }

    return false;
  }

  public get(key: TKey): TValue | undefined {
    if (this.isEmpty()) return;

    if (
      this.#lastHasResult &&
      this.#lastHasResult.found &&
      this.#lastHasResult.key === key
    ) {
      const value = this.#lastHasResult.node.value;
      this.#lastHasResult = undefined;
      return value;
    }

    let node = this.#head;

    while (node) {
      if (node.key === key) {
        return node.value;
      }

      node = node.next;
    }

    return;
  }

  public set(key: TKey, value: TValue): void {
    if (this.isEmpty()) {
      this.#head = new DictionaryNode<TKey, TValue>(key, value);
      this.#size++;
      return;
    }

    if (
      this.#lastHasResult &&
      !this.#lastHasResult.found &&
      this.#lastHasResult.key === key
    ) {
      const tail = this.#lastHasResult.node;
      this.#lastHasResult = undefined;
      tail.next = new DictionaryNode<TKey, TValue>(key, value);
      this.#size++;
      return;
    }

    let node = this.#head;

    while (node) {
      if (node.key === key) {
        node.value = value;
        break;
      }

      if (!node.next) {
        node.next = new DictionaryNode<TKey, TValue>(key, value);
        this.#size++;
        break;
      }

      node = node.next;
    }
  }

  public remove(key: TKey): TValue | undefined {
    if (this.isEmpty()) return;

    if (
      this.#lastHasResult &&
      this.#lastHasResult.found &&
      this.#lastHasResult.key === key
    ) {
      const node = this.#lastHasResult.node,
        prev = this.#lastHasResult.prev;

      if (!prev) {
        this.#head = node.next;
      } else {
        prev.next = node.next;
      }

      this.#lastHasResult = undefined;
      this.#size--;

      return node.value;
    }

    let node = this.#head;

    if (node && node.key === key) {
      this.#head = node.next;
      this.#size--;
      return node.value;
    }

    while (node) {
      const nextNode = node.next;

      if (nextNode && nextNode.key === key) {
        node.next = nextNode.next;
        this.#size--;
        return node.value;
      }

      node = node.next;
    }

    return;
  }

  public keys(): TKey[] {
    if (this.isEmpty()) return [];

    const result: TKey[] = new Array(this.#size);

    let node = this.#head,
      index = 0;

    while (node) {
      result[index++] = node.key;
      node = node.next;
    }

    return result;
  }

  public values(): TValue[] {
    if (this.isEmpty()) return [];

    const result: TValue[] = new Array(this.#size);

    let node = this.#head,
      index = 0;

    while (node) {
      result[index++] = node.value;
      node = node.next;
    }

    return result;
  }

  public entries(): [TKey, TValue][] {
    if (this.isEmpty()) return [];

    const result: [TKey, TValue][] = new Array(this.#size);

    let node = this.#head,
      index = 0;

    while (node) {
      result[index++] = [node.key, node.value];
      node = node.next;
    }

    return result;
  }
}
