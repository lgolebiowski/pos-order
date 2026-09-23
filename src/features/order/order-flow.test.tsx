import { fireEvent, screen } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';

import { products } from '@/data/products';
import { categoryLabels } from '@/features/menu/categories';

// Boots the real routes from src/app, including the CartProvider in _layout.
describe('order → summary flow', () => {
  const available = products.find((product) => product.isAvailable)!;

  it('shows what was added on the order screen in the summary', async () => {
    await renderRouter('./src/app', { initialUrl: '/order' });

    await fireEvent.press(screen.getByRole('button', { name: categoryLabels[available.category] }));
    await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));
    await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));
    await fireEvent.press(screen.getByRole('button', { name: 'Review order' }));

    expect(await screen.findByText(`2 × $${available.price.toFixed(2)}`)).toBeOnTheScreen();
    expect(screen.getByText(`Total: $${(available.price * 2).toFixed(2)}`)).toBeOnTheScreen();
  });

  it('opens the summary from the "Order" button in the header', async () => {
    await renderRouter('./src/app', { initialUrl: '/order' });

    await fireEvent.press(screen.getByRole('button', { name: categoryLabels[available.category] }));
    await fireEvent.press(screen.getByRole('button', { name: `Add ${available.name}` }));

    const headerButton = screen.getByRole('button', { name: 'View order, 1 item' });
    expect(headerButton).toHaveTextContent('Order (1)');
    await fireEvent.press(headerButton);

    expect(await screen.findByText(`1 × $${available.price.toFixed(2)}`)).toBeOnTheScreen();
  });
});
