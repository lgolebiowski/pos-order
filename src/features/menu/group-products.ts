import { categories, categoryLabels } from './categories';
import type { CategoryFilterValue, Product, ProductCategory } from './types';

export type ProductSection = {
  category: ProductCategory;
  title: string;
  data: Product[];
};

export function groupProductsByCategory(
  products: Product[],
  filter: CategoryFilterValue = 'all',
): ProductSection[] {
  const visibleCategories = filter === 'all' ? categories : [filter];

  return visibleCategories
    .map((category) => ({
      category,
      title: categoryLabels[category],
      data: products.filter((product) => product.category === category),
    }))
    .filter((section) => section.data.length > 0);
}
