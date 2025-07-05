import { router, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ChevronLeft } from '@/components/ui/icons';

function BackButton() {
  const { colorScheme } = useColorScheme();
  
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="flex-row items-center justify-center p-2"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <ChevronLeft color={colorScheme === 'dark' ? '#F5F5F5' : '#000'} />
    </TouchableOpacity>
  );
}

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="mood-selection"
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => <BackButton />,
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="porn-question"
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => <BackButton />,
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="session-intro"
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => <BackButton />,
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="voice-chat"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="affirmation"
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => <BackButton />,
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Stack>
  );
}
