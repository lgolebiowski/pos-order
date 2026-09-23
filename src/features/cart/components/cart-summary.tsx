import { Button, Text, View } from 'react-native';

import { getItemCount, getTotal } from '../totals';
import type { Cart } from '../types';

type Props = {
  cart: Cart;
  onClear: () => void;
};

export function CartSummary({ cart, onClear }: Props) {
  const itemCount = getItemCount(cart);

  return (
    <View>
      <Text>
        Items: {itemCount} · Total: ${getTotal(cart).toFixed(2)}
      </Text>
      <Button title="Clear" disabled={itemCount === 0} onPress={onClear} />
    </View>
  );
}
