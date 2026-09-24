import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { fontSize, spacing, useThemeColors } from '@/theme/theme';

import { getItemCount, getTotal } from '../totals';
import type { Cart } from '../types';

type Props = {
  cart: Cart;
  onClear: () => void;
};

export function CartSummary({ cart, onClear }: Props) {
  const colors = useThemeColors();
  const itemCount = getItemCount(cart);

  return (
    <View style={styles.row}>
      <Text style={[styles.text, { color: colors.foreground }]}>
        Items: {itemCount} · Total: ${getTotal(cart).toFixed(2)}
      </Text>
      <Button title="Clear" variant="ghost" size="sm" disabled={itemCount === 0} onPress={onClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
