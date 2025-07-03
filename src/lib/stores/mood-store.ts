import { create } from 'zustand';

import type { MoodType, SelectedMoods } from '@/types/mood';

type MoodStore = {
  selectedMoods: SelectedMoods;
  isSelectionValid: boolean;

  // Actions
  toggleMood: (mood: MoodType) => void;
  clearSelection: () => void;
  setSelectedMoods: (moods: SelectedMoods) => void;
};

export const useMoodStore = create<MoodStore>((set) => ({
  selectedMoods: [],
  isSelectionValid: false,

  toggleMood: (mood: MoodType) => {
    set((state) => {
      const isSelected = state.selectedMoods.includes(mood);
      const newSelectedMoods = isSelected
        ? state.selectedMoods.filter((m) => m !== mood)
        : [...state.selectedMoods, mood];

      return {
        selectedMoods: newSelectedMoods,
        isSelectionValid: newSelectedMoods.length > 0,
      };
    });
  },

  clearSelection: () => {
    set({
      selectedMoods: [],
      isSelectionValid: false,
    });
  },

  setSelectedMoods: (moods: SelectedMoods) => {
    set({
      selectedMoods: moods,
      isSelectionValid: moods.length > 0,
    });
  },
}));
