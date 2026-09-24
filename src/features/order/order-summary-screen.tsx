import { router } from 'expo-router';
import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native';

import { useCart } from '@/features/cart/cart-context';
import { getItemCount, getLineTotal, getTotal } from '@/features/cart/totals';

import { useSubmitOrder } from './use-submit-order';

const backToMenu = () => router.dismissTo('/order');

export function OrderSummaryScreen() {
  const { cart } = useCart();
  const { state, submit } = useSubmitOrder();

  if (state.status === 'success') {
    const { confirmation } = state;
    return (
      <View>
        <Text accessibilityRole="header">Order placed!</Text>
        <Text>Order number: {confirmation.orderId}</Text>
        <Text>
          {confirmation.itemCount} {confirmation.itemCount === 1 ? 'item' : 'items'} · Total: $
          {confirmation.total.toFixed(2)}
        </Text>
        <Button title="Start new order" onPress={backToMenu} />
      </View>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <View>
        <Text>Your order is empty.</Text>
        <Text>Add something from the menu first.</Text>
        <Button title="Back to menu" onPress={backToMenu} />
      </View>
    );
  }

  const isSubmitting = state.status === 'submitting';

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
      ListFooterComponent={
        <View>
          <Text>Items: {getItemCount(cart)}</Text>
          <Text>Total: ${getTotal(cart).toFixed(2)}</Text>

          {state.status === 'error' && (
            <View accessible accessibilityRole="alert">
              <Text>Couldn&apos;t submit your order. {state.message}</Text>
              <Text>Your items are still in the order.</Text>
            </View>
          )}

          {isSubmitting ? (
            <View>
              <ActivityIndicator accessibilityLabel="Submitting order" />
              <Text>Submitting your order…</Text>
            </View>
          ) : null}

          <Button
            title={state.status === 'error' ? 'Try again' : 'Submit order'}
            disabled={isSubmitting}
            onPress={() => void submit()}
          />
        </View>
      }
    />
  );
}
