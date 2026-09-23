import { render, screen } from '@testing-library/react-native';

import { CartProvider } from '@/features/cart/cart-context';
import type { Cart } from '@/features/cart/types';
import type { Product } from '@/features/menu/types';

import { OrderSummaryScreen } from './order-summary-screen';

const product = (id: string, name: string, price: number): Product => ({
  id,
  name,
  category: 'snack',
  price,
  isAvailable: true,
});

const renderSummary = (initialCart: Cart) =>
  render(
    <CartProvider initialCart={initialCart}>
      <OrderSummaryScreen />
    </CartProvider>,
  );

describe('<OrderSummaryScreen />', () => {
  it('lists each item with quantity × price and its line total', async () => {
    await renderSummary({
      lines: [
        { product: product('a', 'Apple', 0.6), quantity: 3 },
        { product: product('m', 'Muffin', 1.7), quantity: 1 },
      ],
    });

    expect(screen.getByText('Apple')).toBeOnTheScreen();
    expect(screen.getByText('3 × $0.60')).toBeOnTheScreen();
    expect(screen.getByText('$1.80')).toBeOnTheScreen();

    expect(screen.getByText('Muffin')).toBeOnTheScreen();
    expect(screen.getByText('1 × $1.70')).toBeOnTheScreen();
    expect(screen.getByText('$1.70')).toBeOnTheScreen();
  });

  it('shows the item count and order total', async () => {
    await renderSummary({
      lines: [
        { product: product('a', 'Apple', 0.6), quantity: 3 },
        { product: product('m', 'Muffin', 1.7), quantity: 1 },
      ],
    });

    expect(screen.getByText('Items: 4')).toBeOnTheScreen();
    expect(screen.getByText('Total: $3.50')).toBeOnTheScreen();
  });

  it('shows a message and no totals when the order is empty', async () => {
    await renderSummary({ lines: [] });

    expect(screen.getByText('Your order is empty.')).toBeOnTheScreen();
    expect(screen.queryByText(/Total:/)).not.toBeOnTheScreen();
  });
});
