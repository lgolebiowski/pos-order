import type { Product } from '@/features/menu/types';

import { getItemCount, getQuantity, getTotal } from './totals';
import type { Cart } from './types';

const line = (price: number, quantity: number) => ({
  product: {
    id: `p-${price}`,
    name: `Product ${price}`,
    category: 'snack',
    price,
    isAvailable: true,
  } satisfies Product,
  quantity,
});

const cartOf = (...lines: ReturnType<typeof line>[]): Cart => ({ lines });

describe('getItemCount', () => {
  it('is 0 for an empty cart', () => {
    expect(getItemCount(cartOf())).toBe(0);
  });

  it('adds up quantities across lines', () => {
    expect(getItemCount(cartOf(line(1, 2), line(2, 3)))).toBe(5);
  });
});

describe('getTotal', () => {
  it('is 0 for an empty cart', () => {
    expect(getTotal(cartOf())).toBe(0);
  });

  it('multiplies each price by its quantity and adds the lines', () => {
    expect(getTotal(cartOf(line(4.5, 2), line(1.2, 1)))).toBe(10.2);
  });

  it.each([
    { lines: [line(0.1, 1), line(0.2, 1)], expected: 0.3 },
    { lines: [line(1.1, 3)], expected: 3.3 },
    { lines: [line(0.6, 3), line(1.7, 1)], expected: 3.5 },
  ])('has no floating-point drift (expected $expected)', ({ lines, expected }) => {
    expect(getTotal(cartOf(...lines))).toBe(expected);
  });
});

describe('getQuantity', () => {
  const cart = cartOf(line(1, 2), line(2, 5));

  it('returns the quantity of a product in the cart', () => {
    expect(getQuantity(cart, 'p-2')).toBe(5);
  });

  it('returns 0 for a product that is not in the cart', () => {
    expect(getQuantity(cart, 'p-3')).toBe(0);
  });
});
