
import { ClothingItem, Outfit, ExtendedClothingItem, MoodClothingItem, PersonalizedItem } from './types';

export const createDefaultClothingItem = (overrides: Partial<ClothingItem>): ClothingItem => ({
  id: '',
  name: '',
  type: '',
  color: '',
  dateAdded: new Date(),
  timesWorn: 0,
  favorite: false,
  ...overrides
});

export const createDefaultOutfit = (overrides: Partial<Outfit>): Outfit => ({
  id: '',
  name: '',
  items: [],
  favorite: false,
  timesWorn: 0,
  dateAdded: new Date(),
  ...overrides
});

export const createShopClothingItem = (overrides: Partial<ClothingItem>): ClothingItem => ({
  id: '',
  name: '',
  type: '',
  color: '',
  dateAdded: new Date(),
  timesWorn: 0,
  favorite: false,
  season: ['all'],
  occasions: ['casual'],
  ...overrides
});

export const createMoodClothingItem = (overrides: Partial<MoodClothingItem>): MoodClothingItem => ({
  id: '',
  name: '',
  type: '',
  color: '',
  dateAdded: new Date(),
  timesWorn: 0,
  favorite: false,
  season: ['all'],
  occasions: ['casual'],
  ...overrides
});

export const createExtendedClothingItem = (overrides: Partial<ExtendedClothingItem>): ExtendedClothingItem => ({
  id: '',
  name: '',
  type: '',
  color: '',
  dateAdded: new Date(),
  timesWorn: 0,
  favorite: false,
  season: ['all'],
  occasions: ['casual'],
  ...overrides
});
