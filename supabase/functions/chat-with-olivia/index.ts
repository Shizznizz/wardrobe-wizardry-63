
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

    // Fetch user data for context
    const [
      { data: userPrefs },
      { data: clothingItems },
      { data: outfits },
      { data: outfitLogs },
      { data: profile }
    ] = await Promise.all([
      supabaseClient.from('user_preferences').select('*').eq('user_id', userId).maybeSingle(),
      supabaseClient.from('clothing_items').select('*').eq('user_id', userId).limit(25),
      supabaseClient.from('outfits').select('*').eq('user_id', userId).limit(10),
      supabaseClient.from('outfit_logs').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(5),
      supabaseClient.from('profiles').select('first_name, pronouns').eq('id', userId).maybeSingle()
    ])

    // Build context for Olivia
    let userContext = `You are Olivia, a stylish, friendly AI wardrobe assistant. Here is what you know about this user:\n\n`
    
    // User basic info
    if (profile?.first_name) {
      userContext += `User's name: ${profile.first_name}\n`
    }
    if (profile?.pronouns && profile.pronouns !== 'not-specified') {
      userContext += `Pronouns: ${profile.pronouns}\n`
    }

    // Location and preferences
    if (userPrefs?.preferred_city && userPrefs?.preferred_country) {
      userContext += `Location: ${userPrefs.preferred_city}, ${userPrefs.preferred_country}\n`
    }
    
    if (userPrefs?.favorite_styles && userPrefs.favorite_styles.length > 0) {
      userContext += `Preferred styles: ${userPrefs.favorite_styles.join(', ')}\n`
    }
    
    if (userPrefs?.favorite_colors && userPrefs.favorite_colors.length > 0) {
      userContext += `Favorite colors: ${userPrefs.favorite_colors.join(', ')}\n`
    }

    if (userPrefs?.body_type && userPrefs.body_type !== 'not-specified') {
      userContext += `Body type: ${userPrefs.body_type}\n`
    }

    if (userPrefs?.personality_tags && userPrefs.personality_tags.length > 0) {
      userContext += `Style personality: ${userPrefs.personality_tags.join(', ')}\n`
    }

    if (userPrefs?.climate_preferences && userPrefs.climate_preferences.length > 0) {
      userContext += `Climate preferences: ${userPrefs.climate_preferences.join(', ')}\n`
    }

    // Wardrobe items
    if (clothingItems && clothingItems.length > 0) {
      userContext += `\nCurrent wardrobe (${clothingItems.length} items):\n`
      clothingItems.forEach(item => {
        const seasons = item.season && item.season.length > 0 ? ` (${item.season.join(', ')})` : ''
        const occasions = item.occasions && item.occasions.length > 0 ? ` - ${item.occasions.join(', ')}` : ''
        const favorite = item.favorite ? ' ⭐' : ''
        userContext += `- ${item.name} (${item.type}, ${item.color})${seasons}${occasions}${favorite}\n`
      })
    }

    // Saved outfits
    if (outfits && outfits.length > 0) {
      userContext += `\nSaved outfits (${outfits.length} total):\n`
      outfits.slice(0, 5).forEach(outfit => {
        const occasions = outfit.occasions && outfit.occasions.length > 0 ? ` - ${outfit.occasions.join(', ')}` : ''
        const favorite = outfit.favorite ? ' ⭐' : ''
        const timesWorn = outfit.times_worn ? ` (worn ${outfit.times_worn} times)` : ''
        userContext += `- "${outfit.name}"${occasions}${favorite}${timesWorn}\n`
      })
    }

    // Recent outfit history
    if (outfitLogs && outfitLogs.length > 0) {
      userContext += `\nRecent outfit history:\n`
      outfitLogs.forEach(log => {
        const date = new Date(log.date).toLocaleDateString()
        const activity = log.activity || log.custom_activity || 'general wear'
        const weather = log.weather_condition && log.temperature ? ` (${log.weather_condition}, ${log.temperature}°C)` : ''
        userContext += `- ${date}: ${activity}${weather}\n`
      })
    }

    // Premium status context
    if (isPremium) {
      userContext += `\nPremium member: You have access to advanced styling features and unlimited chat.\n`
    }

    userContext += `\nUse this knowledge to suggest personalized outfits based on the current weather, planned activities, and the user's style. Speak casually, use emojis occasionally, and ask thoughtful follow-up questions like a personal stylist would. Always reference their actual wardrobe items when making suggestions. If they don't have something you'd recommend, suggest similar items they do own or mention what might be worth adding.`

    // Make OpenAI API call with enhanced context
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: userContext },
          ...messages
        ],
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
