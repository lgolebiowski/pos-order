import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Product } from '@/features/menu/types';

import type { Cart } from '../types';
import { CartSummary } from './cart-summary';

const muffin: Product = {
  id: 'muffin',
  name: 'Muffin',
  category: 'dessert',
  price: 1.7,
  isAvailable: true,
};

const emptyCart: Cart = { lines: [] };
const cartWithMuffins: Cart = { lines: [{ product: muffin, quantity: 2 }] };

describe('<CartSummary />', () => {
  it('shows the item count and total', async () => {
    await render(<CartSummary cart={cartWithMuffins} onClear={jest.fn()} />);

    expect(screen.getByText('Items: 2 · Total: $3.40')).toBeOnTheScreen();
  });

  it('shows zero for an empty cart and disables "Clear"', async () => {
    await render(<CartSummary cart={emptyCart} onClear={jest.fn()} />);

    expect(screen.getByText('Items: 0 · Total: $0.00')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it('calls onClear when "Clear" is pressed', async () => {
    const onClear = jest.fn();
    await render(<CartSummary cart={cartWithMuffins} onClear={onClear} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Clear' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
