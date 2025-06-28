import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import colors from './colors';

type Props = {
  children?: React.ReactNode;
};

export function GradientBackground({ children }: Props) {
  return (
    <LinearGradient
      colors={[
        colors.cyan[100],
        colors.sky[50],
        colors.gray[50],
        colors.slate[50],
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
