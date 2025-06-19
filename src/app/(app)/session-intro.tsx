import { router } from 'expo-router';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import {
  FocusAwareStatusBar,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useSessionStore } from '@/lib/stores/session-store';
import type { MoodType } from '@/types/mood';

// Communication mode icons
function TextIcon({
  size = 64,
  color = '#000',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M8 10c0-2.2 1.8-4 4-4h40c2.2 0 4 1.8 4 4v32c0 2.2-1.8 4-4 4H24l-12 10 2.4-10H12c-2.2 0-4-1.8-4-4V10z"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MicIcon({
  size = 64,
  color = '#000',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill={color}>
      <Path d="M32 4c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8s8-3.6 8-8V12c0-4.4-3.6-8-8-8zM44 28c0 6.6-5.4 12-12 12s-12-5.4-12-12h-4c0 8.4 6.4 15.2 14.4 15.9V48h-8c-1.1 0-2 .9-2 2s.9 2 2 2h20c1.1 0 2-.9 2-2s-.9-2-2-2h-8v-4.1C41.6 43.2 48 36.4 48 28h-4z" />
    </Svg>
  );
}

// Components
function WelcomeMessage() {
  return (
    <View className="mb-12">
      <Text className="mb-4 text-center text-3xl font-bold text-text-primary dark:text-white">
        I have this micro-therapy to make you feel a bit better.
      </Text>
      <Text className="text-center text-lg text-text-secondary dark:text-gray-300">
        Choose how you'd like to communicate
      </Text>
    </View>
  );
}

function CommunicationModeSelector({
  onTextMode,
  onVoiceMode,
}: {
  onTextMode: () => void;
  onVoiceMode: () => void;
}) {
  return (
    <View className="mb-12 w-full">
      <View className="flex-row justify-around">
        <Pressable
          onPress={onTextMode}
          className="items-center rounded-2xl bg-primary-50 p-6 dark:bg-primary-900/20"
        >
          <TextIcon size={80} color="#7c3aed" />
          <Text className="mt-3 text-lg font-semibold text-primary-700 dark:text-primary-300">
            Text
          </Text>
        </Pressable>

        <Pressable
          onPress={onVoiceMode}
          className="items-center rounded-2xl bg-gray-100 p-6 dark:bg-gray-800"
        >
          <MicIcon size={80} color="#6b7280" />
          <Text className="mt-3 text-lg font-semibold text-gray-600 dark:text-gray-400">
            Voice
          </Text>
          <Text className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Coming Soon
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function SelectedMoodsDisplay({ moods }: { moods: MoodType[] }) {
  return (
    <View className="w-full">
      <Text className="mb-3 text-center text-base text-text-secondary dark:text-gray-300">
        Your current feelings:
      </Text>
      <View className="flex-row flex-wrap justify-center gap-2">
        {moods.map((mood) => (
          <View
            key={mood}
            className="rounded-full bg-primary-100 px-3 py-1 dark:bg-primary-900/30"
          >
            <Text className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {mood}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function SessionIntroPage() {
  const { currentSession, setCommunicationMode } = useSessionStore();

  const handleTextMode = () => {
    setCommunicationMode('text');
    router.push('/(app)/chat');
  };

  const handleVoiceMode = () => {
    alert('Voice mode coming soon!');
  };

  if (!currentSession) {
    return (
      <SafeAreaView className="bg-background flex-1">
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-xl text-text-primary dark:text-white">
            Session not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />
      <View className="flex-1 items-center justify-center px-6">
        <WelcomeMessage />
        <CommunicationModeSelector
          onTextMode={handleTextMode}
          onVoiceMode={handleVoiceMode}
        />
        <SelectedMoodsDisplay moods={currentSession.selectedMoods} />
      </View>
    </SafeAreaView>
  );
}
