import * as React from 'react';

import { Pressable, Text, View } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import type { TxKeyPath } from '@/lib';

type ItemProps = {
  text: TxKeyPath;
  value?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

export const Item = ({
  text,
  value,
  icon,
  onPress,
  variant = 'default',
}: ItemProps) => {
  const isPressable = onPress !== undefined;
  return (
    <Pressable
      onPress={onPress}
      pointerEvents={isPressable ? 'auto' : 'none'}
      className="flex-1 flex-row items-center justify-between px-4 py-2"
    >
      <View className="flex-row items-center">
        {icon && <View className="pr-2">{icon}</View>}
        <Text
          className={
            variant === 'destructive'
              ? 'text-danger-500 dark:text-danger-500'
              : 'text-text-primary dark:text-text-primary'
          }
          tx={text}
        />
      </View>
      <View className="flex-row items-center">
        <Text className="dark:text-text-secondary text-neutral-600">
          {value}
        </Text>
        {isPressable && (
          <View className="pl-2">
            <ArrowRight />
          </View>
        )}
      </View>
    </Pressable>
  );
};
