import { groupProductsByCategory } from './group-products';
import type { Product } from './types';

const product = (
  id: string,
  category: Product['category'],
  isAvailable = true,
): Product => ({
  id,
  name: `Product ${id}`,
  category,
  price: 1,
  isAvailable,
});

const products: Product[] = [
  product('d1', 'dessert'),
  product('m1', 'main'),
  product('dr1', 'drink'),
  product('m2', 'main', false),
  product('dr2', 'drink'),
];

const ids = (items: Product[]) => items.map((item) => item.id);

describe('groupProductsByCategory', () => {
  it('groups products into sections in category display order', () => {
    const sections = groupProductsByCategory(products, 'all');

    expect(sections.map((section) => section.category)).toEqual([
      'main',
      'drink',
      'dessert',
    ]);
    expect(sections.map((section) => section.title)).toEqual([
      'Mains',
      'Drinks',
      'Desserts',
    ]);
  });

  it('puts each product in its own category, keeping the original order', () => {
    const sections = groupProductsByCategory(products, 'all');

    expect(sections.map((section) => ids(section.data))).toEqual([
      ['m1', 'm2'],
      ['dr1', 'dr2'],
      ['d1'],
    ]);
  });

  it('skips categories that have no products', () => {
    const sections = groupProductsByCategory(products, 'all');

    expect(
      sections.find((section) => section.category === 'snack'),
    ).toBeUndefined();
  });

  it('includes sold-out products', () => {
    const [mains] = groupProductsByCategory(products, 'main');

    expect(ids(mains.data)).toContain('m2');
  });

  it('returns only the selected category when filtered', () => {
    const sections = groupProductsByCategory(products, 'drink');

    expect(sections).toHaveLength(1);
    expect(sections[0].category).toBe('drink');
    expect(ids(sections[0].data)).toEqual(['dr1', 'dr2']);
  });

  it('returns no sections when the selected category is empty', () => {
    expect(groupProductsByCategory(products, 'snack')).toEqual([]);
  });

  it('returns no sections for an empty product list', () => {
    expect(groupProductsByCategory([], 'all')).toEqual([]);
  });

  it('shows all categories by default', () => {
    expect(groupProductsByCategory(products)).toEqual(
      groupProductsByCategory(products, 'all'),
    );
  });
});
