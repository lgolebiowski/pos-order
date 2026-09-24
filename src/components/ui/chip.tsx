import { Pressable, StyleSheet, Text } from 'react-native';

import { fontSize, radius, spacing, useThemeColors } from '@/theme/theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: colors.primary, borderColor: colors.primary }
          : { borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: selected ? colors.onPrimary : colors.foreground }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.full,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
