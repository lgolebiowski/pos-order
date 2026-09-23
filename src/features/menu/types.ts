export type ProductCategory = 'main' | 'snack' | 'drink' | 'dessert';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  isAvailable: boolean;
};

export type CategoryFilterValue = ProductCategory | 'all';
