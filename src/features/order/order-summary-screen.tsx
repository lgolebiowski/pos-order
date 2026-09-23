import { FlatList, Text, View } from 'react-native';

import { useCart } from '@/features/cart/cart-context';
import { getItemCount, getLineTotal, getTotal } from '@/features/cart/totals';

export function OrderSummaryScreen() {
  const { cart } = useCart();

  return (
    <FlatList
      data={cart.lines}
      keyExtractor={(line) => line.product.id}
      renderItem={({ item: line }) => (
        <View>
          <Text>{line.product.name}</Text>
          <Text>
            {line.quantity} × ${line.product.price.toFixed(2)}
          </Text>
          <Text>${getLineTotal(line).toFixed(2)}</Text>
        </View>
      )}
      ListEmptyComponent={<Text>Your order is empty.</Text>}
      ListFooterComponent={
        cart.lines.length > 0 ? (
          <View>
            <Text>Items: {getItemCount(cart)}</Text>
            <Text>Total: ${getTotal(cart).toFixed(2)}</Text>
          </View>
        ) : null
      }
    />
  );
}
