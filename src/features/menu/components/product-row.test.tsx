import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Product } from '../types';
import { ProductRow } from './product-row';

const apple: Product = {
  id: 'apple',
  name: 'Apple',
  category: 'snack',
  price: 0.6,
  isAvailable: true,
};

describe('<ProductRow />', () => {
  it('shows the name and price with two decimals', async () => {
    await render(<ProductRow product={apple} onAdd={jest.fn()} />);

    expect(screen.getByText('Apple')).toBeOnTheScreen();
    expect(screen.getByText('$0.60')).toBeOnTheScreen();
  });

  it('calls onAdd with the product when "Add" is pressed', async () => {
    const onAdd = jest.fn();
    await render(<ProductRow product={apple} onAdd={onAdd} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Add Apple' }));

    expect(onAdd).toHaveBeenCalledWith(apple);
  });

  it('shows "Sold out" instead of "Add" for an unavailable product', async () => {
    await render(<ProductRow product={{ ...apple, isAvailable: false }} onAdd={jest.fn()} />);

    expect(screen.getByText('Sold out')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Add Apple' })).not.toBeOnTheScreen();
  });
});
