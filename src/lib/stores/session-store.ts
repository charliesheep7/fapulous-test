import { create } from 'zustand';

import type { MoodType } from '@/types/mood';
import type {
  ChatMessage,
  CommunicationMode,
  FapulousSession,
  SessionStatus,
} from '@/types/session';

import { useAuth } from '../auth';

type SessionStore = {
  // State
  currentSession: FapulousSession | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createSession: (selectedMoods: MoodType[]) => string;
  setCurrentSession: (session: FapulousSession | null) => void;
  setCommunicationMode: (mode: CommunicationMode) => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  updateSessionStatus: (status: SessionStatus) => void;
  setAffirmation: (affirmation: string) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed state
  canStartSession: boolean;
  currentRound: number;
  isSessionActive: boolean;
  canGenerateAffirmation: boolean;
};

// Helper function to generate session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to generate message ID
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Core session actions
const createSessionAction = (set: any) => (selectedMoods: MoodType[]) => {
  const { user } = useAuth.getState();

  if (!user) {
    throw new Error('User must be authenticated to create a session');
  }

  const sessionId = generateSessionId();
  const newSession: FapulousSession = {
    id: sessionId,
    userId: user.id,
    selectedMoods,
    messages: [],
    currentRound: 0,
    status: 'active',
    createdAt: new Date(),
  };

  set({
    currentSession: newSession,
    error: null,
  });

  return sessionId;
};

const addMessageAction =
  (set: any, get: any) => (content: string, role: 'user' | 'assistant') => {
    const { currentSession } = get();
    if (!currentSession) return;

    const messageId = generateMessageId();
    const newMessage: ChatMessage = {
      id: messageId,
      sessionId: currentSession.id,
      role,
      content,
      messageType: 'text',
      roundNumber:
        role === 'user'
          ? currentSession.currentRound + 1
          : currentSession.currentRound + 1,
      timestamp: new Date(),
    };

    const updatedMessages = [...currentSession.messages, newMessage];
    const newRound =
      role === 'user'
        ? currentSession.currentRound + 1
        : currentSession.currentRound;

    set({
      currentSession: {
        ...currentSession,
        messages: updatedMessages,
        currentRound: newRound,
      },
    });
  };

const updateSessionStatusAction =
  (set: any, get: any) => (status: SessionStatus) => {
    const { currentSession } = get();
    if (currentSession) {
      const updates: Partial<FapulousSession> = {
        status,
      };

      if (status === 'completed') {
        updates.completedAt = new Date();
      }

      set({
        currentSession: {
          ...currentSession,
          ...updates,
        },
      });
    }
  };

// Helper function to set affirmation with logging
const setAffirmationAction = (set: any, get: any) => (affirmation: string) => {
  const { currentSession } = get();
  console.log('🎯 Setting affirmation:', {
    hasCurrentSession: !!currentSession,
    affirmation,
    sessionId: currentSession?.id,
  });

  if (currentSession) {
    set({
      currentSession: {
        ...currentSession,
        affirmation,
      },
    });
    console.log('✅ Affirmation set successfully');
  } else {
    console.log('❌ No current session to set affirmation on');
  }
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  // Initial state
  currentSession: null,
  isLoading: false,
  error: null,

  // Actions
  createSession: createSessionAction(set),
  setCurrentSession: (session: FapulousSession | null) =>
    set({ currentSession: session }),
  setCommunicationMode: (mode: CommunicationMode) => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: {
          ...currentSession,
          communicationMode: mode,
        },
      });
    }
  },
  addMessage: addMessageAction(set, get),
  updateSessionStatus: updateSessionStatusAction(set, get),
  setAffirmation: setAffirmationAction(set, get),
  clearSession: () => {
    set({
      currentSession: null,
      isLoading: false,
      error: null,
    });
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  // Computed properties
  get canStartSession() {
    const { user } = useAuth.getState();
    return !!user;
  },

  get currentRound() {
    const state = get();
    return state.currentSession?.currentRound ?? 0;
  },

  get isSessionActive() {
    const state = get();
    return state.currentSession?.status === 'active';
  },

  get canGenerateAffirmation() {
    const state = get();
    const session = state.currentSession;
    if (!session || session.status !== 'active') return false;

    // Can generate affirmation if we have at least 4 rounds of conversation
    const userMessages = session.messages.filter((msg) => msg.role === 'user');
    return userMessages.length >= 4;
  },
}));
