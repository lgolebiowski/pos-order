import { getItemCount, getTotal } from '@/features/cart/totals';
import type { Cart } from '@/features/cart/types';

export type OrderConfirmation = {
  orderId: string;
  itemCount: number;
  total: number;
  submittedAt: string;
};

type SubmitOrderOptions = {
  delayMs?: number;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitOrder(
  cart: Cart,
  { delayMs = 1500 }: SubmitOrderOptions = {},
): Promise<OrderConfirmation> {
  if (cart.lines.length === 0) {
    throw new Error('Cannot submit an empty order.');
  }

  await wait(delayMs);

  return {
    orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
    itemCount: getItemCount(cart),
    total: getTotal(cart),
    submittedAt: new Date().toISOString(),
  };
}
