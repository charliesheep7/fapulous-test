import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

// Discord theme colors mapped to our new Tailwind utilities
const discordColors = {
  primary: '#5965F2',        // primary-500 (Discord blurple)
  background: '#131317',     // gray-900 (Discord main background)
  surface: '#1C1D23',        // gray-850 (Discord surface)
  text: '#F5F5F5',          // gray-100 (Discord textPrimary)
  textSecondary: '#CBCCD1',  // gray-300 (Discord text)
  border: '#2E2F35',         // Our custom border-subtle
  white: '#FFFFFF',
};

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: discordColors.primary,
    background: discordColors.background,
    text: discordColors.text,
    border: discordColors.border,
    card: discordColors.surface,
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: discordColors.primary,
    background: discordColors.white,
  },
};

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  if (colorScheme === 'dark') return DarkTheme;

  return LightTheme;
}
