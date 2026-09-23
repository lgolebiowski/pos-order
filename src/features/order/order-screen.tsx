import { useReducer, useState } from 'react';
import { SectionList, Text, View } from 'react-native';

import { products } from '@/data/products';
import { cartReducer, emptyCart } from '@/features/cart/cart-reducer';
import { CartSummary } from '@/features/cart/components/cart-summary';
import { CategoryFilter } from '@/features/menu/components/category-filter';
import { ProductRow } from '@/features/menu/components/product-row';
import { groupProductsByCategory } from '@/features/menu/group-products';
import type { CategoryFilterValue } from '@/features/menu/types';

export function OrderScreen() {
  const [filter, setFilter] = useState<CategoryFilterValue>('all');
  const [cart, dispatch] = useReducer(cartReducer, emptyCart);
  const sections = groupProductsByCategory(products, filter);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(product) => product.id}
      ListHeaderComponent={
        <View>
          <CartSummary cart={cart} onClear={() => dispatch({ type: 'clear' })} />
          <CategoryFilter value={filter} onChange={setFilter} />
        </View>
      }
      renderSectionHeader={({ section }) => <Text accessibilityRole="header">{section.title}</Text>}
      renderItem={({ item }) => (
        <ProductRow product={item} onAdd={(product) => dispatch({ type: 'add', product })} />
      )}
    />
  );
}
