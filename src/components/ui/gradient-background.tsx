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
      colors={[colors.indigo[100], colors.purple[50], colors.blue[100]]}
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
