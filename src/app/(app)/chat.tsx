import { router } from 'expo-router';
import * as React from 'react';

import { ChatInterface, RoundIndicator } from '@/components/chat';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useSessionStore } from '@/lib/stores/session-store';
import type { FapulousSession } from '@/types/session';

function SessionNotFound() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-xl text-text-primary dark:text-white">
          Session not found
        </Text>
        <Button
          label="Go Home"
          onPress={() => router.push('/(app)/')}
          className="mt-4"
        />
      </View>
    </SafeAreaView>
  );
}

function ChatHeader({ session }: { session: FapulousSession }) {
  const userMessageCount = session.messages.filter(
    (msg) => msg.role === 'user'
  ).length;

  return (
    <View className="border-b border-gray-200 p-4 dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-center text-lg font-semibold text-text-primary dark:text-white">
            Micro-Therapy Session
          </Text>
          <Text className="text-center text-sm text-text-secondary dark:text-gray-300">
            Mode: {session.communicationMode || 'Not selected'}
          </Text>
        </View>

        {userMessageCount > 0 && (
          <RoundIndicator currentRound={userMessageCount} />
        )}
      </View>
    </View>
  );
}

export default function ChatPage() {
  const { currentSession } = useSessionStore();

  if (!currentSession) {
    return <SessionNotFound />;
  }

  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />
      <ChatHeader session={currentSession} />
      <ChatInterface />
    </SafeAreaView>
  );
}
