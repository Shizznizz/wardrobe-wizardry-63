
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
  | 'other';

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
  | 'date';

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
  | 'formal';

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

export interface ClothingItem {
  id: string;
  name: string;
  type: ClothingType;
  color: ClothingColor;
  material: ClothingMaterial;
  seasons: ClothingSeason[];
  occasions: ClothingOccasion[]; // New field for occasions
  imageUrl: string;
  favorite: boolean;
  timesWorn: number;
  lastWorn?: Date;
  dateAdded: Date;
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
  description?: string; // Adding the missing description property
  styling?: string[]; // Adding the missing styling property
  forCold?: boolean; // Added property for cold weather suitability
  forHot?: boolean; // Added property for hot weather suitability
  forRain?: boolean; // Added property for rainy weather suitability
  timeOfDay?: TimeOfDay[]; // Added property for time of day suitability
  activities?: Activity[]; // Added property for activity suitability
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
}

export interface UserPreferences {
  favoriteColors: ClothingColor[];
  favoriteStyles: string[];
  personalityTags?: PersonalityTag[]; // User's preferred style tags
  seasonalPreferences: {
    [key in ClothingSeason]: {
      enabled: boolean;
      temperatureRange: [number, number];
    }
  };
  outfitReminders: boolean;
  reminderTime: string; // "HH:MM" format
}
