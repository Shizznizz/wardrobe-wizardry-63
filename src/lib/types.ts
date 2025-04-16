
// src/lib/types.ts
// This is a simplified version for demonstration purposes

export type ClothingColor =
  | 'black'
  | 'white'
  | 'gray'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'brown'
  | 'multicolor';

export type ClothingSeason = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

export type PersonalityTag =
  | 'minimalist'
  | 'bold'
  | 'trendy'
  | 'classic'
  | 'casual'
  | 'formal'
  | 'sporty'
  | 'elegant'
  | 'vintage'
  | 'bohemian'
  | 'preppy'
  | 'artistic';

export interface UserPreferences {
  favoriteColors: ClothingColor[];
  favoriteStyles: string[];
  personalityTags?: PersonalityTag[];
  seasonalPreferences: {
    [key in ClothingSeason]: {
      enabled: boolean;
      temperatureRange: [number, number];
      timeOfYear?: [number, number]; // Optional: 1-3 representing early, mid, late in season
      goToLook?: string; // Optional: reference to a favorite outfit for this season
    };
  };
  outfitReminders: boolean;
  reminderTime: string;
  occasionPreferences?: string[];
  climatePreferences?: string[];
  weatherLocation?: {
    city: string;
    country: string;
    useCurrentLocation?: boolean;
  };
}

export interface ClothingItem {
  id: string;
  name: string;
  type: string;
  color: ClothingColor;
  season: ClothingSeason[];
  image: string;
  brand?: string;
  size?: string;
  material?: string;
  favorite?: boolean;
  lastWorn?: Date;
  purchaseDate?: Date;
  price?: number;
  notes?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  season: ClothingSeason[];
  occasion: string;
  favorite?: boolean;
  lastWorn?: Date;
  createdAt: Date;
  notes?: string;
}
