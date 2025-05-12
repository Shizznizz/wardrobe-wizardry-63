
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const seasons = {
  'winter': [11, 0, 1], // Dec, Jan, Feb
  'spring': [2, 3, 4],  // Mar, Apr, May
  'summer': [5, 6, 7],  // Jun, Jul, Aug
  'autumn': [8, 9, 10]  // Sep, Oct, Nov
}

// Outfit themes per season with matching descriptions and tags
const outfitThemes = {
  'winter': [
    {
      name: 'Winter Chic',
      description: 'Sophisticated warmth for holiday gatherings',
      items: [
        {image: '/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png', name: 'Cashmere Cardigan'},
        {image: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png', name: 'Plaid Skirt'},
        {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Knee-high Boots'},
        {image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png', name: 'Statement Earrings'}
      ],
      tags: ['winter', 'formal', 'evening'],
    },
    {
      name: 'Cozy Cabin',
      description: 'Warm layers for fireside relaxation',
      items: [
        {image: '/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png', name: 'Cable Knit Sweater'},
        {image: '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png', name: 'Fleece-lined Leggings'},
        {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Shearling Boots'},
        {image: '/lovable-uploads/f29b0fb8-330c-409a-8488-2e7ae2b351ed.png', name: 'Chunky Scarf'}
      ],
      tags: ['winter', 'casual', 'weekend'],
    },
    {
      name: 'Snow Queen',
      description: 'Statement pieces for winter wonderland events',
      items: [
        {image: '/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png', name: 'White Faux Fur Coat'},
        {image: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png', name: 'Silver Sequin Dress'},
        {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Crystal Heels'},
        {image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png', name: 'Diamond Earrings'}
      ],
      tags: ['winter', 'party', 'statement'],
    },
    {
      name: 'Winter Office',
      description: 'Professional looks that beat the chill',
      items: [
        {image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png', name: 'Wool Blazer'},
        {image: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png', name: 'Cashmere Turtleneck'},
        {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Tailored Trousers'},
        {image: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png', name: 'Leather Tote'}
      ],
      tags: ['winter', 'work', 'professional'],
    }
  ],
  'spring': [
    {
      name: 'Spring Elegance',
      description: 'Perfect for garden parties and afternoon tea',
      items: [
        {image: '/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png', name: 'Floral Blouse'},
        {image: '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png', name: 'White Midi Skirt'},
        {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Strappy Sandals'},
        {image: '/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png', name: 'Straw Hat'}
      ],
      tags: ['spring', 'dressy', 'outdoor'],
    },
    {
      name: 'Pastel Paradise',
      description: 'Soft hues for those first warm days',
      items: [
        {image: '/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png', name: 'Lavender Cardigan'},
        {image: '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png', name: 'Mint Culotte Pants'},
        {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'White Canvas Sneakers'},
        {image: '/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png', name: 'Pink Crossbody Bag'}
      ],
      tags: ['spring', 'casual', 'colorful'],
    },
    {
      name: 'Rain Ready',
      description: 'Stylish options for unpredictable spring showers',
      items: [
        {image: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png', name: 'Trench Coat'},
        {image: '/lovable-uploads/05c430e3-091c-4f96-a77b-c360610435d3.png', name: 'Straight-leg Jeans'},
        {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Chelsea Rain Boots'},
        {image: '/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png', name: 'Waterproof Tote'}
      ],
      tags: ['spring', 'practical', 'rainy'],
    },
    {
      name: 'Spring Office',
      description: 'Light layers for the workplace transition',
      items: [
        {image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png', name: 'Lightweight Blazer'},
        {image: '/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png', name: 'Silk Button-up'},
        {image: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png', name: 'Cropped Pants'},
        {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Pointed Flats'}
      ],
      tags: ['spring', 'work', 'professional'],
    }
  ],
  'summer': [
    {
      name: 'Summer Vibes',
      description: 'Light and fresh for warm beach days',
      items: [
        {image: '/lovable-uploads/e8fc1e11-c29c-400b-8e33-2577a311b453.png', name: 'Blue Tank Top'},
        {image: '/lovable-uploads/5c9492c5-2df1-4f02-8d61-70fd1e57a6af.png', name: 'Denim Shorts'},
        {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'White Sneakers'},
        {image: '/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png', name: 'Tote Bag'}
      ],
      tags: ['summer', 'beach', 'casual'],
    },
    {
      name: 'Tropical Sunset',
      description: 'Vibrant prints for vacation moments',
      items: [
        {image: '/lovable-uploads/44448809-be5b-44da-a910-3f9b0e36264b.png', name: 'Printed Sundress'},
        {image: '/lovable-uploads/5c9492c5-2df1-4f02-8d61-70fd1e57a6af.png', name: 'Straw Sun Hat'},
        {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Espadrille Sandals'},
        {image: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png', name: 'Shell Necklace'}
      ],
      tags: ['summer', 'vacation', 'colorful'],
    },
    {
      name: 'Summer Nights',
      description: 'Breezy elegance for evening soirées',
      items: [
        {image: '/lovable-uploads/44448809-be5b-44da-a910-3f9b0e36264b.png', name: 'Satin Cami'},
        {image: '/lovable-uploads/d39047b3-c0ad-4b2c-9d73-c654479f56c4.png', name: 'Flowy Maxi Skirt'},
        {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Strappy Heels'},
        {image: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png', name: 'Gold Bangles'}
      ],
      tags: ['summer', 'evening', 'elegant'],
    },
    {
      name: 'Summer Office',
      description: 'Stay cool while staying professional',
      items: [
        {image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png', name: 'Linen Blazer'},
        {image: '/lovable-uploads/e8fc1e11-c29c-400b-8e33-2577a311b453.png', name: 'Sleeveless Blouse'},
        {image: '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png', name: 'Culotte Pants'},
        {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Block Heel Pumps'}
      ],
      tags: ['summer', 'work', 'professional'],
    }
  ],
  'autumn': [
    {
      name: 'Fall Classic',
      description: 'Cozy layers for crisp autumn air',
      items: [
        {image: '/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png', name: 'Knit Sweater'},
        {image: '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png', name: 'Skinny Jeans'},
        {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Ankle Boots'},
        {image: '/lovable-uploads/f29b0fb8-330c-409a-8488-2e7ae2b351ed.png', name: 'Wool Scarf'}
      ],
      tags: ['autumn', 'casual', 'everyday'],
    },
    {
      name: 'Harvest Hues',
      description: 'Warm tones that capture the changing leaves',
      items: [
        {image: '/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png', name: 'Rust Turtleneck'},
        {image: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png', name: 'Corduroy Skirt'},
        {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Leather Boots'},
        {image: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png', name: 'Suede Crossbody'}
      ],
      tags: ['autumn', 'trendy', 'colorful'],
    },
    {
      name: 'Weekend Getaway',
      description: 'Versatile pieces for autumn adventures',
      items: [
        {image: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png', name: 'Utility Jacket'},
        {image: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png', name: 'Flannel Shirt'},
        {image: '/lovable-uploads/9d6d8627-f9d3-4af3-a5ec-7b2498799ab2.png', name: 'Boyfriend Jeans'},
        {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Hiking Sneakers'}
      ],
      tags: ['autumn', 'weekend', 'outdoor'],
    },
    {
      name: 'Autumn Office',
      description: 'Sophisticated layers for workplace comfort',
      items: [
        {image: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png', name: 'Oversized Blazer'},
        {image: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png', name: 'Fine-knit Sweater'},
        {image: '/lovable-uploads/05c430e3-091c-4f96-a77b-c360610435d3.png', name: 'Tailored Pants'},
        {image: '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png', name: 'Loafers'}
      ],
      tags: ['autumn', 'work', 'professional'],
    }
  ]
}

function getCurrentSeason(): string {
  const now = new Date()
  const month = now.getMonth() // 0-11
  
  for (const [season, months] of Object.entries(seasons)) {
    if (months.includes(month)) {
      return season
    }
  }
  
  return 'autumn' // Default fallback
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get current season based on date
    const currentSeason = getCurrentSeason()
    console.log(`Current season detected: ${currentSeason}`)
    
    // Get the outfit themes for the current season
    const seasonalOutfits = outfitThemes[currentSeason as keyof typeof outfitThemes]
    
    // If we have user trends/preferences in the request, we could use them here
    // For now, we'll just return the seasonal outfits
    
    // Convert to Outfit objects for the frontend
    const outfits = seasonalOutfits.map((theme, idx) => {
      return {
        id: `${currentSeason}-${idx}`,
        name: theme.name,
        description: theme.description, 
        items: theme.items.map(item => item.image),
        itemDetails: theme.items,
        seasons: [currentSeason],
        occasions: theme.tags.filter(tag => tag !== currentSeason),
        favorite: false,
        dateAdded: new Date().toISOString()
      }
    })
    
    // Store in database for caching (not implemented here)
    // You would use the Supabase client to upsert these to a seasonal_outfits table
    
    return new Response(
      JSON.stringify({ 
        outfits,
        season: currentSeason,
        generatedAt: new Date().toISOString(),
        refreshAfter: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error generating seasonal outfits:', error)
    
    // Return friendly error
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate seasonal outfits',
        details: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    )
  }
})
