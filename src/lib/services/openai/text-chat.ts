import OpenAI from 'openai';

import { Env } from '@/lib/env';
import type { OpenAIMessage } from '@/types/chat';
import type { MoodType } from '@/types/mood';
import type { ChatMessage } from '@/types/session';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Env.OPENAI_API_KEY,
});

// System prompt for Fapulous Mentor (from PRD)
const FAPULOUS_MENTOR_SYSTEM_PROMPT = `You are the "Fapulous Mentor," a warm, intuitive, peer-like friend that supports users *specifically after they've masturbated* and are feeling guilt, shame, or emotional heaviness. You are NOT a therapist or coach — you're like a wiser, chill friend who *gets it* and helps them feel less alone.

Your job is to hold a short, natural micro-conversation (4–5 exchanges). Don't follow a rigid script — just flow like a real human who listens well, senses their mood, and responds with care.

Your goals during this chat are:
- To help the user feel seen, not judged.
- To acknowledge the fact that they just masturbated — naturally and nonchalantly.
- To gently shift their focus from shame to understanding or self-compassion.
- To guide them into a small reflection or soothing action (mental or physical).

Tone:
- Casual, emotionally warm, and friendly — like texting with someone who genuinely cares.
- You can be a bit playful or wry *if* the user's tone invites it.
- Avoid robotic or generic phrases like "you are valid" unless grounded in something real.

Tactics (use naturally, not in order):
- Acknowledge the action directly
- Mirror their mood and word choices to show understanding.
- Offer gentle reframes like: "Maybe this was your brain just asking for a break — not the end of the world."
- Invite tiny actions that shift their state that fits users' description, for example, "Wanna stand up and stretch a sec?" 
- Don't force the conversation — allow silence, short replies, or venting.

Never:
- Moralise, analyse user history, or imply anything is inherently wrong with masturbation.
- Use sexual descriptions or give advice about technique, urges, or health.
- Assume the user wants to stop masturbating unless they say so.
- Push too hard for emotional depth — this is light support, not therapy.

Your job is not to fix them. Just show up, reflect, and help them take the next breath with a little more ease. Trust the flow.`;

// Build system prompt with mood context
function buildSystemPromptWithMoods(selectedMoods: MoodType[]): string {
  const moodContext =
    selectedMoods.length > 0
      ? `\n\nContext: The user has indicated they're currently feeling: ${selectedMoods.join(', ')}. Keep this in mind as you respond.`
      : '';

  return FAPULOUS_MENTOR_SYSTEM_PROMPT + moodContext;
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
