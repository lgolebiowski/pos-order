import type { Cart, CartLine } from './types';

// Work in whole cents so decimal prices don't drift (e.g. 0.1 + 0.2).
const lineCents = (line: CartLine) => Math.round(line.product.price * 100) * line.quantity;

export function getItemCount(cart: Cart): number {
  return cart.lines.reduce((count, line) => count + line.quantity, 0);
}

export function getLineTotal(line: CartLine): number {
  return lineCents(line) / 100;
}

export function getTotal(cart: Cart): number {
  return cart.lines.reduce((sum, line) => sum + lineCents(line), 0) / 100;
}

export function getQuantity(cart: Cart, productId: string): number {
  return cart.lines.find((line) => line.product.id === productId)?.quantity ?? 0;
}
