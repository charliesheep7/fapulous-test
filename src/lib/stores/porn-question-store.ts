import { create } from 'zustand';

export type PornQuestionAnswer = 'yes' | 'no' | null;

type PornQuestionStore = {
  answer: PornQuestionAnswer;
  isAnswered: boolean;

  // Actions
  setAnswer: (answer: 'yes' | 'no') => void;
  clearAnswer: () => void;
};

export const usePornQuestionStore = create<PornQuestionStore>((set) => ({
  answer: null,
  isAnswered: false,

  setAnswer: (answer: 'yes' | 'no') => {
    set({
      answer,
      isAnswered: true,
    });
  },

  clearAnswer: () => {
    set({
      answer: null,
      isAnswered: false,
    });
  },
})); 