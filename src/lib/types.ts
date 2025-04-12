
export type ClothingType = 
  | 'shirt'
  | 'jeans'
  | 'pants'
  | 'shorts'
  | 'sweater'
  | 'hoodie'
  | 'jacket'
  | 'dress'
  | 'skirt'
  | 'shoes'
  | 'sneakers'
  | 'boots'
  | 'accessories'
  | 'other'
  | 'blouse'
  | 'top';

export type ClothingSeason = 
  | 'spring' 
  | 'summer' 
  | 'autumn' 
  | 'winter' 
  | 'all';

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

export type ClothingMaterial = 
  | 'cotton' 
  | 'wool' 
  | 'silk' 
  | 'polyester' 
  | 'leather' 
  | 'denim' 
  | 'linen' 
  | 'other';

export type ClothingOccasion = 
  | 'casual'
  | 'formal'
  | 'business'
  | 'party'
  | 'sporty'
  | 'outdoor'
  | 'everyday'
  | 'special'
  | 'vacation'
  | 'date'
  | 'interview'
  | 'presentation'
  | 'dinner'
  | 'other';

export type TimeOfDay =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night';

export type Activity =
  | 'work'
  | 'casual'
  | 'sport'
  | 'party'
  | 'date'
  | 'formal'
  | 'interview'
  | 'presentation'
  | 'dinner'
  | 'other';

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

export type ClimateType =
  | 'tropical'
  | 'desert'
  | 'temperate'
  | 'continental'
  | 'polar'
  | 'coastal';

export interface ClothingItem {
  id: string;
  name: string;
  type: ClothingType;
  color: ClothingColor;
  material: ClothingMaterial;
  seasons: ClothingSeason[];
  occasions: ClothingOccasion[]; 
  imageUrl: string;
  favorite: boolean;
  timesWorn: number;
  lastWorn?: Date;
  dateAdded: Date;
  brand?: string;
  description?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[]; // Array of clothing item IDs
  occasions: string[];
  seasons: ClothingSeason[];
  favorite: boolean;
  timesWorn: number;
  lastWorn?: Date;
  dateAdded: Date;
  personalityTags?: PersonalityTag[]; // New field for personality tags
  colorScheme?: string; // Description of the color scheme
  tags?: string[]; // Added tags field for filtering
  colors?: string[]; // Added colors field for filtering
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  city?: string;
  country?: string;
  windSpeed?: number;
  humidity?: number;
  feelsLike?: number;
  unit?: string;
}

export interface UserPreferences {
  favoriteColors: ClothingColor[];
  favoriteStyles: string[];
  styles?: string[];
  personalityTags?: PersonalityTag[];
  seasonalPreferences: {
    [key in ClothingSeason]: {
      enabled: boolean;
      temperatureRange: [number, number];
      timeOfYear?: [number, number];
    }
  };
  outfitReminders: boolean;
  reminderTime: string; // "HH:MM" format
  occasionPreferences?: string[];
  climatePreferences?: string[];
}

export interface OutfitLogExtended {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: TimeOfDay;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
  activity?: Activity;
  customActivity?: string;
  askForAiSuggestion?: boolean;
  aiSuggested?: boolean;
  aiSuggestionFeedback?: 'positive' | 'negative' | null;
  occasionEmoji?: string; // For displaying emoji based on occasion
  thumbnailUrl?: string; // For displaying a tiny outfit image
}
