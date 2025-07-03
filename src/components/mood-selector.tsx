import * as React from 'react';

import { ScrollView, View } from '@/components/ui';
import { useMoodStore } from '@/lib/stores/mood-store';
import type { MoodType } from '@/types/mood';
import { MOOD_OPTIONS } from '@/types/mood';

import { MoodOption } from './mood-option';

export function MoodSelector() {
  const { selectedMoods, toggleMood } = useMoodStore();

  const handleMoodToggle = (moodId: MoodType) => {
    toggleMood(moodId);
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-3 pb-6">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id);

          return (
            <MoodOption
              key={mood.id}
              mood={mood}
              isSelected={isSelected}
              onToggle={handleMoodToggle}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
