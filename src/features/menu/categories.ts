import type { ProductCategory } from './types';

export const categoryLabels: Record<ProductCategory, string> = {
  main: 'Mains',
  snack: 'Snacks',
  drink: 'Drinks',
  dessert: 'Desserts',
};

/** Categories in display order. */
export const categories = Object.keys(categoryLabels) as ProductCategory[];
