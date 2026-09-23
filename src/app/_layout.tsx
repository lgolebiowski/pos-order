import { Stack } from 'expo-router';

import { CartProvider } from '@/features/cart/cart-context';
import { OrderHeaderButton } from '@/features/order/components/order-header-button';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen
          name="order"
          options={{ title: 'Order', headerRight: () => <OrderHeaderButton /> }}
        />
        <Stack.Screen name="summary" options={{ title: 'Order summary' }} />
      </Stack>
    </CartProvider>
  );
}
