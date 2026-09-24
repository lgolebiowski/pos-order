import { act, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { CartProvider } from '@/features/cart/cart-context';
import type { Cart } from '@/features/cart/types';
import type { Product } from '@/features/menu/types';

import { submitOrder } from './submit-order';
import { useSubmitOrder } from './use-submit-order';

jest.mock('./submit-order', () => ({ submitOrder: jest.fn() }));

const apple: Product = { id: 'a', name: 'Apple', category: 'snack', price: 0.6, isAvailable: true };

const withCart = (initialCart: Cart) =>
  function CartWrapper({ children }: { children: ReactNode }) {
    return <CartProvider initialCart={initialCart}>{children}</CartProvider>;
  };

describe('useSubmitOrder', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts only one request when submit is called twice before re-rendering', async () => {
    jest.mocked(submitOrder).mockReturnValue(new Promise(() => {}));
    const { result } = await renderHook(() => useSubmitOrder(), {
      wrapper: withCart({ lines: [{ product: apple, quantity: 1 }] }),
    });

    await act(async () => {
      void result.current.submit();
      void result.current.submit();
    });

    expect(submitOrder).toHaveBeenCalledTimes(1);
    expect(result.current.state).toEqual({ status: 'submitting' });
  });

  it('does not call the API for an empty cart', async () => {
    const { result } = await renderHook(() => useSubmitOrder(), {
      wrapper: withCart({ lines: [] }),
    });

    await act(() => result.current.submit());

    expect(submitOrder).not.toHaveBeenCalled();
    expect(result.current.state).toEqual({ status: 'idle' });
  });

  it('allows a new attempt after a failure', async () => {
    jest.mocked(submitOrder).mockRejectedValueOnce(new Error('Nope.'));
    const { result } = await renderHook(() => useSubmitOrder(), {
      wrapper: withCart({ lines: [{ product: apple, quantity: 1 }] }),
    });

    await act(() => result.current.submit());
    expect(result.current.state).toEqual({ status: 'error', message: 'Nope.' });

    jest.mocked(submitOrder).mockReturnValue(new Promise(() => {}));
    await act(async () => {
      void result.current.submit();
    });
    expect(submitOrder).toHaveBeenCalledTimes(2);
  });
});
