
export interface User {
  id: string;
  email: string | null;
  user_metadata: {
    avatar_url: string;
    email: string;
    full_name: string;
  } | null;
}

export interface UserPreferences {
  firstName?: string;
  lastName?: string;
  favoriteColors: string[];
  favoriteStyles: string[];
  personalityTags: string[];
  bodyType: 'hourglass' | 'rectangle' | 'triangle' | 'inverted-triangle' | 'oval' | 'not-specified';
  seasonalPreferences: {
    spring: { enabled: boolean; temperatureRange: [number, number] };
    summer: { enabled: boolean; temperatureRange: [number, number] };
    autumn: { enabled: boolean; temperatureRange: [number, number] };
    winter: { enabled: boolean; temperatureRange: [number, number] };
    all: { enabled: boolean; temperatureRange: [number, number] };
  };
  outfitReminders: boolean;
  reminderTime: string;
  occasionPreferences: string[];
  climatePreferences: string[];
  weatherLocation?: { city: string; country: string };
  useTrendsGlobal: boolean;
  useTrendsLocal: boolean;
  useOnlyWardrobe: boolean;
  temperatureUnit: 'C' | 'F';
  weeklyEmailUpdates: boolean;
  notifyNewOutfits: boolean;
  notifyWeatherChanges: boolean;
  pronouns: 'he/him' | 'she/her' | 'they/them' | 'not-specified';
  appearanceSettings: {
    theme: 'light' | 'dark' | 'system';
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

export type ClothingType = string;
export type ClothingColor = string;
export type ClothingMaterial = string;
export type ClothingSeason = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
export type ClothingOccasion = 'casual' | 'formal' | 'work' | 'sport' | 'special' | 'travel';

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  description?: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: string;
  color: string;
  pattern: string;
  fabric: string;
  material?: string;
  season: string[];
  sleeveLength: string;
  neckline: string;
  fit: string;
  length: string;
  closure: string;
  waist: string;
  rise: string;
  wash: string;
  details: string;
  styleTags: string[];
  personalityTags: string[];
  imageUrls: string[];
  imageUrl?: string;
  image?: string;
  dateAdded: Date;
  timesWorn: number;
  lastWorn: Date | undefined;
  brand: string;
  size: string;
  condition: string;
  notes: string;
  userId: string;
  favorite: boolean;
  cost: number;
  currency: string;
  store: string;
  composition: string;
  careInstructions: string;
  archived: boolean;
  source: string;
  occasions?: string[];
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  occasions: string[];
  occasion: string;
  season: string[];
  seasons: string[];
  favorite: boolean;
  timesWorn: number;
  lastWorn: Date | undefined;
  dateAdded: Date;
  personality_tags: string[];
  color_scheme: string;
  colors: string[];
  notes?: string;
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
}
