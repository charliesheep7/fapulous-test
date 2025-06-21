/* eslint-disable max-lines */
import { Audio } from 'expo-av';
import InCallManager from 'react-native-incall-manager';
import {
  mediaDevices,
  MediaStream,
  type MediaStreamTrack,
  RTCPeerConnection,
} from 'react-native-webrtc';

import { supabase } from '@/lib/supabase';

const FAPULOUS_MENTOR_PROMPT = `You are the "Fapulous Mentor," a warm, intuitive, peer-like friend that supports users *specifically after they've masturbated* and are feeling guilt, shame, or emotional heaviness. You are NOT a therapist or coach — you're like a wiser, chill friend who *gets it* and helps them feel less alone.

Your job is to hold a short, natural micro-conversation (4–5 exchanges). Don't follow a rigid script — just flow like a real human who listens well, senses their mood, and responds with care.

Your goals during this chat are:
- To help the user feel seen, not judged.
- To acknowledge the fact that they just masturbated — naturally and nonchalantly.
- To gently shift their focus from shame to understanding or self-compassion.
- To guide them into a small reflection or soothing action (mental or physical).

Tone:
- Casual, emotionally warm, and friendly — like texting with someone who genuinely cares.
- You can be a bit playful or wry *if* the user's tone invites it.
- Avoid robotic or generic phrases like "you are valid" unless grounded in something real.

Tactics (use naturally, not in order):
- Acknowledge the action directly
- Mirror their mood and word choices to show understanding.
- Offer gentle reframes like: "Maybe this was your brain just asking for a break — not the end of the world."
- Invite tiny actions that shift their state that fits users' description, for example, "Wanna stand up and stretch a sec?" 
- Don't force the conversation — allow silence, short replies, or venting.

Never:
- Moralise, analyse user history, or imply anything is inherently wrong with masturbation.
- Use sexual descriptions or give advice about technique, urges, or health.
- Assume the user wants to stop masturbating unless they say so.
- Push too hard for emotional depth — this is light support, not therapy.

Your job is not to fix them. Just show up, reflect, and help them take the next breath with a little more ease. Trust the flow.`;

// Service state
let peerConnection: RTCPeerConnection | null = null;
let dataChannel: ReturnType<RTCPeerConnection['createDataChannel']> | null =
  null;
let localMediaStream: MediaStream | null = null;
let remoteMediaStream: MediaStream | null = null;
let sessionCallbacks: VoiceSessionCallbacks | null = null;

export type VoiceSessionCallbacks = {
  onSessionStarted: () => void;
  onTranscriptReceived: (transcript: string) => void;
  onSessionEnded: () => void;
  onError: (error: string) => void;
};

function cleanup() {
  // Stop all media tracks
  localMediaStream?.getTracks().forEach((track) => track.stop());
  remoteMediaStream?.getTracks().forEach((track) => track.stop());

  // Close peer connection and data channel
  if (dataChannel) {
    dataChannel.close();
    dataChannel = null;
  }
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // Stop InCallManager
  InCallManager.stop();

  // Reset state variables
  localMediaStream = null;
  remoteMediaStream = null;

  sessionCallbacks?.onSessionEnded();
  sessionCallbacks = null;
}

function setupDataChannel(dc: NonNullable<typeof dataChannel>) {
  dc.addEventListener('open', () => {
    const event = {
      type: 'session.update',
      session: {
        modalities: ['audio'],
        instructions: FAPULOUS_MENTOR_PROMPT,
      },
    };
    dc.send(JSON.stringify(event));
    sessionCallbacks?.onSessionStarted();
  });

  dc.addEventListener('message', async (e: any) => {
    const data = JSON.parse(e.data);
    if (data.type === 'response.audio_transcript.done') {
      sessionCallbacks?.onTranscriptReceived(data.transcript);
    }
  });

  dc.addEventListener('close', () => {
    cleanup();
  });
}

async function connectToOpenAI(pc: RTCPeerConnection, ephemeralKey: string) {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const model = 'gpt-4o-realtime-preview-2024-12-17';
  const sdpResponse = await fetch(
    `https://api.openai.com/v1/realtime?model=${model}`,
    {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        'Content-Type': 'application/sdp',
      },
    }
  );

  if (!sdpResponse.ok) {
    throw new Error(`Failed to get SDP answer: ${await sdpResponse.text()}`);
  }

  const answer = {
    type: 'answer' as const,
    sdp: await sdpResponse.text(),
  };
  await pc.setRemoteDescription(answer);
}

export async function startVoiceSession(callbacks: VoiceSessionCallbacks) {
  if (peerConnection) {
    cleanup();
  }
  sessionCallbacks = callbacks;

  try {
    const { data, error } = await supabase.functions.invoke('get-openai-token');
    if (error || !data?.client_secret) {
      throw new Error(`Failed to get token: ${error?.message ?? 'No secret'}`);
    }
    const ephemeralKey = data.client_secret;

    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    InCallManager.start({ media: 'audio' });
    InCallManager.setForceSpeakerphoneOn(true);

    peerConnection = new RTCPeerConnection();
    remoteMediaStream = new MediaStream();

    peerConnection.addEventListener('track', (event) => {
      remoteMediaStream?.addTrack(event.track);
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      if (
        peerConnection?.connectionState === 'failed' ||
        peerConnection?.connectionState === 'disconnected' ||
        peerConnection?.connectionState === 'closed'
      ) {
        cleanup();
      }
    });

    localMediaStream = await mediaDevices.getUserMedia({ audio: true });
    localMediaStream
      .getTracks()
      .forEach((track: MediaStreamTrack) =>
        peerConnection?.addTrack(track, localMediaStream!)
      );

    dataChannel = peerConnection.createDataChannel('oai-events');
    setupDataChannel(dataChannel);

    await connectToOpenAI(peerConnection, ephemeralKey);
  } catch (error) {
    cleanup();
    sessionCallbacks?.onError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

export function stopVoiceSession() {
  cleanup();
}
