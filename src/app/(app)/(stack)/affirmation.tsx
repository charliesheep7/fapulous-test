import { router } from 'expo-router';
import * as React from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import {
  Button,
  FocusAwareStatusBar,
  GradientBackground,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useSessionStore } from '@/lib/stores/session-store';

function AffirmationNotFound() {
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-xl text-text-primary dark:text-text-primary">
            Affirmation not found
          </Text>
          <Button
            label="Go Home"
            onPress={() => router.push('/(app)/(tabs)/')}
            className="mt-4"
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

function AffirmationCard({ affirmation }: { affirmation: string }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Animated.View
        entering={FadeInUp.delay(200).duration(800)}
        className="mb-8"
      >
        <Text className="text-center text-2xl font-bold text-text-primary dark:text-text-primary">
          Your Affirmation
        </Text>
        <Text className="mt-2 text-center text-text-secondary dark:text-text-secondary">
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
        <Text className="text-center text-sm text-text-muted dark:text-text-muted">
          Take a moment to let this sink in
        </Text>
      </Animated.View>
    </View>
  );
}

export default function AffirmationPage() {
  const { currentSession, clearSession } = useSessionStore();

  console.log('🎯 Affirmation page loaded:', {
    hasCurrentSession: !!currentSession,
    hasAffirmation: !!currentSession?.affirmation,
    affirmation: currentSession?.affirmation,
  });

  const handleFinish = () => {
    console.log('🏁 Finishing session and navigating home');
    clearSession();
    router.push('/(app)/(tabs)/');
  };

  if (!currentSession) {
    console.log('❌ No current session found');
    return <AffirmationNotFound />;
  }

  if (!currentSession.affirmation) {
    console.log('❌ No affirmation found in session');
    return <AffirmationNotFound />;
  }

  console.log('✅ Displaying affirmation card');
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />

        <AffirmationCard affirmation={currentSession.affirmation} />

        <Animated.View
          entering={FadeInUp.delay(800).duration(600)}
          className="p-6"
        >
          <Button label="Finish Session" onPress={handleFinish} size="lg" />
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
}
