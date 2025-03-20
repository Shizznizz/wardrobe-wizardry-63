
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

export interface ClothingItem {
  id: string;
  name: string;
  type: ClothingType;
  color: ClothingColor;
  material: ClothingMaterial;
  seasons: ClothingSeason[];
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
  seasonalPreferences: {
    [key in ClothingSeason]: {
      enabled: boolean;
      temperatureRange: [number, number];
    }
  };
  outfitReminders: boolean;
  reminderTime: string; // "HH:MM" format
}
