import { router } from 'expo-router';
import * as React from 'react';

import { Text, View } from '@/components/ui';
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
  const hasAffirmation = !!currentSession.affirmation;
  const isLoading = isTyping || isGeneratingOpening;

  // Show affirmation button only when affirmation is ready
  const showAffirmationButton = isConversationComplete && hasAffirmation;

  // Show generating affirmation message when conversation is complete but affirmation not ready
  const showGeneratingMessage =
    isConversationComplete && !hasAffirmation && !isLoading;

  return (
    <>
      <MessageList messages={currentSession.messages} isTyping={isLoading} />

      {showAffirmationButton ? (
        <AffirmationButton
          onPress={() => router.push('/(app)/(stack)/affirmation')}
          disabled={false}
        />
      ) : showGeneratingMessage ? (
        <View className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <View className="flex-row items-center justify-center">
            <Text className="text-center text-gray-600 dark:text-gray-400">
              Preparing your affirmation... 💝
            </Text>
          </View>
        </View>
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
