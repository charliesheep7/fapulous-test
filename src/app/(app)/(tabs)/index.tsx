import { router } from 'expo-router';
import React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  GradientBackground,
  View,
} from '@/components/ui';

export default function Fapulous() {
  const handleStartPress = () => {
    router.push('/(app)/(stack)/mood-selection');
  };

  return (
    <GradientBackground>
      <View className="flex-1">
        <FocusAwareStatusBar />

        {/* Main content */}
        <View className="flex-1 items-center justify-center px-8">
          {/* Elegant enhanced button */}
          <Button
            label="Start feeling better"
            onPress={handleStartPress}
            variant="outline"
            size="lg"
            className="h-16 min-w-64 rounded-full bg-white/90 shadow-xl backdrop-blur-sm border-0"
            textClassName="text-primary-700 dark:text-primary-600 font-semibold text-xl tracking-wide"
          />
        </View>
      </View>
    </GradientBackground>
  );
}
