import React from 'react';

import { Text, View } from '@/components/ui';
import type { TxKeyPath } from '@/lib';

type Props = {
  children: React.ReactNode;
  title?: TxKeyPath;
  titleMuted?: boolean;
};

export const ItemsContainer = ({
  children,
  title,
  titleMuted = false,
}: Props) => {
  return (
    <>
      {title && (
        <Text
          className={`pb-2 pt-4 text-lg ${titleMuted ? 'text-gray-500 dark:text-gray-400' : 'text-black dark:text-gray-100'}`}
          tx={title}
        />
      )}
      {
        <View className="rounded-md border border-gray-200 dark:border-interactive dark:bg-gray-850">
          {children}
        </View>
      }
    </>
  );
};
