import { useFocusEffect } from 'expo-router';
import * as React from 'react';
import { Platform } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';

type Props = { hidden?: boolean };
export const FocusAwareStatusBar = ({ hidden = false }: Props) => {
  const [isFocused, setIsFocused] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  if (Platform.OS === 'web') return null;

  // Always use light content since we have dark overlay for readability
  return isFocused ? <SystemBars style="light" hidden={hidden} /> : null;
};
