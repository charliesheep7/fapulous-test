import { router } from 'expo-router';
import * as React from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useSessionStore } from '@/lib/stores/session-store';

function AffirmationNotFound() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-xl text-text-primary dark:text-white">
          Affirmation not found
        </Text>
        <Button
          label="Go Home"
          onPress={() => router.push('/(app)/')}
          className="mt-4"
        />
      </View>
    </SafeAreaView>
  );
}

function AffirmationCard({ affirmation }: { affirmation: string }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Animated.View
        entering={FadeInUp.delay(200).duration(800)}
        className="mb-8"
      >
        <Text className="text-center text-2xl font-bold text-text-primary dark:text-white">
          Your Affirmation
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-400">
          A personal message for you
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(800)}
        className="w-full rounded-2xl bg-primary-50 p-8 shadow-sm dark:bg-primary-900/20"
      >
        <View className="items-center">
          <Text className="mb-4 text-4xl">💝</Text>
          <Text className="text-center text-lg leading-6 text-primary-700 dark:text-primary-300">
            {affirmation}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(600).duration(600)}
        className="mt-8"
      >
        <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
          Take a moment to let this sink in
        </Text>
      </Animated.View>
    </View>
  );
}

export default function AffirmationPage() {
  const { currentSession, clearSession } = useSessionStore();

  const handleFinish = () => {
    clearSession();
    router.push('/(app)/');
  };

  if (!currentSession || !currentSession.affirmation) {
    return <AffirmationNotFound />;
  }

  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />

      <AffirmationCard affirmation={currentSession.affirmation} />

      <Animated.View
        entering={FadeInUp.delay(800).duration(600)}
        className="p-6"
      >
        <Button label="Finish Session" onPress={handleFinish} size="lg" />
      </Animated.View>
    </SafeAreaView>
  );
}
