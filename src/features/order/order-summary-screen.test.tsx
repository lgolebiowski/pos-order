import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { CartProvider } from '@/features/cart/cart-context';
import type { Cart } from '@/features/cart/types';
import type { Product } from '@/features/menu/types';

import { OrderSummaryScreen } from './order-summary-screen';
import { submitOrder, type OrderConfirmation } from './submit-order';

jest.mock('expo-router', () => ({ router: { dismissTo: jest.fn() } }));
jest.mock('./submit-order', () => ({ submitOrder: jest.fn() }));

const product = (id: string, name: string, price: number): Product => ({
  id,
  name,
  category: 'snack',
  price,
  isAvailable: true,
});

const cart: Cart = {
  lines: [
    { product: product('a', 'Apple', 0.6), quantity: 3 },
    { product: product('m', 'Muffin', 1.7), quantity: 1 },
  ],
};

const confirmation: OrderConfirmation = {
  orderId: 'ORD-TEST1',
  itemCount: 4,
  total: 3.5,
  submittedAt: '2026-09-24T10:00:00.000Z',
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const renderSummary = (initialCart: Cart) =>
  render(
    <CartProvider initialCart={initialCart}>
      <OrderSummaryScreen />
    </CartProvider>,
  );

const pressSubmit = () =>
  fireEvent.press(screen.getByRole('button', { name: 'Submit order' }));

describe('<OrderSummaryScreen />', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists each item with quantity × price and its line total', async () => {
    await renderSummary(cart);

    expect(screen.getByText('Apple')).toBeOnTheScreen();
    expect(screen.getByText('3 × $0.60')).toBeOnTheScreen();
    expect(screen.getByText('$1.80')).toBeOnTheScreen();
    expect(screen.getByText('Muffin')).toBeOnTheScreen();
    expect(screen.getByText('1 × $1.70')).toBeOnTheScreen();
    expect(screen.getByText('$1.70')).toBeOnTheScreen();
  });

  it('shows the item count and order total', async () => {
    await renderSummary(cart);

    expect(screen.getByText('Items: 4')).toBeOnTheScreen();
    expect(screen.getByText('Total: $3.50')).toBeOnTheScreen();
  });

  describe('empty order', () => {
    it('explains the order is empty and offers no way to submit', async () => {
      await renderSummary({ lines: [] });

      expect(screen.getByText('Your order is empty.')).toBeOnTheScreen();
      expect(screen.queryByText(/Total:/)).not.toBeOnTheScreen();
      expect(
        screen.queryByRole('button', { name: 'Submit order' }),
      ).not.toBeOnTheScreen();
    });

    it('leads back to the menu', async () => {
      await renderSummary({ lines: [] });

      await fireEvent.press(
        screen.getByRole('button', { name: 'Back to menu' }),
      );

      expect(router.dismissTo).toHaveBeenCalledWith('/order');
    });
  });

  describe('submitting', () => {
    it('shows a loading state and disables the button while the request is pending', async () => {
      jest
        .mocked(submitOrder)
        .mockReturnValue(deferred<OrderConfirmation>().promise);
      await renderSummary(cart);

      await pressSubmit();

      expect(screen.getByLabelText('Submitting order')).toBeOnTheScreen();
      expect(screen.getByText('Submitting your order…')).toBeOnTheScreen();
      expect(
        screen.getByRole('button', { name: 'Submit order' }),
      ).toBeDisabled();
    });

    it('sends the current cart once, even when pressed twice quickly', async () => {
      jest
        .mocked(submitOrder)
        .mockReturnValue(deferred<OrderConfirmation>().promise);
      await renderSummary(cart);

      const button = screen.getByRole('button', { name: 'Submit order' });
      await fireEvent.press(button);
      await fireEvent.press(button);

      expect(submitOrder).toHaveBeenCalledTimes(1);
      expect(submitOrder).toHaveBeenCalledWith(cart, { simulateFailure: false });
    });

    it('shows the confirmation and empties the cart on success', async () => {
      const request = deferred<OrderConfirmation>();
      jest.mocked(submitOrder).mockReturnValue(request.promise);
      await renderSummary(cart);
      await pressSubmit();

      await act(async () => request.resolve(confirmation));

      expect(
        screen.getByRole('header', { name: 'Order placed!' }),
      ).toBeOnTheScreen();
      expect(screen.getByText('ORD-TEST1')).toBeOnTheScreen();
      expect(screen.getByText('$3.50 · 4 items')).toBeOnTheScreen();
      expect(screen.queryByText('Apple')).not.toBeOnTheScreen();
      expect(screen.queryByLabelText('Submitting order')).not.toBeOnTheScreen();
    });

    it('goes back to the menu from "Start new order"', async () => {
      jest.mocked(submitOrder).mockResolvedValue(confirmation);
      await renderSummary(cart);
      await pressSubmit();

      await fireEvent.press(
        await screen.findByRole('button', { name: 'Start new order' }),
      );

      expect(router.dismissTo).toHaveBeenCalledWith('/order');
    });

    it('shows the error, keeps the items, and offers a retry on failure', async () => {
      const request = deferred<OrderConfirmation>();
      jest.mocked(submitOrder).mockReturnValue(request.promise);
      await renderSummary(cart);
      await pressSubmit();

      await act(async () =>
        request.reject(new Error('The canteen system did not respond.')),
      );

      expect(screen.getByRole('alert')).toHaveTextContent(
        "Couldn't submit your order. The canteen system did not respond.Your items are still in the order.",
      );
      expect(screen.getByText('Apple')).toBeOnTheScreen();
      expect(screen.getByText('Total: $3.50')).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled();
      expect(screen.queryByLabelText('Submitting order')).not.toBeOnTheScreen();
    });

    it('succeeds on retry after a failure', async () => {
      jest
        .mocked(submitOrder)
        .mockRejectedValueOnce(new Error('The canteen system did not respond.'))
        .mockResolvedValueOnce(confirmation);
      await renderSummary(cart);
      await pressSubmit();

      await fireEvent.press(
        await screen.findByRole('button', { name: 'Try again' }),
      );

      expect(await screen.findByText('Order placed!')).toBeOnTheScreen();
      expect(screen.queryByRole('alert')).not.toBeOnTheScreen();
      expect(submitOrder).toHaveBeenCalledTimes(2);
    });
  });

  describe('"Simulate failed request" toggle', () => {
    const toggle = () => screen.getByRole('switch', { name: 'Simulate failed request' });

    it('is off by default, with the normal submit button', async () => {
      await renderSummary(cart);

      expect(toggle()).not.toBeChecked();
      expect(screen.getByRole('button', { name: 'Submit order' })).toHaveStyle({
        backgroundColor: '#18181b',
      });
    });

    it('turns the button into a red "Submit order failed" button when on', async () => {
      await renderSummary(cart);

      await fireEvent(toggle(), 'valueChange', true);

      expect(toggle()).toBeChecked();
      expect(screen.queryByRole('button', { name: 'Submit order' })).not.toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Submit order failed' })).toHaveStyle({
        backgroundColor: '#dc2626',
      });
    });

    it('asks the API to fail and shows the error state', async () => {
      jest.mocked(submitOrder).mockRejectedValue(new Error('The canteen system did not respond.'));
      await renderSummary(cart);

      await fireEvent(toggle(), 'valueChange', true);
      await fireEvent.press(screen.getByRole('button', { name: 'Submit order failed' }));

      expect(submitOrder).toHaveBeenCalledWith(cart, { simulateFailure: true });
      expect(await screen.findByRole('alert')).toHaveTextContent(/Couldn't submit your order/);
      expect(screen.getByText('Apple')).toBeOnTheScreen();
    });

    it('removes the error when turned off after a failure', async () => {
      jest.mocked(submitOrder).mockRejectedValueOnce(new Error('The canteen system did not respond.'));
      await renderSummary(cart);
      await fireEvent(toggle(), 'valueChange', true);
      await fireEvent.press(screen.getByRole('button', { name: 'Submit order failed' }));
      await screen.findByRole('alert');

      await fireEvent(toggle(), 'valueChange', false);

      expect(screen.queryByRole('alert')).not.toBeOnTheScreen();
      expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Submit order' })).toHaveStyle({
        backgroundColor: '#18181b',
      });
      expect(screen.getByText('Apple')).toBeOnTheScreen();
    });

    it('submits normally after being turned off', async () => {
      jest
        .mocked(submitOrder)
        .mockRejectedValueOnce(new Error('The canteen system did not respond.'))
        .mockResolvedValueOnce(confirmation);
      await renderSummary(cart);
      await fireEvent(toggle(), 'valueChange', true);
      await fireEvent.press(screen.getByRole('button', { name: 'Submit order failed' }));
      await screen.findByRole('alert');

      await fireEvent(toggle(), 'valueChange', false);
      await pressSubmit();

      expect(submitOrder).toHaveBeenLastCalledWith(cart, { simulateFailure: false });
      expect(await screen.findByText('Order placed!')).toBeOnTheScreen();
    });

    it('does not bring the error back when turned on again', async () => {
      jest.mocked(submitOrder).mockRejectedValueOnce(new Error('The canteen system did not respond.'));
      await renderSummary(cart);
      await fireEvent(toggle(), 'valueChange', true);
      await fireEvent.press(screen.getByRole('button', { name: 'Submit order failed' }));
      await screen.findByRole('alert');

      await fireEvent(toggle(), 'valueChange', false);
      await fireEvent(toggle(), 'valueChange', true);

      expect(screen.queryByRole('alert')).not.toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Submit order failed' })).toBeOnTheScreen();
    });

    it('is disabled while a request is in flight', async () => {
      jest.mocked(submitOrder).mockReturnValue(deferred<OrderConfirmation>().promise);
      await renderSummary(cart);

      await pressSubmit();

      expect(toggle()).toBeDisabled();
    });
  });
});
