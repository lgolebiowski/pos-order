import { router } from 'expo-router';
import { Button } from 'react-native';

import { useCart } from '@/features/cart/cart-context';
import { getItemCount } from '@/features/cart/totals';

export function OrderHeaderButton() {
  const { cart } = useCart();
  const itemCount = getItemCount(cart);

  return (
    <Button
      title={itemCount > 0 ? `Order (${itemCount})` : 'Order'}
      accessibilityLabel={`View order, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      disabled={itemCount === 0}
      onPress={() => router.push('/summary')}
    />
  );
}
