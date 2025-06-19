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
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-500 dark:bg-primary-600'
            : 'bg-gray-100 dark:bg-gray-700'
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
