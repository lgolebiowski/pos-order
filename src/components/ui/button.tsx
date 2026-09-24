import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { fontSize, radius, spacing, useThemeColors } from '@/theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  title,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  disabled,
  ...props
}: Props) {
  const colors = useThemeColors();

  const variantStyle = {
    primary: { backgroundColor: colors.primary, borderColor: colors.primary },
    secondary: { backgroundColor: 'transparent', borderColor: colors.border },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  }[variant];
  const textColor = variant === 'primary' ? colors.onPrimary : colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        variantStyle,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...props}
    >
      <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: textColor }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sm: {
    minHeight: 36,
    minWidth: 36,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  labelSm: {
    fontSize: fontSize.sm,
  },
});
