import * as React from 'react';

import { Button, View } from '@/components/ui';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function AffirmationButton({ onPress, disabled = false }: Props) {
  return (
    <View className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <Button
        label="Get some love 💝"
        onPress={onPress}
        disabled={disabled}
        size="lg"
        className="w-full"
      />
    </View>
  );
}
