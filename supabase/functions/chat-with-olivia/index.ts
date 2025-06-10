
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { messages, userId } = await req.json()

    if (!userId) {
      throw new Error('User ID is required')
    }

    // Check user's message limit
    const { data: chatLimits, error: limitsError } = await supabaseClient
      .from('user_chat_limits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    let currentCount = 0
    let isPremium = false
    const today = new Date().toDateString()

    if (chatLimits) {
      isPremium = chatLimits.is_premium
      const lastMessageDate = new Date(chatLimits.last_message_at).toDateString()
      
      // Reset count if it's a new day
      if (lastMessageDate !== today) {
        currentCount = 0
      } else {
        currentCount = chatLimits.message_count
      }
    }

    // Check if free user has exceeded limit
    if (!isPremium && currentCount >= 5) {
      return new Response(
        JSON.stringify({ 
          error: 'Message limit reached',
          limitReached: true,
          messageCount: currentCount
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429
        }
      )
    }

    // Make OpenAI API call
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`)
    }

    const openAIData = await openAIResponse.json()
    const reply = openAIData.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    // Update or insert message count
    const newCount = currentCount + 1
    
    if (chatLimits) {
      await supabaseClient
        .from('user_chat_limits')
        .update({
          message_count: newCount,
          last_message_at: new Date().toISOString()
        })
        .eq('user_id', userId)
    } else {
      await supabaseClient
        .from('user_chat_limits')
        .insert({
          user_id: userId,
          message_count: newCount,
          last_message_at: new Date().toISOString(),
          is_premium: false
        })
    }

    return new Response(
      JSON.stringify({ 
        reply,
        messageCount: newCount,
        limitReached: !isPremium && newCount >= 5
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in chat-with-olivia function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
