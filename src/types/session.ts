import type { MoodType } from './mood';

export type CommunicationMode = 'text' | 'voice';

export type PornQuestionAnswer = 'yes' | 'no';

export type SessionStatus = 'active' | 'completed' | 'abandoned';

export type MessageRole = 'user' | 'assistant';

export type MessageType = 'text' | 'audio';

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  messageType: MessageType;
  roundNumber: number;
  timestamp: Date;
};

export type FapulousSession = {
  id: string;
  userId: string;
  selectedMoods: MoodType[];
  pornQuestionAnswer?: PornQuestionAnswer;
  communicationMode?: CommunicationMode;
  messages: ChatMessage[];
  currentRound: number;
  status: SessionStatus;
  affirmation?: string;
  createdAt: Date;
  completedAt?: Date;
};
