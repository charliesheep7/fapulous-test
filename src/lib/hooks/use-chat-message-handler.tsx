import { useState } from 'react';

import { showErrorMessage } from '@/components/ui/utils';
import { CONVERSATION_CONFIG } from '@/lib/config/prompts';
import {
  generateAffirmation,
  sendChatMessage,
} from '@/lib/services/openai/text-chat';
import { useSessionStore } from '@/lib/stores/session-store';
import type { ChatMessage, FapulousSession } from '@/types/session';

// Helper to generate affirmation after max user messages
async function generateAffirmationIfNeeded(
  message: string,
  currentSession: FapulousSession,
  setAffirmation: (affirmation: string) => void
) {
  const newUserMessageCount =
    currentSession.messages.filter((msg) => msg.role === 'user').length + 1;

  console.log('🔍 Checking affirmation generation:', {
    newUserMessageCount,
    maxMessages: CONVERSATION_CONFIG.MAX_USER_MESSAGES,
    hasExistingAffirmation: !!currentSession.affirmation,
  });

  if (
    newUserMessageCount === CONVERSATION_CONFIG.MAX_USER_MESSAGES &&
    !currentSession.affirmation
  ) {
    console.log('✨ Starting affirmation generation...');

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

      console.log('💝 Affirmation generated successfully:', affirmation);
      setAffirmation(affirmation);
    } catch (affirmationError) {
      console.error('❌ Failed to generate affirmation:', affirmationError);
      const fallbackAffirmation =
        "You don't need to earn rest or comfort. You're allowed to start again.";
      console.log('🔄 Using fallback affirmation:', fallbackAffirmation);
      setAffirmation(fallbackAffirmation);
    }
  }
}

export function useChatMessageHandler() {
  const [isTyping, setIsTyping] = useState(false);
  const { currentSession, addMessage, setLoading, setError, setAffirmation } =
    useSessionStore();

  const handleSendMessage = async (message: string) => {
    if (!currentSession) return;

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
      await generateAffirmationIfNeeded(
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

  return {
    isTyping,
    handleSendMessage,
  };
}
