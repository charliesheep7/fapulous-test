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
          className={`pb-2 pt-4 text-lg ${titleMuted ? 'text-text-muted dark:text-text-muted' : 'text-text-primary dark:text-text-primary'}`}
          tx={title}
        />
      )}
      {
        <View className=" dark:border-discord-border dark:bg-discord-elevated rounded-md border border-neutral-200">
          {children}
        </View>
      }
    </>
  );
};
