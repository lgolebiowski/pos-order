import { Button, View } from 'react-native';

import { categories, categoryLabels } from '../categories';
import type { CategoryFilterValue } from '../types';

type Props = {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
};

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <View>
      <Button title="All" disabled={value === 'all'} onPress={() => onChange('all')} />
      {categories.map((category) => (
        <Button
          key={category}
          title={categoryLabels[category]}
          disabled={value === category}
          onPress={() => onChange(category)}
        />
      ))}
    </View>
  );
}
