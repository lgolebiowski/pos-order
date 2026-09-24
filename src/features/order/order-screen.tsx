import { router } from 'expo-router';
import { useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCart } from '@/features/cart/cart-context';
import { CartSummary } from '@/features/cart/components/cart-summary';
import { getItemCount, getQuantity } from '@/features/cart/totals';
import { CategoryFilter } from '@/features/menu/components/category-filter';
import { ProductRow } from '@/features/menu/components/product-row';
import { groupProductsByCategory } from '@/features/menu/group-products';
import type { CategoryFilterValue } from '@/features/menu/types';
import { fontSize, spacing, useThemeColors } from '@/theme/theme';

export function OrderScreen() {
  const colors = useThemeColors();
  const [filter, setFilter] = useState<CategoryFilterValue>('all');
  const { cart, dispatch } = useCart();
  const sections = groupProductsByCategory(products, filter);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.filterBar, { borderBottomColor: colors.divider }]}>
        <CategoryFilter value={filter} onChange={setFilter} />
      </View>

      <SectionList
        style={styles.list}
        sections={sections}
        keyExtractor={(product) => product.id}
        renderSectionHeader={({ section }) => (
          <Text
            accessibilityRole="header"
            style={[
              styles.sectionHeader,
              { color: colors.foreground, backgroundColor: colors.background },
            ]}
          >
            {section.title}
          </Text>
        )}
        // SectionList only re-renders rows when its props change, so pass the cart.
        extraData={cart}
        renderItem={({ item }) => (
          <ProductRow
            product={item}
            quantity={getQuantity(cart, item.id)}
            onAdd={(product) => dispatch({ type: 'add', product })}
            onRemove={(product) => dispatch({ type: 'remove', productId: product.id })}
          />
        )}
      />

      <SafeAreaView
        edges={['bottom']}
        style={[styles.footer, { borderTopColor: colors.divider, backgroundColor: colors.background }]}
      >
        <CartSummary cart={cart} onClear={() => dispatch({ type: 'clear' })} />
        <Button
          title="Review order"
          variant="primary"
          fullWidth
          disabled={getItemCount(cart) === 0}
          onPress={() => router.push('/summary')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  filterBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: spacing.page,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  footer: {
    gap: spacing.md,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
