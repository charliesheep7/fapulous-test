import { router } from 'expo-router';
import * as React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  GradientBackground,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { usePornQuestionStore } from '@/lib/stores/porn-question-store';
import { useSessionStore } from '@/lib/stores/session-store';

// Answer option type
type AnswerOption = {
  id: 'yes' | 'no';
  label: string;
  emoji: string;
};

const ANSWER_OPTIONS: AnswerOption[] = [
  {
    id: 'yes',
    label: 'Yes',
    emoji: '😔',
  },
  {
    id: 'no',
    label: 'No',
    emoji: '😌',
  },
];

// Answer Option Component
function AnswerOption({ 
  option, 
  isSelected, 
  onSelect 
}: { 
  option: AnswerOption;
  isSelected: boolean;
  onSelect: (id: 'yes' | 'no') => void;
}) {
  const handlePress = () => {
    onSelect(option.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`
        flex-row items-center rounded-xl border-2 p-4 transition-all mb-3
        ${
          isSelected
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
        }
      `}
    >
      <View className="mr-4">
        <Text className="text-3xl">{option.emoji}</Text>
      </View>

      <View className="flex-1">
        <Text
          className={`
            text-lg font-semibold
            ${
              isSelected
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-800 dark:text-gray-200'
            }
          `}
        >
          {option.label}
        </Text>
      </View>
    </Pressable>
  );
}

// Answer Selector Component
function AnswerSelector() {
  const { answer, setAnswer } = usePornQuestionStore();

  const handleAnswerSelect = (answerId: 'yes' | 'no') => {
    setAnswer(answerId);
  };

  return (
    <View className="gap-3 pb-6">
      {ANSWER_OPTIONS.map((option) => {
        const isSelected = answer === option.id;

        return (
          <AnswerOption
            key={option.id}
            option={option}
            isSelected={isSelected}
            onSelect={handleAnswerSelect}
          />
        );
      })}
    </View>
  );
}

export default function PornQuestionPage() {
  const { isAnswered, answer } = usePornQuestionStore();
  const { setPornQuestionAnswer } = useSessionStore();

  const handleContinue = () => {
    if (!isAnswered || !answer) return;

    // Save answer to session store
    setPornQuestionAnswer(answer);

    // Navigate to session intro screen
    router.push('/(app)/(stack)/session-intro');
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />

        {/* Header */}
        <View className="px-6 pb-6 pt-12">
          <View className="mb-6">
            <Text className="mb-1 text-center text-2xl font-bold text-black dark:text-gray-100">
              Did you watch porn? Be honest
            </Text>
          </View>
        </View>

        {/* Answer Selection */}
        <View className="flex-1 px-6">
          <AnswerSelector />
        </View>

        {/* Bottom Actions */}
        <View className="p-6">
          <Button
            label="Continue"
            onPress={handleContinue}
            disabled={!isAnswered}
            size="lg"
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
} 