import { fireEvent, render, screen } from '@testing-library/react-native';

import { products } from '@/data/products';
import { categories, categoryLabels } from '@/features/menu/categories';
import type { ProductCategory } from '@/features/menu/types';

import { OrderScreen } from './order-screen';

const namesIn = (category: ProductCategory) =>
  products
    .filter((product) => product.category === category)
    .map((product) => product.name);

const renderOrderScreen = () => render(<OrderScreen />);

describe('<OrderScreen />', () => {
  it('starts with all categories, beginning with the first section', async () => {
    await renderOrderScreen();

    expect(screen.getByRole('button', { name: 'All' })).toBeDisabled();
    expect(screen.getAllByRole('header')[0]).toHaveTextContent(
      categoryLabels[categories[0]],
    );
    for (const name of namesIn(categories[0])) {
      expect(screen.getByText(name)).toBeOnTheScreen();
    }
  });

  it.each(categories)(
    'shows only %s products when that category is selected',
    async (category) => {
      await renderOrderScreen();

      await fireEvent.press(
        screen.getByRole('button', { name: categoryLabels[category] }),
      );

      expect(screen.getAllByRole('header')).toHaveLength(1);
      expect(
        screen.getByRole('header', { name: categoryLabels[category] }),
      ).toBeOnTheScreen();
      for (const name of namesIn(category)) {
        expect(screen.getByText(name)).toBeOnTheScreen();
      }
      for (const other of categories.filter((c) => c !== category)) {
        for (const name of namesIn(other)) {
          expect(screen.queryByText(name)).not.toBeOnTheScreen();
        }
      }
    },
  );

  it('shows all categories again after selecting "All"', async () => {
    await renderOrderScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Desserts' }));
    await fireEvent.press(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByRole('button', { name: 'All' })).toBeDisabled();
    expect(screen.getAllByRole('header')[0]).toHaveTextContent(
      categoryLabels[categories[0]],
    );
    for (const name of namesIn(categories[0])) {
      expect(screen.getByText(name)).toBeOnTheScreen();
    }
  });

  describe('cart', () => {
    // Filtering to the product's category keeps its row rendered (see note above).
    const available = products.find((product) => product.isAvailable)!;
    const soldOut = products.find((product) => !product.isAvailable)!;
    const price = available.price.toFixed(2);

    const showCategoryOf = (product: typeof available) =>
      fireEvent.press(screen.getByRole('button', { name: categoryLabels[product.category] }));

    it('starts with an empty cart', async () => {
      await renderOrderScreen();

      expect(screen.getByText('Items: 0 · Total: $0.00')).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
    });

    it('updates the item count and total when products are added', async () => {
      await renderOrderScreen();
      await showCategoryOf(available);

      await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));
      expect(screen.getByText(`Items: 1 · Total: $${price}`)).toBeOnTheScreen();

      await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));
      expect(
        screen.getByText(`Items: 2 · Total: $${(available.price * 2).toFixed(2)}`),
      ).toBeOnTheScreen();
    });

    it('keeps the cart when the category filter changes', async () => {
      await renderOrderScreen();
      await showCategoryOf(available);
      await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));

      await fireEvent.press(screen.getByRole('button', { name: 'All' }));

      expect(screen.getByText(`Items: 1 · Total: $${price}`)).toBeOnTheScreen();
    });

    it('empties the cart when "Clear" is pressed', async () => {
      await renderOrderScreen();
      await showCategoryOf(available);
      await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));

      await fireEvent.press(screen.getByRole('button', { name: 'Clear' }));

      expect(screen.getByText('Items: 0 · Total: $0.00')).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
    });

    it('offers no "Add" button for sold-out products', async () => {
      await renderOrderScreen();
      await showCategoryOf(soldOut);

      expect(screen.getByText(soldOut.name)).toBeOnTheScreen();
      expect(screen.queryByRole('button', { name: `Add ${soldOut.name}` })).not.toBeOnTheScreen();
    });
  });
});
