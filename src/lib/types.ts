
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
  | 'jacket'  // Added 'jacket' to fix StyleMoodSelector errors
  | 'top'     // Added 'top' to fix StyleMoodSelector errors
  | 'other';

export type ClothingOccasion = 
  | 'casual'
  | 'formal'
  | 'work'
  | 'sport'
  | 'special'
  | 'travel'
  | 'business'  // Added to fix OutfitFilters errors
  | 'party'     // Added to fix OutfitFilters errors
  | 'date';     // Added to fix OutfitFilters errors

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
  icon?: string;  // Added to fix OliviaRecommendationBox errors
  high?: number;
  low?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
}

// Added TimeOfDay type for calendar components
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Added Activity type for calendar components
export type Activity = 'work' | 'casual' | 'formal' | 'exercise' | 'travel' | 'other';

// Added OutfitLogExtended type for OutfitGroupsSection
export interface OutfitLog {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: TimeOfDay;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
}

export interface OutfitLogExtended extends OutfitLog {
  outfit?: Outfit;
}

// Interface for PersonalizedItem in style carousel
export interface PersonalizedItem extends Omit<ClothingItem, 'season'> {
  season?: ClothingSeason[];
  seasons?: ClothingSeason[];  // For backward compatibility
}

// Interface for TrendingClothingItem 
export interface TrendingClothingItem extends Omit<ClothingItem, 'season'> {
  season?: ClothingSeason[];
  seasons?: ClothingSeason[];  // For backward compatibility
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
  tags?: string[];  // Added for OutfitGroupsSection
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
  tags?: string[];  // Added for OutfitGroupsSection and OutfitPreview
}
