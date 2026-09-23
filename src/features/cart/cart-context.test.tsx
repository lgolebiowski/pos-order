import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Text } from 'react-native';

import type { Product } from '@/features/menu/types';

import { CartProvider, useCart } from './cart-context';
import { getItemCount } from './totals';

const apple: Product = { id: 'a', name: 'Apple', category: 'snack', price: 0.6, isAvailable: true };

function Counter({ label }: { label: string }) {
  const { cart } = useCart();
  return <Text>{`${label}: ${getItemCount(cart)}`}</Text>;
}

function AddApple() {
  const { dispatch } = useCart();
  return <Button title="Add apple" onPress={() => dispatch({ type: 'add', product: apple })} />;
}

describe('CartProvider / useCart', () => {
  it('shares one cart between all components inside the provider', async () => {
    await render(
      <CartProvider>
        <Counter label="First" />
        <Counter label="Second" />
        <AddApple />
      </CartProvider>,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Add apple' }));

    expect(screen.getByText('First: 1')).toBeOnTheScreen();
    expect(screen.getByText('Second: 1')).toBeOnTheScreen();
  });

  it('starts from initialCart when given', async () => {
    await render(
      <CartProvider initialCart={{ lines: [{ product: apple, quantity: 2 }] }}>
        <Counter label="Items" />
      </CartProvider>,
    );

    expect(screen.getByText('Items: 2')).toBeOnTheScreen();
  });

  it('throws a clear error when used outside the provider', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(render(<Counter label="Items" />)).rejects.toThrow(
      'useCart must be used inside <CartProvider>',
    );

    jest.restoreAllMocks();
  });
});
