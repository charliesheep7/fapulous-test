import { useCallback, useEffect, useState } from 'react';

import { generateOpeningMessage } from '@/lib/services/openai/text-chat';
import { useSessionStore } from '@/lib/stores/session-store';

export function useOpeningMessage() {
  const [isGeneratingOpening, setIsGeneratingOpening] = useState(false);
  const { currentSession, addMessage, setError } = useSessionStore();

  const generateAndSendOpeningMessage = useCallback(async () => {
    // Only generate if we have a session with no messages and selected moods
    if (
      !currentSession ||
      currentSession.messages.length > 0 ||
      !currentSession.selectedMoods.length ||
      isGeneratingOpening
    ) {
      return;
    }

    try {
      setIsGeneratingOpening(true);
      setError(null);

      const openingMessage = await generateOpeningMessage(
        currentSession.selectedMoods
      );

      addMessage(openingMessage, 'assistant');
    } catch (error) {
      console.error('Failed to generate opening message:', error);
      setError('Failed to start conversation. Please try again.');

      // Fallback opening message
      addMessage(
        "Hey, I'm here for you. How are you feeling right now?",
        'assistant'
      );
    } finally {
      setIsGeneratingOpening(false);
    }
  }, [currentSession, isGeneratingOpening, addMessage, setError]);

  useEffect(() => {
    generateAndSendOpeningMessage();
  }, [generateAndSendOpeningMessage]);

  return {
    isGeneratingOpening,
  };
}
