
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
  | 'beige'
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
  | 'jacket'
  | 'top'
  | 'other';

export type ClothingCategory = 
  | 'top'
  | 'bottom'
  | 'shoes'
  | 'outerwear'
  | 'accessories'
  | 'dress'
  | 'skirt'
  | 'other';

export type ClothingOccasion = 
  | 'casual'
  | 'formal'
  | 'work'
  | 'sport'
  | 'special'
  | 'travel'
  | 'business'
  | 'party'
  | 'date';

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
  icon?: string;
  high?: number;
  low?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
}

// Updated TimeOfDay type for calendar components
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Updated Activity type for calendar components with additional activities
export type Activity = 
  | 'work' 
  | 'casual' 
  | 'formal' 
  | 'exercise' 
  | 'travel' 
  | 'other'
  | 'party'
  | 'date'
  | 'interview'
  | 'presentation'
  | 'dinner'
  | 'sport';

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
  occasions?: ClothingOccasion[];
  timesWorn?: number;
  dateAdded?: Date;
  tags?: string[];
  category?: ClothingCategory;  // Added category field to fix errors
}

// Interface for PersonalizedItem in style carousel (making season optional)
export interface PersonalizedItem extends Omit<ClothingItem, 'season' | 'image'> {
  season?: ClothingSeason[];
  brand?: string;
  category?: ClothingCategory;  // Fixed type to match ClothingCategory
  image?: string;
}

// Interface for TrendingClothingItem (making season optional)
export interface TrendingClothingItem extends Omit<ClothingItem, 'season' | 'image'> {
  season?: ClothingSeason[];
  brand?: string;
  category?: ClothingCategory;  // Fixed type to match ClothingCategory
  image?: string;
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

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  season: ClothingSeason[];
  seasons?: ClothingSeason[]; // For backward compatibility
  occasion: string;
  occasions?: string[];
  favorite?: boolean;
  lastWorn?: Date;
  createdAt?: Date;
  dateAdded?: Date;
  notes?: string;
  timesWorn?: number;
  personalityTags?: PersonalityTag[];
  tags?: string[];  // Added for OutfitGroupsSection and OutfitPreview
  colors?: string[]; // Added for filtering in Outfits page
  colorScheme?: string; // Added for sample outfits in wardrobeData
}

// Interface specifically for shop items that extends ClothingItem
export interface ShopItem extends Omit<ClothingItem, 'price'> {
  price: string;
  retailer: string;
  rating: number;
  reviewCount: number;
  discount?: string;
  affiliateUrl: string;
  isExclusive?: boolean;
  isTrending?: boolean;
}
