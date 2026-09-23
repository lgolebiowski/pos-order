import { Text, View } from 'react-native';

import type { Product } from '../types';

export function ProductRow({ product }: { product: Product }) {
  return (
    <View>
      <Text>{product.name}</Text>
      <Text>${product.price.toFixed(2)}</Text>
      {!product.isAvailable && <Text>Sold out</Text>}
    </View>
  );
}
