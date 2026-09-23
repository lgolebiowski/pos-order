import type { Cart, CartAction } from './types';

export const emptyCart: Cart = { lines: [] };

export function cartReducer(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'add': {
      if (!action.product.isAvailable) return cart;

      const existing = cart.lines.find(
        (line) => line.product.id === action.product.id,
      );
      if (!existing) {
        return {
          lines: [...cart.lines, { product: action.product, quantity: 1 }],
        };
      }
      return {
        lines: cart.lines.map((line) =>
          line === existing ? { ...line, quantity: line.quantity + 1 } : line,
        ),
      };
    }

    case 'remove': {
      return {
        lines: cart.lines
          .map((line) =>
            line.product.id === action.productId
              ? { ...line, quantity: line.quantity - 1 }
              : line,
          )
          .filter((line) => line.quantity > 0),
      };
    }

    case 'clear':
      return emptyCart;
  }
}
