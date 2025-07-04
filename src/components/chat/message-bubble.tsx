import * as React from 'react';

import { Text, View } from '@/components/ui';
import type { ChatMessage } from '@/types/session';

type Props = {
  message: ChatMessage;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <View
      className={`mb-3 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <View
        className={`max-w-[80%] ${
          isUser 
            ? 'rounded-2xl bg-primary-500 px-4 py-3 dark:bg-primary-600'
            : 'px-2 py-2'
        }`}
      >
        <Text
          className={`text-base leading-5 ${
            isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}
