import type { Product } from '@/features/menu/types';

export const products: Product[] = [
  // Mains
  {
    id: 'p-001',
    name: 'Chicken & Rice',
    category: 'main',
    price: 4.5,
    isAvailable: true,
  },
  {
    id: 'p-002',
    name: 'Spaghetti Bolognese',
    category: 'main',
    price: 4.2,
    isAvailable: true,
  },
  {
    id: 'p-003',
    name: 'Veggie Burger',
    category: 'main',
    price: 4,
    isAvailable: true,
  },
  {
    id: 'p-004',
    name: 'Fish & Chips',
    category: 'main',
    price: 4.8,
    isAvailable: false,
  },

  // Snacks
  {
    id: 'p-009',
    name: 'Ham & Cheese Sandwich',
    category: 'snack',
    price: 2.5,
    isAvailable: true,
  },
  {
    id: 'p-011',
    name: 'Apple',
    category: 'snack',
    price: 0.6,
    isAvailable: true,
  },
  {
    id: 'p-012',
    name: 'Banana',
    category: 'snack',
    price: 0.6,
    isAvailable: true,
  },
  {
    id: 'p-013',
    name: 'Yogurt Cup',
    category: 'snack',
    price: 1.2,
    isAvailable: true,
  },

  // Drinks
  {
    id: 'p-014',
    name: 'Still Water 0.5L',
    category: 'drink',
    price: 1,
    isAvailable: true,
  },
  {
    id: 'p-015',
    name: 'Apple Juice',
    category: 'drink',
    price: 1.5,
    isAvailable: true,
  },
  {
    id: 'p-016',
    name: 'Milk',
    category: 'drink',
    price: 1.2,
    isAvailable: true,
  },
  {
    id: 'p-017',
    name: 'Hot Chocolate',
    category: 'drink',
    price: 1.8,
    isAvailable: false,
  },

  // Desserts
  {
    id: 'p-018',
    name: 'Chocolate Muffin',
    category: 'dessert',
    price: 1.7,
    isAvailable: true,
  },
  {
    id: 'p-019',
    name: 'Fruit Salad',
    category: 'dessert',
    price: 2,
    isAvailable: true,
  },
  {
    id: 'p-020',
    name: 'Rice Pudding',
    category: 'dessert',
    price: 1.6,
    isAvailable: true,
  },
];
