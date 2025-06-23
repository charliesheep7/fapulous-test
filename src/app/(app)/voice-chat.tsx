import { router } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AffirmationButton } from '@/components/chat';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import {
  startVoiceSession,
  stopVoiceSession,
} from '@/lib/services/openai/realtime-voice';
import { generateAffirmation } from '@/lib/services/openai/text-chat';
import { useSessionStore } from '@/lib/stores/session-store';

type VoiceStatus =
  | 'idle'
  | 'connecting'
  | 'ready'
  | 'listening'
  | 'processing'
  | 'ai-speaking'
  | 'error';

function VoiceHeader({ onEmergencyExit }: { onEmergencyExit: () => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
      <View className="flex-1">
        <Text className="text-center text-lg font-semibold text-text-primary dark:text-white">
          Micro-Therapy Session
        </Text>
        <Text className="text-center text-sm text-text-secondary dark:text-gray-300">
          Voice Mode
        </Text>
      </View>
      <TouchableOpacity
        onPress={onEmergencyExit}
        className="rounded-full bg-red-500 p-2"
      >
        <Text className="text-sm font-bold text-white">✕</Text>
      </TouchableOpacity>
    </View>
  );
}

function TranscriptDisplay({ transcript }: { transcript: string }) {
  if (!transcript) return null;

  return (
    <View className="mt-8 w-full rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <Text className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
        Last AI Response:
      </Text>
      <Text className="text-base text-gray-900 dark:text-gray-100">
        {transcript}
      </Text>
    </View>
  );
}

function VoiceActionButton({
  status,
  isSessionActive,
  isRecording,
  isSessionComplete,
  onStart,
  onStop,
}: {
  status: VoiceStatus;
  isSessionActive: boolean;
  isRecording: boolean;
  isSessionComplete: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  const getButtonText = () => {
    if (status === 'connecting') return 'Connecting...';
    if (isSessionComplete) return '✓ Done';
    return isSessionActive ? '🔴 STOP' : '🎤 START';
  };

  const isListening = isSessionActive && !isRecording && !isSessionComplete;
  const showWaveform = (isRecording || isListening) && !isSessionComplete;

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={isSessionActive ? onStop : onStart}
        disabled={status === 'connecting' || isSessionComplete}
        className={`size-32 items-center justify-center rounded-full ${
          isSessionComplete
            ? 'bg-green-500 dark:bg-green-600'
            : isSessionActive
              ? 'bg-red-500 dark:bg-red-600'
              : 'bg-primary-500 dark:bg-primary-600'
        } ${status === 'connecting' || isSessionComplete ? 'opacity-50' : ''}`}
      >
        <Text className="text-2xl font-bold text-white">{getButtonText()}</Text>
      </TouchableOpacity>

      {showWaveform && (
        <SimpleWaveform isRecording={isRecording} isListening={isListening} />
      )}
    </View>
  );
}

function VoiceControls({
  status,
  error,
  isSessionActive,
  transcript,
  currentRound,
  allTranscripts,
  isRecording,
  onStart,
  onStop,
}: {
  status: VoiceStatus;
  error: string;
  isSessionActive: boolean;
  transcript: string;
  currentRound: number;
  allTranscripts: string[];
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  const { currentSession, setAffirmation } = useSessionStore();
  const isSessionComplete = currentRound >= 5;

  const getStatusText = () => {
    if (isSessionComplete)
      return 'Session complete! Get your affirmation below.';

    switch (status) {
      case 'idle':
        return 'Tap to start speaking';
      case 'connecting':
        return 'Connecting to voice session...';
      case 'ready':
        return "I'm listening...";
      case 'processing':
        return 'I heard you. Thinking...';
      case 'error':
        return 'Connection error';
      default:
        return 'Ready';
    }
  };

  const handleGenerateAffirmation = async () => {
    if (!currentSession) {
      console.error('No current session found for affirmation');
      return;
    }

    console.log('Generating affirmation with transcripts:', allTranscripts);

    try {
      // Create fake chat messages from transcripts for affirmation generation
      const fakeMessages = allTranscripts.map((transcript, index) => ({
        id: `voice-${index}`,
        sessionId: currentSession.id,
        role: 'assistant' as const,
        content: transcript,
        messageType: 'audio' as const,
        roundNumber: index + 1,
        timestamp: new Date(),
      }));

      console.log('Generated fake messages:', fakeMessages);

      const affirmation = await generateAffirmation(
        fakeMessages,
        currentSession.selectedMoods
      );

      console.log('Generated affirmation:', affirmation);
      setAffirmation(affirmation);

      console.log('Navigating to affirmation screen...');
      // Stop voice session before navigating
      onStop();
      router.push('/(app)/affirmation');
    } catch (error) {
      console.error('Failed to generate affirmation:', error);
      // Use fallback
      const fallbackAffirmation =
        "You don't need to earn rest or comfort. You're allowed to start again.";
      console.log('Using fallback affirmation:', fallbackAffirmation);
      setAffirmation(fallbackAffirmation);
      // Stop voice session before navigating
      onStop();
      router.push('/(app)/affirmation');
    }
  };

  return (
    <View className="flex-1">
      {/* Round Indicator */}
      {isSessionActive && <RoundIndicator currentRound={currentRound} />}

      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-8">
          <Text className="text-center text-xl font-medium text-text-primary dark:text-white">
            {getStatusText()}
          </Text>
        </View>

        <VoiceActionButton
          status={status}
          isSessionActive={isSessionActive}
          isRecording={isRecording}
          isSessionComplete={isSessionComplete}
          onStart={onStart}
          onStop={onStop}
        />

        <TranscriptDisplay transcript={transcript} />

        {error && (
          <View className="mt-8 rounded-lg bg-red-100 p-4 dark:bg-red-900/20">
            <Text className="text-center text-red-700 dark:text-red-300">
              {error}
            </Text>
          </View>
        )}
      </View>

      {/* Affirmation Button when session complete */}
      {isSessionComplete && (
        <AffirmationButton onPress={handleGenerateAffirmation} />
      )}
    </View>
  );
}

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

function useVoiceSession() {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [error, setError] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [allTranscripts, setAllTranscripts] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);

  const startSession = () => {
    setStatus('connecting');
    setError('');
    setIsSessionActive(true);
    setTranscript('');
    setCurrentRound(0);
    setAllTranscripts([]);
    setIsRecording(false);
    setIsSessionComplete(false);

    startVoiceSession({
      onSessionStarted: () => setStatus('ready'),
      onSpeechStarted: () => {
        setIsRecording(true);
        setStatus('listening');
      },
      onSpeechStopped: () => {
        setIsRecording(false);
        setStatus('processing');
        console.log(
          'Speech stopped, trusting OpenAI VAD for automatic response...'
        );
        // No manual triggering - let OpenAI's VAD handle everything
      },
      onTranscriptReceived: (newTranscript) => {
        setStatus('ready');
        setTranscript(newTranscript);
      },
      onResponseCompleted: (responseTranscript) => {
        setCurrentRound((prevRound) => {
          const newRound = prevRound + 1;
          console.log(`Round completed: ${prevRound} -> ${newRound}`);

          if (newRound >= 5) {
            console.log('Session completed! Stopping voice input...');
            setIsSessionComplete(true);
            setStatus('idle');
            // Stop the voice session to prevent further audio processing
            setTimeout(() => {
              console.log('Terminating voice session after completion');
              stopVoiceSession();
              setIsSessionActive(false);
            }, 500);
          } else {
            setStatus('ready');
          }

          return newRound;
        });

        // Collect transcripts for affirmation generation
        if (responseTranscript && responseTranscript.trim().length > 0) {
          setAllTranscripts((prev) => [...prev, responseTranscript]);
        }
      },
      onSessionEnded: () => {
        setStatus('idle');
        setIsSessionActive(false);
        setTranscript('');
        setCurrentRound(0);
        setAllTranscripts([]);
        setIsRecording(false);
        setIsSessionComplete(false);
      },
      onError: (errorMessage) => {
        setStatus('error');
        setError(errorMessage);
        setIsSessionActive(false);
        setIsRecording(false);
        setIsSessionComplete(false);
      },
    });
  };

  const stopSession = () => {
    stopVoiceSession();
    setStatus('idle');
    setIsSessionActive(false);
    setTranscript('');
    setCurrentRound(0);
    setAllTranscripts([]);
    setIsRecording(false);
    setIsSessionComplete(false);
  };

  return {
    status,
    error,
    isSessionActive,
    transcript,
    currentRound,
    allTranscripts,
    isRecording,
    isSessionComplete,
    startSession,
    stopSession,
  };
}

function SimpleWaveform({
  isRecording,
  isListening,
}: {
  isRecording: boolean;
  isListening: boolean;
}) {
  const bar1 = useSharedValue(1);
  const bar2 = useSharedValue(1);
  const bar3 = useSharedValue(1);
  const bar4 = useSharedValue(1);

  React.useEffect(() => {
    if (isRecording) {
      // Active bouncing animation when user is speaking
      bar1.value = withRepeat(
        withTiming(1.5, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      bar2.value = withRepeat(
        withTiming(2, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      bar3.value = withRepeat(
        withTiming(1.8, { duration: 250, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      bar4.value = withRepeat(
        withTiming(1.3, { duration: 350, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else if (isListening) {
      // Gentle pulse when listening
      bar1.value = withRepeat(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      bar2.value = withRepeat(
        withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      bar3.value = withRepeat(
        withTiming(1.08, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      bar4.value = withRepeat(
        withTiming(1.06, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      // Stop animations
      bar1.value = withTiming(1, { duration: 200 });
      bar2.value = withTiming(1, { duration: 200 });
      bar3.value = withTiming(1, { duration: 200 });
      bar4.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording, isListening]);

  const bar1Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: bar1.value }],
  }));

  const bar2Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: bar2.value }],
  }));

  const bar3Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: bar3.value }],
  }));

  const bar4Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: bar4.value }],
  }));

  return (
    <View className="absolute inset-0 items-center justify-center">
      {/* Top bars */}
      <View className="absolute -top-20 flex-row space-x-2">
        <Animated.View
          style={[bar1Style]}
          className="h-4 w-1 rounded-full bg-primary-400"
        />
        <Animated.View
          style={[bar2Style]}
          className="h-6 w-1 rounded-full bg-primary-500"
        />
        <Animated.View
          style={[bar3Style]}
          className="h-5 w-1 rounded-full bg-primary-400"
        />
      </View>

      {/* Bottom bars */}
      <View className="absolute -bottom-20 flex-row space-x-2">
        <Animated.View
          style={[bar4Style]}
          className="h-4 w-1 rounded-full bg-primary-400"
        />
        <Animated.View
          style={[bar1Style]}
          className="h-6 w-1 rounded-full bg-primary-500"
        />
        <Animated.View
          style={[bar2Style]}
          className="h-5 w-1 rounded-full bg-primary-400"
        />
      </View>

      {/* Left bars */}
      <View className="absolute -left-20 flex-col space-y-2">
        <Animated.View
          style={[bar3Style]}
          className="h-1 w-4 rounded-full bg-primary-400"
        />
        <Animated.View
          style={[bar4Style]}
          className="h-1 w-6 rounded-full bg-primary-500"
        />
        <Animated.View
          style={[bar1Style]}
          className="h-1 w-5 rounded-full bg-primary-400"
        />
      </View>

      {/* Right bars */}
      <View className="absolute -right-20 flex-col space-y-2">
        <Animated.View
          style={[bar2Style]}
          className="h-1 w-4 rounded-full bg-primary-400"
        />
        <Animated.View
          style={[bar3Style]}
          className="h-1 w-6 rounded-full bg-primary-500"
        />
        <Animated.View
          style={[bar4Style]}
          className="h-1 w-5 rounded-full bg-primary-400"
        />
      </View>
    </View>
  );
}

function RoundIndicator({ currentRound }: { currentRound: number }) {
  return (
    <View className="absolute right-4 top-4 rounded-full bg-gray-200 px-2 py-1 dark:bg-gray-700">
      <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">
        {currentRound}/5
      </Text>
    </View>
  );
}

export default function VoiceChatPage() {
  const { currentSession } = useSessionStore();
  const {
    status,
    error,
    isSessionActive,
    transcript,
    currentRound,
    allTranscripts,
    isRecording,
    startSession,
    stopSession,
  } = useVoiceSession();

  const handleEmergencyExit = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this voice session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            stopSession();
            router.back();
          },
        },
      ]
    );
  };

  if (!currentSession) return <SessionNotFound />;

  return (
    <SafeAreaView className="bg-background flex-1">
      <FocusAwareStatusBar />
      <VoiceHeader onEmergencyExit={handleEmergencyExit} />
      <VoiceControls
        status={status}
        error={error}
        isSessionActive={isSessionActive}
        transcript={transcript}
        currentRound={currentRound}
        allTranscripts={allTranscripts}
        isRecording={isRecording}
        onStart={startSession}
        onStop={stopSession}
      />
    </SafeAreaView>
  );
}
