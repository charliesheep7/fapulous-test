import { router } from 'expo-router';
import * as React from 'react';

import {
  FocusAwareStatusBar,
  GradientBackground,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useSessionStore } from '@/lib/stores/session-store';

// Components
function WelcomeMessage() {
  return (
    <View className="mb-12">
      <Text className="mb-4 text-center text-3xl font-bold text-black dark:text-gray-100">
        Ready to begin your therapy session?
      </Text>
      <Text className="text-center text-lg text-gray-600 dark:text-gray-300">
        Let's explore your feelings together in a safe, supportive environment.
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
    <View className="mb-8 w-full max-w-sm">
      <View>
        <Pressable
          onPress={onTextMode}
          className="mb-6 flex-row items-center rounded-full bg-primary-500 p-5 shadow-lg transition-all duration-150 active:scale-95 active:bg-primary-600"
        >
          <Text className="mr-4 text-3xl">💬</Text>
          <Text className="flex-1 text-lg font-medium text-white">
            I'll text you
          </Text>
        </Pressable>

        <Pressable
          onPress={onVoiceMode}
          className="flex-row items-center rounded-full bg-primary-500 p-5 shadow-lg transition-all duration-150 active:scale-95 active:bg-primary-600"
        >
          <Text className="mr-4 text-3xl">🗣️</Text>
          <Text className="flex-1 text-lg font-medium text-white">
            talk about it
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SessionIntroPage() {
  const { currentSession, setCommunicationMode } = useSessionStore();

  const handleTextMode = () => {
    setCommunicationMode('text');
    router.push('/(app)/(stack)/chat');
  };

  const handleVoiceMode = () => {
    setCommunicationMode('voice');
    router.push('/(app)/(stack)/voice-chat');
  };

  if (!currentSession) {
    return (
      <GradientBackground>
        <SafeAreaView className="flex-1">
          <FocusAwareStatusBar />
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-xl text-black dark:text-gray-100">
              Session not found
            </Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center px-6">
          <WelcomeMessage />
          <CommunicationModeSelector
            onTextMode={handleTextMode}
            onVoiceMode={handleVoiceMode}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
