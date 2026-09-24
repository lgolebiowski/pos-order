import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { spacing } from '@/theme/theme';

import { categories, categoryLabels } from '../categories';
import type { CategoryFilterValue } from '../types';

type Props = {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
};

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip label="All" selected={value === 'all'} onPress={() => onChange('all')} />
      {categories.map((category) => (
        <Chip
          key={category}
          label={categoryLabels[category]}
          selected={value === category}
          onPress={() => onChange(category)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.md,
  },
});
