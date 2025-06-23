import { useState } from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/ui';
import {
  startVoiceSession,
  stopVoiceSession,
  triggerAIResponse,
} from '@/lib/services/openai/realtime-voice';

export default function VoiceTestScreen() {
  const [status, setStatus] = useState('Idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const handleStartSession = () => {
    setStatus('Connecting...');
    setError('');
    setTranscript('');
    startVoiceSession({
      onSessionStarted: () => setStatus('Session Started! Speak now.'),
      onTranscriptReceived: (newTranscript) => {
        setStatus('Session Started! Speak now.');
        setTranscript(newTranscript);
      },
      onSpeechStarted: () => {
        console.log('User started speaking');
      },
      onSpeechStopped: () => {
        setStatus('I heard you. Thinking...');
        triggerAIResponse();
      },
      onResponseCompleted: (responseTranscript) => {
        console.log('AI response completed:', responseTranscript);
      },
      onSessionEnded: () => setStatus('Session Ended.'),
      onError: (e) => {
        setStatus('Error');
        setError(e);
      },
    });
  };

  const handleStopSession = () => {
    stopVoiceSession();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
      <View>
        <Text className="text-2xl font-bold">Voice Service Test</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Button title="Start Session" onPress={handleStartSession} />
        <Button title="Stop Session" onPress={handleStopSession} />
      </View>

      <View style={{ gap: 4 }}>
        <Text className="font-bold">Status:</Text>
        <Text>{status}</Text>
      </View>

      <View style={{ gap: 4 }}>
        <Text className="font-bold">Last Transcript:</Text>
        <Text>{transcript || '...'}</Text>
      </View>

      {error && (
        <View style={{ gap: 4 }}>
          <Text className="font-bold text-red-500">Error:</Text>
          <Text className="text-red-500">{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
