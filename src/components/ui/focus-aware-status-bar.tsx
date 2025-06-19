import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';

type Props = { hidden?: boolean };
export const FocusAwareStatusBar = ({ hidden = false }: Props) => {
  const [isFocused, setIsFocused] = React.useState(true);
  const { colorScheme } = useColorScheme();

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  if (Platform.OS === 'web') return null;

  return isFocused ? <SystemBars style={colorScheme} hidden={hidden} /> : null;
};
