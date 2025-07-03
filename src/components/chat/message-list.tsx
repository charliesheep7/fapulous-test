import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';

import { View } from '@/components/ui';
import type { ChatMessage } from '@/types/session';

import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';

type Props = {
  messages: ChatMessage[];
  isTyping: boolean;
};

export function MessageList({ messages, isTyping }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Simple auto-scroll to bottom when new messages arrive
  // TODO: Make this smarter - only scroll if user was already at bottom
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isTyping]);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && <TypingIndicator />}

      {/* Extra padding at bottom for better UX */}
      <View className="h-4" />
    </ScrollView>
  );
}
