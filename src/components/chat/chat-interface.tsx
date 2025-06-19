import { router } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';

import { showErrorMessage } from '@/components/ui/utils';
import {
  generateAffirmation,
  sendChatMessage,
} from '@/lib/services/openai/text-chat';
import { useSessionStore } from '@/lib/stores/session-store';
import type { ChatMessage, FapulousSession } from '@/types/session';

import { AffirmationButton } from './affirmation-button';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';

// Helper function to generate affirmation after 5th user message
async function handleAffirmationGeneration(
  message: string,
  currentSession: FapulousSession,
  setAffirmation: (affirmation: string) => void
) {
  const newUserMessageCount =
    currentSession.messages.filter((msg) => msg.role === 'user').length + 1;

  if (newUserMessageCount === 5 && !currentSession.affirmation) {
    try {
      const tempMessage: ChatMessage = {
        id: 'temp',
        sessionId: currentSession.id,
        role: 'user',
        content: message,
        messageType: 'text',
        roundNumber: newUserMessageCount,
        timestamp: new Date(),
      };

      const affirmation = await generateAffirmation(
        [...currentSession.messages, tempMessage],
        currentSession.selectedMoods
      );
      setAffirmation(affirmation);
    } catch (affirmationError) {
      console.error('Failed to generate affirmation:', affirmationError);
      setAffirmation(
        "You don't need to earn rest or comfort. You're allowed to start again."
      );
    }
  }
}

export function ChatInterface() {
  const [isTyping, setIsTyping] = useState(false);
  const { currentSession, addMessage, setLoading, setError, setAffirmation } =
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

      // Generate affirmation after user's 5th message
      await handleAffirmationGeneration(
        message,
        currentSession,
        setAffirmation
      );
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
