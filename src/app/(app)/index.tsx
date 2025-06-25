import { router } from 'expo-router';
import React from 'react';

import { Button, FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Fapulous() {
  const handleStartPress = () => {
    router.push('/(app)/mood-selection');
  };

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />

      {/* Gradient-like background using layered views */}
      <View className="absolute inset-0 bg-background-accent" />
      <View className="absolute inset-0 bg-primary-100/30" />

      {/* Main content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Enhanced headline with better typography */}
        <Text className="mb-16 px-4 text-center text-4xl font-black leading-tight tracking-wide text-text-primary dark:text-white">
          Ready when you are
        </Text>

        {/* Elegant enhanced button */}
        <Button
          label="Start feeling better"
          onPress={handleStartPress}
          variant="outline"
          size="lg"
          className="h-16 min-w-64 rounded-full border-2 border-white/30 bg-white/95 shadow-lg shadow-primary-200/50"
          textClassName="text-primary-700 dark:text-primary-600 font-semibold text-xl tracking-wide"
        />
      </View>
    </View>
  );
}
