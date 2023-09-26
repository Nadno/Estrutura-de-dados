import { describe, expect, it } from 'vitest';

import { SortedLinkedList, SNode as Node } from '@structures/linked-list';

describe('Single sorted linked list', () => {
  const numberElements = [1, 2, 3, 4, 5],
    orderedNumbersDuplicated = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5];

  it('should insert ordered list nodes in ascending order', () => {
    const list = SortedLinkedList.order<number>('ASC');

    [...numberElements]
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual(numberElements);
  });

  it('should insert ordered list (with duplicated values) nodes in ascending order', () => {
    const list = SortedLinkedList.order<number>('ASC');

    [...orderedNumbersDuplicated]
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual(orderedNumbersDuplicated);
  });

  it('should insert ordered (and reversed) list (with duplicated values) nodes in ascending order', () => {
    const list = SortedLinkedList.order<number>('ASC');

    [...orderedNumbersDuplicated]
      .reverse()
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual(orderedNumbersDuplicated);
  });

  it('should insert ordered (and reversed) list nodes in ascending order', () => {
    const list = SortedLinkedList.order<number>('ASC');

    [...numberElements]
      .reverse()
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual(numberElements);
  });

  it('should insert ordered list nodes in descending order', () => {
    const list = SortedLinkedList.order<number>('DESC');

    [...numberElements]
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual([...numberElements].reverse());
  });

  it('should insert ordered (and reversed) list nodes in descending order', () => {
    const list = SortedLinkedList.order<number>('DESC');

    [...numberElements]
      .reverse()
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual([...numberElements].reverse());
  });

  it('should insert ordered list (with duplicated values) nodes in descending order', () => {
    const list = SortedLinkedList.order<number>('DESC');

    [...orderedNumbersDuplicated]
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual([...orderedNumbersDuplicated].reverse());
  });

  it('should insert ordered (and reversed) list (with duplicated values) nodes in descending order', () => {
    const list = SortedLinkedList.order<number>('DESC');

    [...orderedNumbersDuplicated]
      .reverse()
      .map((element) => new Node(element))
      .forEach((node) => list.insert(node));

    expect([...list]).toEqual([...orderedNumbersDuplicated].reverse());
  });

  it('should supply a way to sort non primitive items', () => {
    type Product = {
      name: string;
      price: number;
    };

    const products: Product[] = [
      {
        name: 'Foo',
        price: 12,
      },
      {
        name: 'Qux',
        price: 72.3,
      },
      {
        name: 'Bar',
        price: 32.42,
      },
      {
        name: 'Nix',
        price: 6.99,
      },
    ];

    const orderedPriceComparer = (a: Product, b: Product) => {
      if (a.price === b.price) return 0;
      return a.price > b.price ? 1 : -1;
    };

    const productsWithLowestPrices = SortedLinkedList.order<Product>(
      'ASC',
      orderedPriceComparer,
    );

    productsWithLowestPrices.add(...products);

    expect([...productsWithLowestPrices]).toEqual(
      [...products].sort(orderedPriceComparer),
    );
  });
});
