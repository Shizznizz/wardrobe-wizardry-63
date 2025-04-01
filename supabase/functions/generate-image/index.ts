
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

    const { prompt, userPhotoUrl, clothingPhotoUrl, predictionId } = await req.json();
    
    // If we're checking status for an existing prediction
    if (predictionId) {
      console.log("Checking status for prediction:", predictionId);
      
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const prediction = await response.json();
      console.log("Status check response:", prediction);
      
      if (prediction.status === "succeeded" && prediction.output) {
        return new Response(
          JSON.stringify({ 
            success: true,
            generatedImageUrl: prediction.output[0] 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (prediction.status === "failed") {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: prediction.error || "Image generation failed" 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Still processing" 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // This is a new generation request
    if (!prompt || !userPhotoUrl) {
      return new Response(
        JSON.stringify({ error: 'Prompt and userPhotoUrl are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing virtual try-on with prompt:", prompt);
    console.log("User photo URL provided:", !!userPhotoUrl);
    console.log("Clothing photo URL provided:", !!clothingPhotoUrl);
    
    // Enhanced prompt with more clothing details if we have a clothing image
    let enhancedPrompt;
    if (clothingPhotoUrl) {
      enhancedPrompt = "A photorealistic image of a person wearing the exact clothing shown in the reference image. The clothing should appear natural and perfectly fitted on the person. Maintain the person's exact pose, facial expression, and background from the reference image.";
    } else {
      enhancedPrompt = prompt;
    }
    
    console.log("Using enhanced prompt:", enhancedPrompt);
    
    // Modify the Replicate API call based on whether we have a clothing photo
    let replicateOptions;
    if (clothingPhotoUrl) {
      // If we have a clothing photo, use it as an additional input
      replicateOptions = {
        version: "nvidia/sana-sprint-1.6b:c91d3b9ef9efbb9f135fc7f291436938c3f8d8",
        input: {
          seed: -1,
          width: 1024,
          height: 1024,
          prompt: enhancedPrompt,
          guidance_scale: 4.5,
          inference_steps: 25, // Increased for better quality
          reference_image: userPhotoUrl,
          target_image: clothingPhotoUrl, // Adding the clothing image as target
        },
      };
    } else {
      // Original call without clothing photo
      replicateOptions = {
        version: "nvidia/sana-sprint-1.6b:c91d3b9ef9efbb9f135fc7f291436938c3f8d8",
        input: {
          seed: -1,
          width: 1024,
          height: 1024,
          prompt: enhancedPrompt,
          guidance_scale: 4.5,
          inference_steps: 25,
          reference_image: userPhotoUrl,
        },
      };
    }

    // Call Replicate API for image generation
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(replicateOptions),
    });

    const prediction = await response.json();
    console.log("Prediction created:", prediction.id);

    // See if there are any errors in the prediction response
    if (prediction.error) {
      console.error("Prediction error:", prediction.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: prediction.error 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if we have a valid prediction ID
    if (!prediction.id) {
      throw new Error('Failed to get a prediction ID from Replicate');
    }

    // Poll for completion - in a real production environment you'd implement
    // a webhook or client-side polling instead of blocking the edge function
    let result = null;
    const newPredictionId = prediction.id;
    
    // Try to get an immediate result with a few quick polls
    let attempts = 0;
    const maxAttempts = 5; // Quick check with a few attempts

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${newPredictionId}`, {
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
          predictionId: newPredictionId,
          mockImageUrl: userPhotoUrl // Return user photo as fallback
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: result ? "Image generation completed" : "Image generation initiated",
        predictionId: newPredictionId,
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
