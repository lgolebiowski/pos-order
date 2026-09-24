import type { Cart } from '@/features/cart/types';
import type { Product } from '@/features/menu/types';

import { submitOrder } from './submit-order';

const apple: Product = { id: 'a', name: 'Apple', category: 'snack', price: 0.6, isAvailable: true };
const cart: Cart = { lines: [{ product: apple, quantity: 3 }] };

describe('submitOrder (mock API)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('resolves with a confirmation only after the delay', async () => {
    const onDone = jest.fn();
    const request = submitOrder(cart, { delayMs: 1000 });
    request.then(onDone);

    await jest.advanceTimersByTimeAsync(999);
    expect(onDone).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    await expect(request).resolves.toEqual({
      orderId: expect.stringMatching(/^ORD-/),
      itemCount: 3,
      total: 1.8,
      submittedAt: expect.any(String),
    });
  });

  it('fails after the delay when simulateFailure is set', async () => {
    const onSettled = jest.fn();
    const request = submitOrder(cart, { delayMs: 1000, simulateFailure: true });
    request.catch(onSettled);

    await jest.advanceTimersByTimeAsync(999);
    expect(onSettled).not.toHaveBeenCalled();

    const assertion = expect(request).rejects.toThrow('The canteen system did not respond.');
    await jest.advanceTimersByTimeAsync(1);
    await assertion;
  });

  it('rejects an empty order straight away, without waiting', async () => {
    await expect(submitOrder({ lines: [] }, { delayMs: 1000 })).rejects.toThrow(
      'Cannot submit an empty order.',
    );
  });
});
