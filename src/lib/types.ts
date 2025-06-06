
// src/lib/types.ts

export type ClothingColor =
  | 'black'
  | 'white'
  | 'gray'
  | 'red'
  | 'blue'
  | 'navy'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'brown'
  | 'beige'
  | 'cream'
  | 'burgundy'
  | 'coral'
  | 'rose'
  | 'multicolor'
  | 'gold'
  | 'silver'
  | 'maroon'
  | 'teal'
  | 'lavender'
  | 'mint'
  | 'peach'
  | 'olive'
  | 'turquoise'
  | 'light blue';

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

export type BodyType = 
  | 'hourglass'
  | 'apple'
  | 'pear'
  | 'rectangle'
  | 'inverted-triangle'
  | 'not-specified';

export type ClothingType = 
  | 'shirt'
  | 't-shirt'
  | 'blouse'
  | 'tank-top'
  | 'crop-top'
  | 'sweater'
  | 'cardigan'
  | 'hoodie'
  | 'sweatshirt'
  | 'jacket'
  | 'blazer'
  | 'coat'
  | 'windbreaker'
  | 'vest'
  | 'dress'
  | 'maxi-dress'
  | 'mini-dress'
  | 'jumpsuit'
  | 'romper'
  | 'pants'
  | 'jeans'
  | 'shorts'
  | 'skirt'
  | 'leggings'
  | 'joggers'
  | 'sweatpants'
  | 'sneakers'
  | 'boots'
  | 'sandals'
  | 'heels'
  | 'flats'
  | 'loafers'
  | 'belt'
  | 'scarf'
  | 'hat'
  | 'gloves'
  | 'bag'
  | 'jewelry'
  | 'sunglasses'
  | 'swimwear'
  | 'sleepwear'
  | 'activewear'
  | 'other'
  | 'shoes'
  | 'accessories'
  | 'top'
  | 'accessory';

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

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

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

export interface OutfitLog {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: TimeOfDay;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
  user_id: string;  // Adding the required user_id field
  activity?: string;
  customActivity?: string;
  askForAiSuggestion?: boolean;
  aiSuggested?: boolean;
  aiSuggestionFeedback?: 'positive' | 'negative' | null;
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
  category?: ClothingCategory;
  occasion?: string;
  affiliateUrl?: string;
}

export interface PersonalizedItem extends Omit<ClothingItem, 'season' | 'image'> {
  season?: ClothingSeason[];
  brand?: string;
  category?: ClothingCategory;
  image?: string;
}

export interface TrendingClothingItem extends Omit<ClothingItem, 'season' | 'image'> {
  season?: ClothingSeason[];
  brand?: string;
  category?: ClothingCategory;
  image?: string;
}

export interface AppearanceSettings {
  theme: string;
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface StyleQuizResult {
  completedAt?: string | Date;
  styleSummary?: string;
  personalityTags?: string[];
  [key: string]: any;
}

export interface UserPreferences {
  favoriteColors?: string[];
  favoriteStyles?: string[];
  personalityTags?: string[];
  bodyType?: string;
  seasonalPreferences?: SeasonalPreferences;
  outfitReminders?: boolean;
  reminderTime?: string;
  occasionPreferences?: string[];
  climatePreferences?: string[];
  weatherLocation?: {
    city: string;
    country: string;
  };
  // New fields for profile page
  firstName?: string;
  lastName?: string;
  pronouns?: string;
  customPronouns?: string;
  temperatureUnit?: 'C' | 'F';
  useOnlyWardrobe?: boolean;
  useTrendsGlobal?: boolean;
  useTrendsLocal?: boolean;
  weeklyEmailUpdates?: boolean;
  notifyNewOutfits?: boolean;
  notifyWeatherChanges?: boolean;
  // Add the appearance settings property
  appearanceSettings?: AppearanceSettings;
  // Add the style quiz result property
  styleQuizResult?: StyleQuizResult | null;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  season?: ClothingSeason[] | ClothingSeason;
  seasons?: ClothingSeason[];
  occasion?: string;
  occasions?: string[];
  favorite?: boolean;
  dateAdded?: string | Date;
  timesWorn?: number;
  lastWorn?: Date;
  notes?: string;
  tags?: string[];
  colors?: string[];
  thumbnail?: string;
  color_scheme?: string;
  personality_tags?: string[];
}

export interface ShopItem extends Omit<ClothingItem, 'price'> {
  price: string | number;
  retailer: string;
  rating: number;
  reviewCount: number;
  discount?: string;
  affiliateUrl: string;
  isExclusive?: boolean;
  isTrending?: boolean;
}

export type SeasonalPreferences = {
  [key in ClothingSeason]: {
    enabled: boolean;
    temperatureRange: [number, number];
    timeOfYear?: [number, number];
    goToLook?: string;
  };
};
