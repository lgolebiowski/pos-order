import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { CartProvider } from '@/features/cart/cart-context';
import type { Cart } from '@/features/cart/types';
import type { Product } from '@/features/menu/types';

import { OrderHeaderButton } from './order-header-button';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

const apple: Product = { id: 'a', name: 'Apple', category: 'snack', price: 0.6, isAvailable: true };

const renderButton = (initialCart: Cart) =>
  render(
    <CartProvider initialCart={initialCart}>
      <OrderHeaderButton />
    </CartProvider>,
  );

describe('<OrderHeaderButton />', () => {
  beforeEach(() => jest.mocked(router.push).mockClear());

  it('is disabled and shows no count while the cart is empty', async () => {
    await renderButton({ lines: [] });

    const button = screen.getByRole('button', { name: 'View order, 0 items' });
    expect(button).toHaveTextContent('Order');
    expect(button).toBeDisabled();
  });

  it('shows the item count once the cart has items', async () => {
    await renderButton({ lines: [{ product: apple, quantity: 3 }] });

    const button = screen.getByRole('button', { name: 'View order, 3 items' });
    expect(button).toHaveTextContent('Order (3)');
    expect(button).toBeEnabled();
  });

  it('uses the singular for one item', async () => {
    await renderButton({ lines: [{ product: apple, quantity: 1 }] });

    expect(screen.getByRole('button', { name: 'View order, 1 item' })).toBeOnTheScreen();
  });

  it('navigates to the summary when pressed', async () => {
    await renderButton({ lines: [{ product: apple, quantity: 1 }] });

    await fireEvent.press(screen.getByRole('button', { name: /^View order/ }));

    expect(router.push).toHaveBeenCalledWith('/summary');
  });
});
