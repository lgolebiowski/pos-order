import type { Cart } from './types';

export function getItemCount(cart: Cart): number {
  return cart.lines.reduce((count, line) => count + line.quantity, 0);
}

/** Sums in whole cents so decimal prices don't drift (e.g. 0.1 + 0.2). */
export function getTotal(cart: Cart): number {
  const cents = cart.lines.reduce(
    (sum, line) => sum + Math.round(line.product.price * 100) * line.quantity,
    0,
  );
  return cents / 100;
}

export function getQuantity(cart: Cart, productId: string): number {
  return cart.lines.find((line) => line.product.id === productId)?.quantity ?? 0;
}
