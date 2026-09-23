import { Stack } from 'expo-router';
import { useState } from 'react';
import { SectionList, Text } from 'react-native';

import { products } from '@/data/products';
import { CategoryFilter } from '@/features/menu/components/category-filter';
import { ProductRow } from '@/features/menu/components/product-row';
import { groupProductsByCategory } from '@/features/menu/group-products';
import type { CategoryFilterValue } from '@/features/menu/types';

export default function OrderScreen() {
  const [filter, setFilter] = useState<CategoryFilterValue>('all');
  const sections = groupProductsByCategory(products, filter);

  return (
    <>
      <Stack.Screen options={{ title: 'Order' }} />

      <SectionList
        sections={sections}
        keyExtractor={(product) => product.id}
        ListHeaderComponent={<CategoryFilter value={filter} onChange={setFilter} />}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderItem={({ item }) => <ProductRow product={item} />}
      />
    </>
  );
}
