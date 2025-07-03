import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

import { corsHeaders } from '../_shared/cors.ts';

const apiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment secrets.');
    }

    const { messages, max_tokens = 500, temperature = 0.9 } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens,
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('OpenAI API error:', response.status, errorBody);
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`
      );
    }

    const completion = await response.json();

    return new Response(JSON.stringify(completion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in text-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}); 