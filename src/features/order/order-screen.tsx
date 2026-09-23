import { useReducer, useState } from 'react';
import { SectionList, Text, View } from 'react-native';

import { products } from '@/data/products';
import { cartReducer, emptyCart } from '@/features/cart/cart-reducer';
import { CartSummary } from '@/features/cart/components/cart-summary';
import { getQuantity } from '@/features/cart/totals';
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
