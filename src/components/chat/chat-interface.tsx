import { router } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';

import { showErrorMessage } from '@/components/ui/utils';
import { sendChatMessage } from '@/lib/services/openai/text-chat';
import { useSessionStore } from '@/lib/stores/session-store';

import { AffirmationButton } from './affirmation-button';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';

export function ChatInterface() {
  const [isTyping, setIsTyping] = useState(false);
  const { currentSession, addMessage, setLoading, setError } =
    useSessionStore();

  if (!currentSession) {
    return null;
  }

  const userMessageCount = currentSession.messages.filter(
    (msg) => msg.role === 'user'
  ).length;
  const isConversationComplete = userMessageCount >= 5;

  const handleSendMessage = async (message: string) => {
    try {
      setError(null);
      addMessage(message, 'user');
      setIsTyping(true);
      setLoading(true);

      const aiResponse = await sendChatMessage(
        message,
        currentSession.messages,
        currentSession.selectedMoods
      );

      addMessage(aiResponse, 'assistant');
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      showErrorMessage(errorMessage);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleGenerateAffirmation = () => {
    router.push('/(app)/affirmation');
  };

  return (
    <>
      <MessageList messages={currentSession.messages} isTyping={isTyping} />

      {isConversationComplete ? (
        <AffirmationButton
          onPress={handleGenerateAffirmation}
          disabled={isTyping}
        />
      ) : (
        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
          placeholder="Share what's on your mind..."
        />
      )}
    </>
  );
}
