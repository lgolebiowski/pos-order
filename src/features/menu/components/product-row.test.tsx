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

const renderRow = async (props: Partial<Parameters<typeof ProductRow>[0]> = {}) => {
  const handlers = { onAdd: jest.fn(), onRemove: jest.fn() };
  await render(<ProductRow product={apple} quantity={0} {...handlers} {...props} />);
  return handlers;
};

describe('<ProductRow />', () => {
  it('shows the name and price with two decimals', async () => {
    await renderRow();

    expect(screen.getByText('Apple')).toBeOnTheScreen();
    expect(screen.getByText('$0.60')).toBeOnTheScreen();
  });

  describe('when not in the cart', () => {
    it('shows only an "Add" button', async () => {
      await renderRow();

      expect(screen.getByRole('button', { name: 'Add Apple' })).toHaveTextContent('Add');
      expect(screen.queryByRole('button', { name: 'Remove Apple' })).not.toBeOnTheScreen();
      expect(screen.queryByLabelText(/in cart/)).not.toBeOnTheScreen();
    });

    it('calls onAdd with the product when "Add" is pressed', async () => {
      const { onAdd } = await renderRow();

      await fireEvent.press(screen.getByRole('button', { name: 'Add Apple' }));

      expect(onAdd).toHaveBeenCalledWith(apple);
    });
  });

  describe('when in the cart', () => {
    it('shows the quantity between "−" and "+"', async () => {
      await renderRow({ quantity: 3 });

      expect(screen.getByLabelText('3 Apple in cart')).toHaveTextContent('3');
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toHaveTextContent('−');
      expect(screen.getByRole('button', { name: 'Add Apple' })).toHaveTextContent('+');
    });

    it('calls onAdd when "+" is pressed', async () => {
      const { onAdd, onRemove } = await renderRow({ quantity: 1 });

      await fireEvent.press(screen.getByRole('button', { name: 'Add Apple' }));

      expect(onAdd).toHaveBeenCalledWith(apple);
      expect(onRemove).not.toHaveBeenCalled();
    });

    it('calls onRemove when "−" is pressed', async () => {
      const { onAdd, onRemove } = await renderRow({ quantity: 1 });

      await fireEvent.press(screen.getByRole('button', { name: 'Remove Apple' }));

      expect(onRemove).toHaveBeenCalledWith(apple);
      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  it('shows "Sold out" and no buttons for an unavailable product', async () => {
    await renderRow({ product: { ...apple, isAvailable: false } });

    expect(screen.getByText('Sold out')).toBeOnTheScreen();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
