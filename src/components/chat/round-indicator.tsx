import * as React from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  currentRound: number;
  totalRounds?: number;
};

export function RoundIndicator({ currentRound, totalRounds = 5 }: Props) {
  return (
    <View className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700">
      <Text className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {currentRound}/{totalRounds}
      </Text>
    </View>
  );
}
