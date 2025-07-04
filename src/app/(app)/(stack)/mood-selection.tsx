import { router } from 'expo-router';
import * as React from 'react';

import { MoodSelector } from '@/components/mood-selector';
import {
  Button,
  FocusAwareStatusBar,
  GradientBackground,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useMoodStore } from '@/lib/stores/mood-store';
import { useSessionStore } from '@/lib/stores/session-store';

export default function MoodSelectionPage() {
  const { isSelectionValid, selectedMoods } = useMoodStore();
  const { createSession } = useSessionStore();

  const handleContinue = () => {
    if (!isSelectionValid) return;

    try {
      // Create a new session with selected moods
      createSession(selectedMoods);

      // Navigate to porn question screen
      router.push('/(app)/(stack)/porn-question');
    } catch (error) {
      console.error('Failed to create session:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />

        {/* Header */}
        <View className="px-6 pb-6 pt-12">
          <View className="mb-6">
            <Text className="mb-1 text-center text-2xl font-bold text-black dark:text-gray-100">
              How are you feeling right now?
            </Text>
          </View>
        </View>

        {/* Mood Selection Grid */}
        <View className="flex-1 px-6">
          <MoodSelector />
        </View>

        {/* Bottom Actions */}
        <View className="p-6">
          <Button
            label="Continue"
            onPress={handleContinue}
            disabled={!isSelectionValid}
            size="lg"
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
