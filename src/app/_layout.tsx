import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CartProvider } from '@/features/cart/cart-context';
import { OrderHeaderButton } from '@/features/order/components/order-header-button';
import { useThemeColors } from '@/theme/theme';

export default function RootLayout() {
  const colors = useThemeColors();

  return (
    <CartProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="order"
          options={{ title: 'Order', headerRight: () => <OrderHeaderButton /> }}
        />
        <Stack.Screen name="summary" options={{ title: 'Order summary' }} />
      </Stack>
    </CartProvider>
  );
}
