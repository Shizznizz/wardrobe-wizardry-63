
// src/lib/types.ts

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
  | 'navy'
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

export type ClothingType = 
  | 'shirt'
  | 'sweater'
  | 'hoodie' 
  | 'pants'
  | 'jeans'
  | 'shorts'
  | 'skirt'
  | 'dress'
  | 'shoes'
  | 'sneakers'
  | 'boots'
  | 'accessories'
  | 'other';

export type ClothingOccasion = 
  | 'casual'
  | 'formal'
  | 'work'
  | 'sport'
  | 'special'
  | 'travel';

export type ClothingMaterial =
  | 'cotton'
  | 'wool'
  | 'silk'
  | 'linen'
  | 'polyester'
  | 'denim'
  | 'leather'
  | 'suede'
  | 'synthetic'
  | 'other';

export interface WeatherInfo {
  temperature?: number;
  condition?: string;
  city?: string;
  country?: string;
  iconCode?: string;
  high?: number;
  low?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
}

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
  type: ClothingType;
  color: ClothingColor;
  season: ClothingSeason[];
  image: string;
  imageUrl?: string;
  brand?: string;
  size?: string;
  material?: ClothingMaterial;
  favorite?: boolean;
  lastWorn?: Date;
  purchaseDate?: Date;
  price?: number;
  notes?: string;
  occasions?: string[];
  timesWorn?: number;
  dateAdded?: Date;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  season: ClothingSeason[];
  occasion: string;
  occasions?: string[];
  seasons?: ClothingSeason[];
  favorite?: boolean;
  lastWorn?: Date;
  createdAt?: Date;
  dateAdded?: Date;
  notes?: string;
  timesWorn?: number;
  personalityTags?: PersonalityTag[];
}
