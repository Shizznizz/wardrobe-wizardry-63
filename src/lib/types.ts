export interface User {
  id: string;
  email: string | null;
  user_metadata: {
    avatar_url: string;
    email: string;
    full_name: string;
  } | null;
}

// Add missing type exports
export type PersonalityTag = string;
export type BodyType = 'hourglass' | 'rectangle' | 'triangle' | 'inverted-triangle' | 'oval' | 'not-specified';

export interface UserPreferences {
  firstName?: string;
  lastName?: string;
  favoriteColors?: string[];
  favoriteStyles?: string[];
  personalityTags?: string[];
  bodyType?: BodyType;
  seasonalPreferences?: {
    spring: { enabled: boolean; temperatureRange: [number, number]; goToLook?: string };
    summer: { enabled: boolean; temperatureRange: [number, number]; goToLook?: string };
    autumn: { enabled: boolean; temperatureRange: [number, number]; goToLook?: string };
    winter: { enabled: boolean; temperatureRange: [number, number]; goToLook?: string };
    all: { enabled: boolean; temperatureRange: [number, number]; goToLook?: string };
  };
  outfitReminders?: boolean;
  reminderTime?: string;
  occasionPreferences?: string[];
  climatePreferences?: string[];
  weatherLocation?: { city: string; country: string };
  useTrendsGlobal?: boolean;
  useTrendsLocal?: boolean;
  useOnlyWardrobe?: boolean;
  temperatureUnit?: 'C' | 'F';
  weeklyEmailUpdates?: boolean;
  notifyNewOutfits?: boolean;
  notifyWeatherChanges?: boolean;
  pronouns?: 'he/him' | 'she/her' | 'they/them' | 'not-specified' | 'custom';
  customPronouns?: string;
  appearanceSettings?: {
    theme: 'light' | 'dark' | 'system';
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

export type ClothingType = string;
export type ClothingColor = string;
export type ClothingMaterial = string;
export type ClothingSeason = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
export type ClothingOccasion = 'casual' | 'formal' | 'work' | 'sport' | 'special' | 'travel' | 'business' | 'party' | 'date';

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  description?: string;
  city?: string;
  country?: string;
  feelsLike?: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: string;
  color: string;
  pattern?: string;
  fabric?: string;
  material?: string;
  season?: string[];
  sleeveLength?: string;
  neckline?: string;
  fit?: string;
  length?: string;
  closure?: string;
  waist?: string;
  rise?: string;
  wash?: string;
  details?: string;
  styleTags?: string[];
  personalityTags?: string[];
  imageUrls?: string[];
  imageUrl?: string;
  image?: string;
  dateAdded: Date;
  timesWorn: number;
  lastWorn?: Date | undefined;
  brand?: string;
  size?: string;
  condition?: string;
  notes?: string;
  userId?: string;
  favorite: boolean;
  cost?: number;
  currency?: string;
  store?: string;
  composition?: string;
  careInstructions?: string;
  archived?: boolean;
  source?: string;
  occasions?: string[];
  category?: string;
  price?: number;
  affiliateUrl?: string;
  tags?: string[];
}

// Extended types for different use cases
export interface ExtendedClothingItem extends ClothingItem {
  price?: number;
  affiliateUrl?: string;
  tags?: string[];
}

export interface MoodClothingItem extends ClothingItem {
  price?: number;
  affiliateUrl?: string;
  tags?: string[];
  mood?: string;
}

export interface PersonalizedItem extends ClothingItem {
  price?: number;
  affiliateUrl?: string;
  tags?: string[];
  personalizedReason?: string;
}

// Add TrendingClothingItem type alias
export type TrendingClothingItem = ExtendedClothingItem;

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  occasions?: string[];
  occasion?: string;
  season?: string[];
  seasons?: string[];
  favorite: boolean;
  timesWorn: number;
  lastWorn?: Date | undefined;
  dateAdded: Date;
  personality_tags?: string[];
  color_scheme?: string;
  colors?: string[];
  notes?: string;
  tags?: string[];
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'all-day';

export interface OutfitLog {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: TimeOfDay;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
  activity?: string;
  customActivity?: string;
  user_id: string;
  askForAiSuggestion?: boolean;
  aiSuggested?: boolean;
  aiSuggestionFeedback?: string;
}

export interface OutfitLogExtended extends OutfitLog {
  outfitName?: string;
  outfitDetails?: Outfit;
}

export interface Activity {
  id: string;
  name: string;
  category?: string;
  description?: string;
}
