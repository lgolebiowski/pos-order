import { Button, Text, View } from 'react-native';

import type { Product } from '../types';

type Props = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductRow({ product, onAdd }: Props) {
  return (
    <View>
      <Text>{product.name}</Text>
      <Text>${product.price.toFixed(2)}</Text>
      {product.isAvailable ? (
        <Button
          title="Add"
          accessibilityLabel={`Add ${product.name}`}
          onPress={() => onAdd(product)}
        />
      ) : (
        <Text>Sold out</Text>
      )}
    </View>
  );
}
