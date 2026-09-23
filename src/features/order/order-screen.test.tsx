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
});
