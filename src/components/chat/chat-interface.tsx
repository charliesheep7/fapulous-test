import { router } from 'expo-router';
import * as React from 'react';

import { CONVERSATION_CONFIG } from '@/lib/config/prompts';
import { useChatMessageHandler } from '@/lib/hooks/use-chat-message-handler';
import { useOpeningMessage } from '@/lib/hooks/use-opening-message';
import { useSessionStore } from '@/lib/stores/session-store';

import { AffirmationButton } from './affirmation-button';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';

export function ChatInterface() {
  const { currentSession } = useSessionStore();
  const { isGeneratingOpening } = useOpeningMessage();
  const { isTyping, handleSendMessage } = useChatMessageHandler();

  if (!currentSession) {
    return null;
  }

  const userMessageCount = currentSession.messages.filter(
    (msg) => msg.role === 'user'
  ).length;
  const isConversationComplete =
    userMessageCount >= CONVERSATION_CONFIG.MAX_USER_MESSAGES;
  const isLoading = isTyping || isGeneratingOpening;

  return (
    <>
      <MessageList messages={currentSession.messages} isTyping={isLoading} />

      {isConversationComplete ? (
        <AffirmationButton
          onPress={() => router.push('/(app)/affirmation')}
          disabled={isLoading}
        />
      ) : (
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Share what's on your mind..."
        />
      )}
    </>
  );
}
