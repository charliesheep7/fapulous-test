import * as React from 'react';

import { MoodSelector } from '@/components/mood-selector';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useMoodStore } from '@/lib/stores/mood-store';

export default function MoodSelectionPage() {
  const { isSelectionValid, selectedMoods } = useMoodStore();

  const handleContinue = () => {
    if (!isSelectionValid) return;

    // TODO: Navigate to chat session with selected moods
    console.log('Continue with moods:', selectedMoods);
    // router.push(`/chat/${sessionId}`);
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />

      {/* Header */}
      <View className="px-6 pb-6 pt-4">
        <View className="mb-6">
          <Text className="mb-1 text-center text-2xl font-bold text-text-primary dark:text-white">
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
          variant="secondary"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
