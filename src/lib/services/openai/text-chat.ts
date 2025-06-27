import OpenAI from 'openai';

import {
  FAPULOUS_MENTOR_SYSTEM_PROMPT,
  OPENING_MESSAGE_PROMPT,
} from '@/lib/config/prompts';
import { Env } from '@/lib/env';
import type { OpenAIMessage } from '@/types/chat';
import type { MoodType } from '@/types/mood';
import type { ChatMessage } from '@/types/session';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Env.OPENAI_API_KEY,
});

// Build system prompt with mood context
function buildSystemPromptWithMoods(selectedMoods: MoodType[]): string {
  const moodContext =
    selectedMoods.length > 0
      ? `\n\nContext: The user has indicated they're currently feeling: ${selectedMoods.join(', ')}. Keep this in mind as you respond.`
      : '';

  return FAPULOUS_MENTOR_SYSTEM_PROMPT + moodContext;
}

// Generate opening message based on user's mood
export async function generateOpeningMessage(
  selectedMoods: MoodType[]
): Promise<string> {
  try {
    const moodsList = selectedMoods.join(', ');
    const prompt = OPENING_MESSAGE_PROMPT.replace('{moods}', moodsList);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: FAPULOUS_MENTOR_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.9,
    });

    const openingMessage = response.choices[0]?.message?.content;

    if (!openingMessage) {
      throw new Error('No opening message generated');
    }

    return openingMessage;
  } catch (error) {
    console.error('Opening message generation error:', error);

    // Fallback opening message
    return "Hey, I'm here for you. How are you feeling right now?";
  }
}

// Convert session messages to OpenAI format
function convertMessagesToOpenAI(messages: ChatMessage[]): OpenAIMessage[] {
  return messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

// Main chat function
export async function sendChatMessage(
  userMessage: string,
  sessionMessages: ChatMessage[],
  selectedMoods: MoodType[]
): Promise<string> {
  try {
    // Build messages array with system prompt
    const systemPrompt = buildSystemPromptWithMoods(selectedMoods);
    const conversationHistory = convertMessagesToOpenAI(sessionMessages);

    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.9,
    });

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return aiResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);

    // Handle different error types
    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        throw new Error(
          'AI service is temporarily busy. Please try again in a moment.'
        );
      }
      if (error.message.includes('network')) {
        throw new Error(
          'Network connection issue. Please check your internet.'
        );
      }
    }

    throw new Error('Unable to get AI response. Please try again.');
  }
}

// Generate affirmation based on conversation
export async function generateAffirmation(
  sessionMessages: ChatMessage[],
  selectedMoods: MoodType[]
): Promise<string> {
  try {
    const conversationHistory = convertMessagesToOpenAI(sessionMessages);
    const moodsList = selectedMoods.join(', ');

    const affirmationPrompt = `Based on this supportive conversation with someone who was feeling ${moodsList}, create a personalized, meaningful affirmation for them. 

The affirmation should:
- Be 1-2 sentences maximum
- Feel personal and grounded in the conversation
- Be supportive without being generic
- Help them move forward with self-compassion

Examples of good affirmations:
- "You don't need to earn rest or comfort. You're allowed to start again."
- "That moment's over. Now you decide what the next one looks like."
- "It's not the end. It's a data point. You're still in this."

Conversation context:
${conversationHistory
  .slice(-6)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join('\n')}

Create one meaningful affirmation:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: affirmationPrompt }],
      max_tokens: 100,
      temperature: 0.8,
    });

    const affirmation = response.choices[0]?.message?.content?.trim();

    if (!affirmation) {
      throw new Error('Unable to generate affirmation');
    }

    // Remove quotes if the AI added them
    return affirmation.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Affirmation generation error:', error);

    // Fallback affirmations based on mood
    const fallbackAffirmations = [
      "You don't need to earn rest or comfort. You're allowed to start again.",
      "That moment's over. Now you decide what the next one looks like.",
      "It's not the end. It's a data point. You're still in this.",
    ];

    return fallbackAffirmations[
      Math.floor(Math.random() * fallbackAffirmations.length)
    ];
  }
}
