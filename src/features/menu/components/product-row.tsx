import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { fontSize, spacing, useThemeColors } from '@/theme/theme';

import type { Product } from '../types';

type Props = {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
};

export function ProductRow({ product, quantity, onAdd, onRemove }: Props) {
  const colors = useThemeColors();
  const textColor = product.isAvailable ? colors.foreground : colors.muted;

  return (
    <View style={[styles.row, { borderBottomColor: colors.divider }]}>
      <View style={styles.details}>
        <Text style={[styles.name, { color: textColor }]}>{product.name}</Text>
        <Text style={[styles.price, { color: colors.muted }]}>${product.price.toFixed(2)}</Text>
      </View>

      {!product.isAvailable ? (
        <Text style={[styles.soldOut, { color: colors.muted }]}>Sold out</Text>
      ) : quantity === 0 ? (
        <Button
          title="Add"
          size="sm"
          accessibilityLabel={`Add ${product.name}`}
          onPress={() => onAdd(product)}
        />
      ) : (
        <View style={styles.stepper}>
          <Button
            title="−"
            size="sm"
            accessibilityLabel={`Remove ${product.name}`}
            onPress={() => onRemove(product)}
          />
          <Text
            accessibilityLabel={`${quantity} ${product.name} in cart`}
            style={[styles.quantity, { color: colors.foreground }]}
          >
            {quantity}
          </Text>
          <Button
            title="+"
            size="sm"
            variant="primary"
            accessibilityLabel={`Add ${product.name}`}
            onPress={() => onAdd(product)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  price: {
    fontSize: fontSize.sm,
  },
  soldOut: {
    fontSize: fontSize.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantity: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: fontSize.base,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
