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
    primary: colors.discord.blurple, // Discord blurple for primary actions
    background: colors.discord.background, // Discord main background (#131317)
    text: colors.discord.textPrimary, // Discord brightest text (#F5F5F5) for nav/headers
    border: colors.discord.border, // Discord subtle borders
    card: colors.discord.surface, // Discord surface areas (#1C1D23)
    notification: colors.discord.accent, // Discord accent color for notifications
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[500], // Keep blurple as primary for light theme
    background: colors.white, // Pure white background for light theme
    text: colors.black, // Black text for light theme
    border: colors.neutral[300], // Light borders for light theme
    card: colors.neutral[50], // Very light cards for light theme
    notification: colors.primary[500], // Blurple for notifications
  },
};

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  if (colorScheme === 'dark') return DarkTheme;

  return LightTheme;
}
