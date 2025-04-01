
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
    const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_KEY');
    
    if (!REPLICATE_API_TOKEN) {
      throw new Error('Missing REPLICATE_API_KEY');
    }

    const { prompt, userPhotoUrl } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing virtual try-on with prompt:", prompt);
    
    // Call Replicate API for image generation
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "nvidia/sana-sprint-1.6b:c91d3b9ef9efbb9f135fc7f291436938c3f8d8",
        input: {
          seed: -1,
          width: 1024,
          height: 1024,
          prompt: prompt,
          guidance_scale: 4.5,
          inference_steps: 2,
        },
      }),
    });

    const prediction = await response.json();
    console.log("Prediction created:", prediction.id);

    // Start polling for the result
    let result = null;
    const predictionId = prediction.id;
    
    if (predictionId) {
      // Poll for completion - in a real production environment you'd implement
      // a webhook or client-side polling instead of blocking the edge function
      let attempts = 0;
      const maxAttempts = 20; // Prevent infinite loops

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const statusData = await statusResponse.json();

        if (statusData.status === "succeeded") {
          result = statusData.output;
          break;
        } else if (statusData.status === "failed") {
          throw new Error(`Prediction failed: ${statusData.error}`);
        }

        // Wait 1 second before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!result && attempts >= maxAttempts) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Image generation still in progress, check status endpoint",
            predictionId: predictionId,
            mockImageUrl: userPhotoUrl // Return user photo as fallback
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: result ? "Image generation completed" : "Image generation initiated",
        predictionId: predictionId,
        generatedImageUrl: result ? result[0] : null,
        mockImageUrl: userPhotoUrl // Include user photo for immediate display
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to generate image" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
