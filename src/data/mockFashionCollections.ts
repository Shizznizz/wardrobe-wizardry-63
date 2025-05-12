
import { Outfit } from '@/lib/types';
import { sampleOutfits } from '@/lib/wardrobeData';

// Create fashion collections using the sample outfits from wardrobeData.ts
export const mockFashionCollections = [
  {
    id: 'recommended',
    name: 'Recommended for You',
    description: 'Outfits curated based on your style preferences',
    outfits: sampleOutfits,
    premium: false
  },
  {
    id: 'seasonal',
    name: 'Seasonal Styles',
    description: 'Perfect outfits for the current season',
    outfits: sampleOutfits.filter(outfit => 
      outfit.seasons?.includes('summer') || outfit.season?.includes('summer')
    ),
    premium: true
  },
  {
    id: 'formal',
    name: 'Formal Occasions',
    description: 'Elegant outfits for special events',
    outfits: sampleOutfits.filter(outfit => 
      outfit.occasions?.includes('formal') || outfit.occasion === 'formal'
    ),
    premium: true
  }
];
