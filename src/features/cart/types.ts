import type { Product } from '@/features/menu/types';

export type CartLine = {
  product: Product;
  quantity: number;
};

export type Cart = {
  lines: CartLine[];
};

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; productId: string }
  | { type: 'clear' };
