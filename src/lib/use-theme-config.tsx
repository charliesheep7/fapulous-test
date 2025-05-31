import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import colors from '@/components/ui/colors';

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.primary[400], // Medium blue for dark theme
    background: colors.charcoal[950], // Darkest blue-black background
    text: colors.charcoal[100], // Light blue-gray text
    border: colors.charcoal[600], // Medium blue-gray borders
    card: colors.charcoal[850], // Dark blue card backgrounds
    notification: colors.primary[500], // Deep Sky Blue for notifications
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[500], // Deep Sky Blue (your main brand color)
    background: colors.background.primary, // Pure white background
    text: colors.text.primary, // Your dark blue text (#031340)
    border: colors.neutral[300], // Light blue-gray borders
    card: colors.background.secondary, // Very light blue-white for cards
    notification: colors.primary[500], // Deep Sky Blue for notifications
  },
};

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  if (colorScheme === 'dark') return DarkTheme;

  return LightTheme;
}
