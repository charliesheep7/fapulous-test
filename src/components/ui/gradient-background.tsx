import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import colors from './colors';
import { StatusBarOverlay } from './status-bar-overlay';

type Props = {
  children?: React.ReactNode;
};

export function GradientBackground({ children }: Props) {
  const { colorScheme } = useColorScheme();

  // Default to dark mode, use light gradient only when explicitly light
  const isLightMode = colorScheme === 'light';

  return (
    <LinearGradient
      colors={
        isLightMode
          ? [
              colors.cyan[100], // #CFFAFE - top-left
              colors.sky[50], // #F0F9FF
              colors.gray[50], // #F9FAFB
              colors.slate[50], // #F8FAFC - bottom-right
            ]
          : [
              '#E78629', // Bright orange/amber - top-left
              '#A24F1B', // Darker orange/brown
              '#431D0C', // Deep brown
              '#1A1A1E', // bottom-right
            ]
      }
      locations={
        isLightMode
          ? undefined // Use default even distribution for light mode
          : [0, 0.15, 0.25, 0.35] // Dark mode: more orange presence, smooth transitions
      }
      start={{ x: -0.1, y: -0.1 }} // starts slightly outside top-left
      end={{ x: 0.6, y: 0.8 }} // ends at a more natural, asymmetric point
      style={styles.gradient}
    >
      <StatusBarOverlay />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
