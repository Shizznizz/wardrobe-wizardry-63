
import { ClothingItem, Outfit, UserPreferences, ClothingOccasion } from './types';

export const sampleClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'White T-Shirt',
    type: 'shirt',
    color: 'white',
    material: 'cotton',
    season: ['spring', 'summer', 'autumn'],
    occasions: ['casual', 'sport'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: true,
    timesWorn: 12,
    lastWorn: new Date('2023-10-15'),
    dateAdded: new Date('2023-01-10')
  },
  {
    id: '2',
    name: 'Blue Jeans',
    type: 'jeans',
    color: 'blue',
    material: 'denim',
    season: ['spring', 'autumn', 'winter'],
    occasions: ['casual', 'travel'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: true,
    timesWorn: 20,
    lastWorn: new Date('2023-10-18'),
    dateAdded: new Date('2022-11-05')
  },
  {
    id: '3',
    name: 'Black Leather Jacket',
    type: 'jacket',
    color: 'black',
    material: 'leather',
    season: ['autumn', 'winter'],
    occasions: ['casual', 'date', 'party'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: false,
    timesWorn: 5,
    lastWorn: new Date('2023-09-25'),
    dateAdded: new Date('2022-10-15')
  },
  {
    id: '4',
    name: 'Beige Chinos',
    type: 'pants',
    color: 'brown',
    material: 'cotton',
    season: ['spring', 'autumn'],
    occasions: ['business', 'formal', 'date'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: false,
    timesWorn: 8,
    lastWorn: new Date('2023-10-05'),
    dateAdded: new Date('2023-03-20')
  },
  {
    id: '5',
    name: 'Navy Blue Sweater',
    type: 'sweater',
    color: 'blue',
    material: 'wool',
    season: ['autumn', 'winter'],
    occasions: ['casual', 'business', 'work'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: true,
    timesWorn: 10,
    lastWorn: new Date('2023-10-12'),
    dateAdded: new Date('2022-09-10')
  },
  {
    id: '6',
    name: 'White Sneakers',
    type: 'sneakers',
    color: 'white',
    material: 'other',
    season: ['spring', 'summer', 'autumn'],
    occasions: ['casual', 'sport', 'travel'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: true,
    timesWorn: 25,
    lastWorn: new Date('2023-10-20'),
    dateAdded: new Date('2023-02-14')
  },
  {
    id: '7',
    name: 'Gray Hoodie',
    type: 'hoodie',
    color: 'gray',
    material: 'cotton',
    season: ['autumn', 'winter'],
    occasions: ['casual', 'sport', 'travel'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: false,
    timesWorn: 15,
    lastWorn: new Date('2023-10-08'),
    dateAdded: new Date('2022-12-05')
  },
  {
    id: '8',
    name: 'Black Dress',
    type: 'dress',
    color: 'black',
    material: 'polyester',
    season: ['spring', 'summer', 'autumn'],
    occasions: ['formal', 'party', 'special', 'date'] as ClothingOccasion[],
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80',
    image: '/placeholder.svg',
    favorite: true,
    timesWorn: 3,
    lastWorn: new Date('2023-09-15'),
    dateAdded: new Date('2023-06-10')
  }
];

export const sampleOutfits: Outfit[] = [
  {
    id: '1',
    name: 'Casual Weekend',
    items: ['1', '2', '6'], // These should be IDs of clothing items
    occasions: ['casual', 'weekend', 'shopping', 'brunch'],
    season: ['spring', 'summer', 'autumn'],
    seasons: ['spring', 'summer', 'autumn'],
    occasion: 'casual',
    favorite: true,
    timesWorn: 8,
    lastWorn: new Date('2023-10-15'),
    dateAdded: new Date('2023-03-15'),
    personality_tags: ['casual', 'minimalist'],
    color_scheme: 'Neutral with blue accent',
    colors: ['white', 'blue']
  },
  {
    id: '2',
    name: 'Smart Casual',
    items: ['5', '4', '6'],
    occasions: ['smart casual', 'work', 'dinner', 'meeting'],
    season: ['autumn', 'winter'],
    seasons: ['autumn', 'winter'],
    occasion: 'work',
    favorite: false,
    timesWorn: 5,
    lastWorn: new Date('2023-10-10'),
    dateAdded: new Date('2023-04-20'),
    personality_tags: ['classic', 'preppy'],
    color_scheme: 'Navy and beige',
    colors: ['blue', 'brown', 'white']
  },
  {
    id: '3',
    name: 'Evening Out',
    items: ['8', '6'],
    occasions: ['evening', 'date', 'party', 'restaurant'],
    season: ['spring', 'summer', 'autumn'],
    seasons: ['spring', 'summer', 'autumn'],
    occasion: 'date',
    favorite: true,
    timesWorn: 2,
    lastWorn: new Date('2023-09-15'),
    dateAdded: new Date('2023-06-15'),
    personality_tags: ['elegant', 'bold'],
    color_scheme: 'Classic black and white',
    colors: ['black', 'white']
  },
  {
    id: '4',
    name: 'Trendy Street Style',
    items: ['1', '7', '6'],
    occasions: ['casual', 'hangout', 'concert', 'city walk'],
    season: ['autumn', 'spring'],
    seasons: ['autumn', 'spring'],
    occasion: 'casual',
    favorite: false,
    timesWorn: 3,
    lastWorn: new Date('2023-08-20'),
    dateAdded: new Date('2023-05-10'),
    personality_tags: ['trendy', 'sporty'],
    color_scheme: 'White, gray, with pop accents',
    colors: ['white', 'gray']
  },
  {
    id: '5',
    name: 'Professional Look',
    items: ['3', '4', '6'],
    occasions: ['formal', 'business', 'interview', 'presentation'],
    season: ['autumn', 'winter'],
    seasons: ['autumn', 'winter'],
    occasion: 'formal',
    favorite: true,
    timesWorn: 6,
    lastWorn: new Date('2023-09-05'),
    dateAdded: new Date('2023-02-28'),
    personality_tags: ['formal', 'classic'],
    color_scheme: 'Black and beige sophisticated',
    colors: ['black', 'brown', 'white']
  }
];

export const sampleUserPreferences: UserPreferences = {
  favoriteColors: ['blue', 'black', 'white'],
  favoriteStyles: ['casual', 'smart casual'],
  personalityTags: ['minimalist', 'classic', 'casual'],
  seasonalPreferences: {
    spring: {
      enabled: true,
      temperatureRange: [10, 20]
    },
    summer: {
      enabled: true,
      temperatureRange: [21, 30]
    },
    autumn: {
      enabled: true,
      temperatureRange: [10, 20]
    },
    winter: {
      enabled: true,
      temperatureRange: [-5, 10]
    },
    all: {
      enabled: true,
      temperatureRange: [-5, 30]
    }
  },
  outfitReminders: true,
  reminderTime: '07:30'
};
