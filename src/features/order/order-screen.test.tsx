import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { products } from '@/data/products';
import { CartProvider } from '@/features/cart/cart-context';
import { categories, categoryLabels } from '@/features/menu/categories';
import type { ProductCategory } from '@/features/menu/types';

import { OrderScreen } from './order-screen';

const namesIn = (category: ProductCategory) =>
  products
    .filter((product) => product.category === category)
    .map((product) => product.name);

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

const renderOrderScreen = () => render(<OrderScreen />, { wrapper: CartProvider });

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

    it('shows the quantity next to the product and changes it with "+" and "−"', async () => {
      await renderOrderScreen();
      await showCategoryOf(available);
      const add = () => fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));
      const remove = () =>
        fireEvent.press(screen.getByRole('button', { name: `Remove ${available.name}` }));

      await add();
      expect(screen.getByLabelText(`1 ${available.name} in cart`)).toBeOnTheScreen();

      await add();
      await add();
      expect(screen.getByLabelText(`3 ${available.name} in cart`)).toBeOnTheScreen();

      await remove();
      expect(screen.getByLabelText(`2 ${available.name} in cart`)).toBeOnTheScreen();
      expect(
        screen.getByText(`Items: 2 · Total: $${(available.price * 2).toFixed(2)}`),
      ).toBeOnTheScreen();
    });

    it('goes back to "Add" when the last one is removed', async () => {
      await renderOrderScreen();
      await showCategoryOf(available);

      await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));
      await fireEvent.press(screen.getByRole('button', { name: `Remove ${available.name}` }));

      expect(screen.queryByLabelText(/in cart/)).not.toBeOnTheScreen();
      expect(screen.getByRole('button', { name: `Add ${available.name}` })).toHaveTextContent('Add');
      expect(screen.getByText('Items: 0 · Total: $0.00')).toBeOnTheScreen();
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

    it('disables "Review order" while the cart is empty', async () => {
      await renderOrderScreen();

      expect(screen.getByRole('button', { name: 'Review order' })).toBeDisabled();
    });

    it('opens the summary from "Review order" once something is in the cart', async () => {
      await renderOrderScreen();
      await showCategoryOf(available);
      await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));

      await fireEvent.press(screen.getByRole('button', { name: 'Review order' }));

      expect(router.push).toHaveBeenCalledWith('/summary');
    });
  });
});
