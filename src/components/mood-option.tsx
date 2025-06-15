import * as React from 'react';

import { Pressable, Text, View } from '@/components/ui';
import type { MoodOption as MoodOptionType, MoodType } from '@/types/mood';

type MoodOptionProps = {
  mood: MoodOptionType;
  isSelected: boolean;
  onToggle: (moodId: MoodType) => void;
};

export function MoodOption({ mood, isSelected, onToggle }: MoodOptionProps) {
  const handlePress = () => {
    onToggle(mood.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`
        flex-row items-center rounded-xl border-2 p-4 transition-all
        ${
          isSelected
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
        }
      `}
    >
      <View className="mr-4">
        <Text className="text-3xl">{mood.emoji}</Text>
      </View>

      <View className="flex-1">
        <Text
          className={`
            text-lg font-semibold
            ${
              isSelected
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-800 dark:text-gray-200'
            }
          `}
        >
          {mood.label}
        </Text>
      </View>
    </Pressable>
  );
}
