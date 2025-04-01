
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Replicate API error (${response.status}):`, errorText);
        throw new Error(`Replicate API returned ${response.status}: ${errorText}`);
      }

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
    if (!userPhotoUrl) {
      return new Response(
        JSON.stringify({ error: 'userPhotoUrl is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing virtual try-on with prompt:", prompt || "No prompt provided");
    console.log("User photo URL provided:", !!userPhotoUrl);
    console.log("Clothing photo URL provided:", !!clothingPhotoUrl);
    
    // Enhanced prompt with more clothing details if we have a clothing image
    let enhancedPrompt = "A photorealistic image of a person wearing";
    if (clothingPhotoUrl) {
      // More detailed prompt when we have a clothing photo
      enhancedPrompt = "A photorealistic image of a person wearing the exact clothing shown in the reference image. The clothing should appear natural and perfectly fitted on the person. Maintain the person's exact pose, facial expression, and background from the reference image.";
    } else if (prompt) {
      enhancedPrompt = prompt;
    }
    
    console.log("Using enhanced prompt:", enhancedPrompt);
    
    // Set default options
    const replicateOptions = {
      version: "e6ad62b40599a35ded4a6c4a54c64be2'36ca6c82fbcd6e8586f52662e442c136f5e1c36cf6850616e3f5123f36348cef",
      input: {
        prompt: enhancedPrompt,
        negative_prompt: "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, mutated hands and fingers, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation",
        guidance_scale: 7.5,
        num_inference_steps: 30,
        width: 768,
        height: 768
      }
    };

    // Add the image references based on what's available
    if (userPhotoUrl && clothingPhotoUrl) {
      // Use SANA for virtual try-on when we have both images
      replicateOptions.version = "nvidia/sana-sprint-1.6b:c91d3b9ef9efbb9f135fc7f291436938c3f8d8";
      replicateOptions.input = {
        ...replicateOptions.input,
        seed: -1,
        reference_image: userPhotoUrl,
        target_image: clothingPhotoUrl
      };
      console.log("Using SANA model with both user and clothing references");
    } else if (userPhotoUrl) {
      // Only user photo available, use as reference
      replicateOptions.version = "nvidia/sana-sprint-1.6b:c91d3b9ef9efbb9f135fc7f291436938c3f8d8";
      replicateOptions.input = {
        ...replicateOptions.input,
        seed: -1,
        reference_image: userPhotoUrl
      };
      console.log("Using SANA model with only user photo reference");
    }

    console.log("Calling Replicate API with options:", JSON.stringify(replicateOptions));

    // Call Replicate API for image generation
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(replicateOptions),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Replicate API error (${response.status}):`, errorText);
      throw new Error(`Replicate API returned ${response.status}: ${errorText}`);
    }

    const prediction = await response.json();
    console.log("Prediction created:", prediction.id);

    // Check if there are any errors in the prediction response
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
    const maxAttempts = 3; // Quick check with a few attempts

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${newPredictionId}`, {
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error(`Status check error (${statusResponse.status}):`, errorText);
        break;
      }

      const statusData = await statusResponse.json();
      console.log("Status check attempt", attempts + 1, ":", statusData.status);

      if (statusData.status === "succeeded") {
        result = statusData.output;
        console.log("Generation succeeded immediately:", result);
        break;
      } else if (statusData.status === "failed") {
        throw new Error(`Prediction failed: ${statusData.error}`);
      }

      // Wait 1 second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!result && attempts >= maxAttempts) {
      // Return the prediction ID for client-side polling
      console.log("Generation still in progress, returning prediction ID for polling:", newPredictionId);
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

    // If we got an immediate result
    console.log("Returning final result:", result ? "Image generated successfully" : "No result");
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
