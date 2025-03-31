
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Increment message count in Supabase
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const incrementResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_message_count`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ user_id_param: userId }),
        });

        if (!incrementResponse.ok) {
          console.error('Failed to increment message count:', await incrementResponse.text());
        }
      } catch (error) {
        console.error('Error incrementing message count:', error);
        // Continue with the chat even if tracking fails
      }
    }

    // Get current message count
    let messageCount = 0;
    let isPremium = false;
    
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const userPrefsResponse = await fetch(
          `${supabaseUrl}/rest/v1/user_preferences?user_id=eq.${userId}&select=message_count`, {
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            }
          });
        
        if (userPrefsResponse.ok) {
          const userData = await userPrefsResponse.json();
          if (userData && userData.length > 0) {
            messageCount = userData[0].message_count || 0;
            
            // Check if user is premium (this would be based on your app's logic)
            // For now, we'll just assume they're not premium
            isPremium = false; // This should be replaced with actual premium check
          }
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    }

    // If user exceeded message limit and is not premium, return message limit reached
    if (messageCount > 5 && !isPremium) {
      return new Response(JSON.stringify({
        reply: "You've reached your limit of free messages. Please upgrade to premium to continue chatting with Olivia Bloom.",
        limitReached: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Calling OpenAI API with messages:', JSON.stringify(messages.slice(-2)));

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Olivia Bloom, a friendly and knowledgeable fashion style advisor. You provide personalized fashion advice, outfit recommendations, and style tips. You speak in a warm, engaging tone and address the user directly. You focus on helping users find their personal style, create outfits with their existing wardrobe, and make fashion choices for different occasions, body types, and weather conditions. You keep your answers concise, helpful, and style-focused.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.choices || data.choices.length === 0) {
      console.error('Invalid response structure from OpenAI:', data);
      throw new Error('Invalid response received from OpenAI');
    }
    
    return new Response(JSON.stringify({
      reply: data.choices[0].message.content,
      messageCount,
      limitReached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-olivia function:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'An unexpected error occurred',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
