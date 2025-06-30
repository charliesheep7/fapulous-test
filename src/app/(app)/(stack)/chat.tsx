import { router } from 'expo-router';
import * as React from 'react';

import { ChatInterface, RoundIndicator } from '@/components/chat';
import {
  Button,
  FocusAwareStatusBar,
  GradientBackground,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useSessionStore } from '@/lib/stores/session-store';
import type { FapulousSession } from '@/types/session';

function SessionNotFound() {
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-xl text-text-primary dark:text-text-primary">
            Session not found
          </Text>
          <Button
            label="Go Home"
            onPress={() => router.push('/(app)/')}
            className="mt-4"
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

function ChatHeader({ session }: { session: FapulousSession }) {
  const userMessageCount = session.messages.filter(
    (msg) => msg.role === 'user'
  ).length;

  return (
    <View className="border-b border-discord-border p-4 dark:border-discord-border">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-center text-lg font-semibold text-text-primary dark:text-text-primary">
            Fappy
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
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />
        <ChatHeader session={currentSession} />
        <ChatInterface />
      </SafeAreaView>
    </GradientBackground>
  );
}
