import { router } from 'expo-router';
import { useState } from 'react';
import { Button, SectionList, Text, View } from 'react-native';

import { products } from '@/data/products';
import { useCart } from '@/features/cart/cart-context';
import { CartSummary } from '@/features/cart/components/cart-summary';
import { getItemCount, getQuantity } from '@/features/cart/totals';
import { CategoryFilter } from '@/features/menu/components/category-filter';
import { ProductRow } from '@/features/menu/components/product-row';
import { groupProductsByCategory } from '@/features/menu/group-products';
import type { CategoryFilterValue } from '@/features/menu/types';

export function OrderScreen() {
  const [filter, setFilter] = useState<CategoryFilterValue>('all');
  const { cart, dispatch } = useCart();
  const sections = groupProductsByCategory(products, filter);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(product) => product.id}
      ListHeaderComponent={
        <View>
          <CartSummary cart={cart} onClear={() => dispatch({ type: 'clear' })} />
          <Button
            title="Review order"
            disabled={getItemCount(cart) === 0}
            onPress={() => router.push('/summary')}
          />
          <CategoryFilter value={filter} onChange={setFilter} />
        </View>
      }
      renderSectionHeader={({ section }) => <Text accessibilityRole="header">{section.title}</Text>}
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
  );
}
