import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';

import { cartReducer, emptyCart } from './cart-reducer';
import type { Cart, CartAction } from './types';

type CartContextValue = {
  cart: Cart;
  dispatch: Dispatch<CartAction>;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: ReactNode;
  initialCart?: Cart;
};

export function CartProvider({ children, initialCart = emptyCart }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  return <CartContext.Provider value={{ cart, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return context;
}
