import { Button, Text, View } from 'react-native';

import type { Product } from '../types';

type Props = {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
};

export function ProductRow({ product, quantity, onAdd, onRemove }: Props) {
  return (
    <View>
      <Text>{product.name}</Text>
      <Text>${product.price.toFixed(2)}</Text>
      {!product.isAvailable ? (
        <Text>Sold out</Text>
      ) : quantity === 0 ? (
        <Button
          title="Add"
          accessibilityLabel={`Add ${product.name}`}
          onPress={() => onAdd(product)}
        />
      ) : (
        <View>
          <Button
            title="−"
            accessibilityLabel={`Remove ${product.name}`}
            onPress={() => onRemove(product)}
          />
          <Text accessibilityLabel={`${quantity} ${product.name} in cart`}>{quantity}</Text>
          <Button
            title="+"
            accessibilityLabel={`Add ${product.name}`}
            onPress={() => onAdd(product)}
          />
        </View>
      )}
    </View>
  );
}
