import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function StatusBarOverlay() {
  const { top } = useSafeAreaInsets();

  // Subtle dark gradient overlay for status bar readability
  // Works on both light and dark backgrounds
  const overlayHeight = top + 20; // Status bar height + extra padding

  return (
    <LinearGradient
      colors={[
        'rgba(0, 0, 0, 0.4)', // Semi-transparent black at top
        'rgba(0, 0, 0, 0.2)', // Lighter in middle
        'rgba(0, 0, 0, 0)', // Fully transparent at bottom
      ]}
      style={[styles.overlay, { height: overlayHeight }]}
      pointerEvents="none" // Allow touches to pass through
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it's above gradient but below content
  },
});
