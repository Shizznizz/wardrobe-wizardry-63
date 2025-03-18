
import { ClothingItem, Outfit, UserPreferences } from './types';

export const sampleClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'White T-Shirt',
    type: 'top',
    color: 'white',
    material: 'cotton',
    seasons: ['spring', 'summer', 'autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80',
    favorite: true,
    timesWorn: 12,
    lastWorn: new Date('2023-10-15'),
    dateAdded: new Date('2023-01-10')
  },
  {
    id: '2',
    name: 'Blue Jeans',
    type: 'bottom',
    color: 'blue',
    material: 'denim',
    seasons: ['spring', 'autumn', 'winter'],
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',
    favorite: true,
    timesWorn: 20,
    lastWorn: new Date('2023-10-18'),
    dateAdded: new Date('2022-11-05')
  },
  {
    id: '3',
    name: 'Black Leather Jacket',
    type: 'outerwear',
    color: 'black',
    material: 'leather',
    seasons: ['autumn', 'winter'],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80',
    favorite: false,
    timesWorn: 5,
    lastWorn: new Date('2023-09-25'),
    dateAdded: new Date('2022-10-15')
  },
  {
    id: '4',
    name: 'Beige Chinos',
    type: 'bottom',
    color: 'brown',
    material: 'cotton',
    seasons: ['spring', 'autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80',
    favorite: false,
    timesWorn: 8,
    lastWorn: new Date('2023-10-05'),
    dateAdded: new Date('2023-03-20')
  },
  {
    id: '5',
    name: 'Navy Blue Sweater',
    type: 'top',
    color: 'blue',
    material: 'wool',
    seasons: ['autumn', 'winter'],
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80',
    favorite: true,
    timesWorn: 10,
    lastWorn: new Date('2023-10-12'),
    dateAdded: new Date('2022-09-10')
  },
  {
    id: '6',
    name: 'White Sneakers',
    type: 'footwear',
    color: 'white',
    material: 'other',
    seasons: ['spring', 'summer', 'autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80',
    favorite: true,
    timesWorn: 25,
    lastWorn: new Date('2023-10-20'),
    dateAdded: new Date('2023-02-14')
  },
  {
    id: '7',
    name: 'Gray Hoodie',
    type: 'top',
    color: 'gray',
    material: 'cotton',
    seasons: ['autumn', 'winter'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80',
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
    seasons: ['spring', 'summer', 'autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80',
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
    items: ['1', '2', '6'],
    occasions: ['casual', 'weekend'],
    seasons: ['spring', 'summer', 'autumn'],
    favorite: true,
    timesWorn: 8,
    lastWorn: new Date('2023-10-15'),
    dateAdded: new Date('2023-03-15')
  },
  {
    id: '2',
    name: 'Smart Casual',
    items: ['5', '4', '6'],
    occasions: ['smart casual', 'work'],
    seasons: ['autumn', 'winter'],
    favorite: false,
    timesWorn: 5,
    lastWorn: new Date('2023-10-10'),
    dateAdded: new Date('2023-04-20')
  },
  {
    id: '3',
    name: 'Evening Out',
    items: ['8', '6'],
    occasions: ['evening', 'date'],
    seasons: ['spring', 'summer', 'autumn'],
    favorite: true,
    timesWorn: 2,
    lastWorn: new Date('2023-09-15'),
    dateAdded: new Date('2023-06-15')
  }
];

export const sampleUserPreferences: UserPreferences = {
  favoriteColors: ['blue', 'black', 'white'],
  favoriteStyles: ['casual', 'smart casual'],
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
