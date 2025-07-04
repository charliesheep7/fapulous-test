import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
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
  GradientBackground,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { ChevronLeft } from '@/components/ui/icons';
import {
  startVoiceSession,
  stopVoiceSession,
  type VoiceSessionCallbacks,
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

function BackButton() {
  const { colorScheme } = useColorScheme();
  
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="flex-row items-center justify-center p-2"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <ChevronLeft color={colorScheme === 'dark' ? '#F5F5F5' : '#000'} />
    </TouchableOpacity>
  );
}

function VoiceHeader({ onEmergencyExit }: { onEmergencyExit: () => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-subtle p-4 dark:border-interactive">
      <View className="flex-row items-center">
        <BackButton />
      </View>
      
      <View className="flex-1">
        <Text className="text-center text-lg font-semibold text-black dark:text-gray-100">
          Micro-Therapy Session
        </Text>
        <Text className="text-center text-sm text-gray-600 dark:text-gray-300">
          Voice Mode
        </Text>
      </View>
      
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onEmergencyExit}
          className="rounded-full bg-red-500 p-2"
        >
          <Text className="text-sm font-bold text-white">✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TranscriptDisplay({ transcript }: { transcript: string }) {
  if (!transcript) return null;

  return (
    <View className="mt-8 w-full rounded-lg bg-gray-850 p-4 dark:bg-gray-700">
      <Text className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
        Last AI Response:
      </Text>
      <Text className="text-base text-black dark:text-gray-100">
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

// Helper functions for VoiceControls
function getStatusText(
  status: VoiceStatus,
  isSessionComplete: boolean
): string {
  if (isSessionComplete) return 'Session complete! Get your affirmation below.';

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
}

async function handleGenerateAffirmation(params: {
  currentSession: any;
  allTranscripts: string[];
  setAffirmation: (affirmation: string) => void;
  onStop: () => void;
}): Promise<void> {
  const { currentSession, allTranscripts, setAffirmation, onStop } = params;

  if (!currentSession) {
    console.error('No current session found for affirmation');
    return;
  }

  console.log('Generating affirmation with transcripts:', allTranscripts);

  try {
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
    onStop();
    router.push('/(app)/(stack)/affirmation');
  } catch (error) {
    console.error('Failed to generate affirmation:', error);
    const fallbackAffirmation =
      "You don't need to earn rest or comfort. You're allowed to start again.";
    console.log('Using fallback affirmation:', fallbackAffirmation);
    setAffirmation(fallbackAffirmation);
    onStop();
    router.push('/(app)/(stack)/affirmation');
  }
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

  const onAffirmationPress = () => {
    handleGenerateAffirmation({
      currentSession,
      allTranscripts,
      setAffirmation,
      onStop,
    });
  };

  return (
    <View className="flex-1">
      {/* Round Indicator */}
      {isSessionActive && <RoundIndicator currentRound={currentRound} />}

      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-8">
          <Text className="text-center text-xl font-medium text-black dark:text-gray-100">
            {getStatusText(status, isSessionComplete)}
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
      {isSessionComplete && <AffirmationButton onPress={onAffirmationPress} />}
    </View>
  );
}

function SessionNotFound() {
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-xl text-black dark:text-gray-100">
            Session not found
          </Text>
          <Button
            label="Go Home"
            onPress={() => router.push('/(app)/(tabs)/')}
            className="mt-4"
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

// Voice session callback handlers
function createVoiceSessionCallbacks(
  setters: {
    setStatus: (status: VoiceStatus) => void;
    setIsRecording: (recording: boolean) => void;
    setTranscript: (transcript: string) => void;
    setCurrentRound: (updateFn: (prev: number) => number) => void;
    setAllTranscripts: (updateFn: (prev: string[]) => string[]) => void;
    setIsSessionComplete: (complete: boolean) => void;
    setIsSessionActive: (active: boolean) => void;
    setError: (error: string) => void;
  },
  isSessionComplete: boolean
): VoiceSessionCallbacks {
  return {
    onSessionStarted: () => setters.setStatus('ready'),
    onSpeechStarted: () => {
      setters.setIsRecording(true);
      setters.setStatus('listening');
    },
    onSpeechStopped: () => {
      setters.setIsRecording(false);
      setters.setStatus('processing');
      console.log(
        'Speech stopped, trusting OpenAI VAD for automatic response...'
      );
    },
    onTranscriptReceived: (newTranscript) => {
      setters.setStatus('ready');
      setters.setTranscript(newTranscript);
    },
    onResponseCompleted: (responseTranscript) => {
      setters.setCurrentRound((prevRound) => {
        const newRound = prevRound + 1;
        console.log(`Round completed: ${prevRound} -> ${newRound}`);

        if (newRound >= 5) {
          console.log('Session completed! Preparing affirmation...');
          setters.setIsSessionComplete(true);
          setters.setStatus('idle');
        } else {
          setters.setStatus('ready');
        }

        return newRound;
      });

      if (responseTranscript && responseTranscript.trim().length > 0) {
        setters.setAllTranscripts((prev) => [...prev, responseTranscript]);
      }
    },
    onSessionEnded: () => {
      if (!isSessionComplete) {
        setters.setStatus('idle');
        setters.setIsSessionActive(false);
        setters.setTranscript('');
        setters.setCurrentRound(() => 0);
        setters.setAllTranscripts(() => []);
        setters.setIsRecording(false);
        setters.setIsSessionComplete(false);
      }
    },
    onError: (errorMessage) => {
      setters.setStatus('error');
      setters.setError(errorMessage);
      setters.setIsSessionActive(false);
      setters.setIsRecording(false);
      setters.setIsSessionComplete(false);
    },
  };
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
    setCurrentRound(() => 0);
    setAllTranscripts(() => []);
    setIsRecording(false);
    setIsSessionComplete(false);

    const callbacks = createVoiceSessionCallbacks(
      {
        setStatus,
        setIsRecording,
        setTranscript,
        setCurrentRound,
        setAllTranscripts,
        setIsSessionComplete,
        setIsSessionActive,
        setError,
      },
      isSessionComplete
    );

    startVoiceSession(callbacks);
  };

  const stopSession = () => {
    stopVoiceSession();
    setStatus('idle');
    setIsSessionActive(false);
    setTranscript('');
    setCurrentRound(() => 0);
    setAllTranscripts(() => []);
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

// Animation setup functions for SimpleWaveform
function setupRecordingAnimations(bars: {
  bar1: any;
  bar2: any;
  bar3: any;
  bar4: any;
}) {
  bars.bar1.value = withRepeat(
    withTiming(1.5, { duration: 300, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  bars.bar2.value = withRepeat(
    withTiming(2, { duration: 200, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  bars.bar3.value = withRepeat(
    withTiming(1.8, { duration: 250, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  bars.bar4.value = withRepeat(
    withTiming(1.3, { duration: 350, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
}

function setupListeningAnimations(bars: {
  bar1: any;
  bar2: any;
  bar3: any;
  bar4: any;
}) {
  bars.bar1.value = withRepeat(
    withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  bars.bar2.value = withRepeat(
    withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  bars.bar3.value = withRepeat(
    withTiming(1.08, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  bars.bar4.value = withRepeat(
    withTiming(1.06, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
}

function stopAnimations(bars: { bar1: any; bar2: any; bar3: any; bar4: any }) {
  bars.bar1.value = withTiming(1, { duration: 200 });
  bars.bar2.value = withTiming(1, { duration: 200 });
  bars.bar3.value = withTiming(1, { duration: 200 });
  bars.bar4.value = withTiming(1, { duration: 200 });
}

// Bar rendering components for SimpleWaveform
function TopBars({ bar1Style, bar2Style, bar3Style }: any) {
  return (
    <View className="absolute -top-20 flex-row space-x-2">
      <Animated.View
        style={[bar1Style]}
        className="bg-primary-400 h-4 w-1 rounded-full"
      />
      <Animated.View
        style={[bar2Style]}
        className="bg-primary-500 h-6 w-1 rounded-full"
      />
      <Animated.View
        style={[bar3Style]}
        className="bg-primary-400 h-5 w-1 rounded-full"
      />
    </View>
  );
}

function BottomBars({ bar1Style, bar2Style, bar4Style }: any) {
  return (
    <View className="absolute -bottom-20 flex-row space-x-2">
      <Animated.View
        style={[bar4Style]}
        className="bg-primary-400 h-4 w-1 rounded-full"
      />
      <Animated.View
        style={[bar1Style]}
        className="bg-primary-500 h-6 w-1 rounded-full"
      />
      <Animated.View
        style={[bar2Style]}
        className="bg-primary-400 h-5 w-1 rounded-full"
      />
    </View>
  );
}

function SideBars({ bar1Style, bar2Style, bar3Style, bar4Style }: any) {
  return (
    <>
      <View className="absolute -left-20 flex-col space-y-2">
        <Animated.View
          style={[bar3Style]}
          className="bg-primary-400 h-1 w-4 rounded-full"
        />
        <Animated.View
          style={[bar4Style]}
          className="bg-primary-500 h-1 w-6 rounded-full"
        />
        <Animated.View
          style={[bar1Style]}
          className="bg-primary-400 h-1 w-5 rounded-full"
        />
      </View>

      <View className="absolute -right-20 flex-col space-y-2">
        <Animated.View
          style={[bar2Style]}
          className="bg-primary-400 h-1 w-4 rounded-full"
        />
        <Animated.View
          style={[bar3Style]}
          className="bg-primary-500 h-1 w-6 rounded-full"
        />
        <Animated.View
          style={[bar4Style]}
          className="bg-primary-400 h-1 w-5 rounded-full"
        />
      </View>
    </>
  );
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

  const bars = { bar1, bar2, bar3, bar4 };

  React.useEffect(() => {
    if (isRecording) {
      setupRecordingAnimations(bars);
    } else if (isListening) {
      setupListeningAnimations(bars);
    } else {
      stopAnimations(bars);
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
      <TopBars
        bar1Style={bar1Style}
        bar2Style={bar2Style}
        bar3Style={bar3Style}
      />
      <BottomBars
        bar1Style={bar1Style}
        bar2Style={bar2Style}
        bar4Style={bar4Style}
      />
      <SideBars
        bar1Style={bar1Style}
        bar2Style={bar2Style}
        bar3Style={bar3Style}
        bar4Style={bar4Style}
      />
    </View>
  );
}

function RoundIndicator({ currentRound }: { currentRound: number }) {
  return (
    <View className="absolute right-4 top-4 rounded-full bg-gray-850 px-2 py-1 dark:bg-gray-700">
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
    <GradientBackground>
      <SafeAreaView className="flex-1">
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
    </GradientBackground>
  );
}
