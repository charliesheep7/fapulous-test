import { router } from 'expo-router';
import * as React from 'react';

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

function AffirmationPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-center text-2xl font-bold text-text-primary dark:text-white">
        Affirmation Display
      </Text>
      <Text className="mb-8 text-center text-gray-600 dark:text-gray-400">
        This will be implemented in Phase 4
      </Text>

      <View className="w-full rounded-lg bg-primary-50 p-6 dark:bg-primary-900/20">
        <Text className="text-center text-lg text-primary-700 dark:text-primary-300">
          "Your personalized affirmation will appear here after completing a
          session"
        </Text>
      </View>
    </View>
  );
}

export default function AffirmationPage() {
  const { currentSession, clearSession } = useSessionStore();

  const handleFinish = () => {
    clearSession();
    router.push('/(app)/');
  };

  if (!currentSession) {
    return <AffirmationNotFound />;
  }

  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />

      <AffirmationPlaceholder />

      <View className="p-6">
        <Button label="Finish Session" onPress={handleFinish} size="lg" />
      </View>
    </SafeAreaView>
  );
}
