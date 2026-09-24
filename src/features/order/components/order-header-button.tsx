import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useCart } from '@/features/cart/cart-context';
import { getItemCount } from '@/features/cart/totals';
import { fontSize, spacing, useThemeColors } from '@/theme/theme';

export function OrderHeaderButton() {
  const colors = useThemeColors();
  const { cart } = useCart();
  const itemCount = getItemCount(cart);
  const disabled = itemCount === 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View order, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      disabled={disabled}
      onPress={() => router.push('/summary')}
      hitSlop={8}
      style={styles.button}
    >
      <Text style={[styles.label, { color: disabled ? colors.muted : colors.foreground }]}>
        {itemCount > 0 ? `Order (${itemCount})` : 'Order'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.sm,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});
