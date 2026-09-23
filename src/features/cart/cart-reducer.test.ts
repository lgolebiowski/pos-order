import type { Product } from '@/features/menu/types';

import { cartReducer, emptyCart } from './cart-reducer';
import type { Cart } from './types';

const product = (id: string, isAvailable = true): Product => ({
  id,
  name: `Product ${id}`,
  category: 'snack',
  price: 1,
  isAvailable,
});

const apple = product('apple');
const juice = product('juice');
const soldOut = product('sold-out', false);

const add = (cart: Cart, item: Product) => cartReducer(cart, { type: 'add', product: item });
const remove = (cart: Cart, productId: string) => cartReducer(cart, { type: 'remove', productId });
const quantities = (cart: Cart) => cart.lines.map((line) => [line.product.id, line.quantity]);

describe('cartReducer', () => {
  describe('add', () => {
    it('adds a new product with quantity 1', () => {
      expect(quantities(add(emptyCart, apple))).toEqual([['apple', 1]]);
    });

    it('increases the quantity of a product already in the cart', () => {
      const cart = add(add(emptyCart, apple), apple);

      expect(quantities(cart)).toEqual([['apple', 2]]);
    });

    it('keeps separate lines in the order products were first added', () => {
      const cart = add(add(add(emptyCart, apple), juice), apple);

      expect(quantities(cart)).toEqual([
        ['apple', 2],
        ['juice', 1],
      ]);
    });

    it('ignores sold-out products', () => {
      const cart = add(emptyCart, apple);

      expect(add(cart, soldOut)).toBe(cart);
    });
  });

  describe('remove', () => {
    it('decreases the quantity by one', () => {
      const cart = add(add(emptyCart, apple), apple);

      expect(quantities(remove(cart, 'apple'))).toEqual([['apple', 1]]);
    });

    it('removes the line when the quantity reaches zero', () => {
      const cart = add(add(emptyCart, apple), juice);

      expect(quantities(remove(cart, 'apple'))).toEqual([['juice', 1]]);
    });

    it('leaves the cart unchanged for a product that is not in it', () => {
      const cart = add(emptyCart, apple);

      expect(quantities(remove(cart, 'juice'))).toEqual([['apple', 1]]);
    });
  });

  describe('clear', () => {
    it('empties the cart', () => {
      const cart = add(add(emptyCart, apple), juice);

      expect(cartReducer(cart, { type: 'clear' })).toEqual(emptyCart);
    });
  });

  it('never mutates the previous cart', () => {
    const cart = add(emptyCart, apple);
    const snapshot = structuredClone(cart);

    add(cart, apple);
    add(cart, juice);
    remove(cart, 'apple');
    cartReducer(cart, { type: 'clear' });

    expect(cart).toEqual(snapshot);
    expect(emptyCart).toEqual({ lines: [] });
  });
});
