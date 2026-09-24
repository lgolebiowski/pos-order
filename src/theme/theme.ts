import { useColorScheme } from 'react-native';

// Palette mirrors the order-dashboard web app (Tailwind zinc + red).
const zinc = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
};

const lightColors = {
  background: '#ffffff',
  foreground: '#171717',
  muted: zinc[500],
  border: zinc[300],
  divider: zinc[200],
  subtle: zinc[50],
  primary: zinc[900],
  onPrimary: zinc[50],
  danger: '#dc2626',
};

const darkColors: typeof lightColors = {
  background: '#0a0a0a',
  foreground: '#ededed',
  muted: zinc[400],
  border: zinc[700],
  divider: zinc[800],
  subtle: zinc[900],
  primary: zinc[50],
  onPrimary: zinc[900],
  danger: '#f87171',
};

export type ThemeColors = typeof lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  page: 24,
};

export const radius = {
  md: 6,
  full: 999,
};

export const fontSize = {
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
};

export function useThemeColors(): ThemeColors {
  return useColorScheme() === 'dark' ? darkColors : lightColors;
}
