import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

import { corsHeaders } from '../_shared/cors.ts';

const apiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // This is needed for the browser to make a CORS preflight request.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment secrets.');
    }

    // Directly call the OpenAI API to create a session, which includes an ephemeral key.
    // This aligns with the official OpenAI documentation for WebRTC clients.
    const response = await fetch(
      'https://api.openai.com/v1/realtime/sessions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          voice: 'alloy', // A default voice
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `OpenAI API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorBody)}`
      );
    }

    const session = await response.json();

    // The client needs the `client_secret` which is the ephemeral key.
    return new Response(JSON.stringify(session), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
