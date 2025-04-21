
import { ClothingItem, ClothingType, ClothingColor, ClothingOccasion, ClothingSeason } from '@/lib/types';
import { differenceInDays, differenceInMonths } from 'date-fns';

// Define the filter state interface
export interface WardrobeFilters {
  category: ClothingType | null;
  color: ClothingColor | null;
  occasion: ClothingOccasion | null;
  timeFrame: 'all' | 'recent' | '3months' | '6months';
  favorite: boolean | null;
  weatherAppropriate: boolean | null;
  searchQuery: string;
}

// Filter by category
export const filterByCategory = (items: ClothingItem[], category: ClothingType | null): ClothingItem[] => {
  if (!category) return items;
  return items.filter(item => item.type === category);
};

// Filter by color
export const filterByColor = (items: ClothingItem[], color: ClothingColor | null): ClothingItem[] => {
  if (!color) return items;
  return items.filter(item => item.color === color);
};

// Filter by occasion
export const filterByOccasion = (items: ClothingItem[], occasion: ClothingOccasion | null): ClothingItem[] => {
  if (!occasion) return items;
  return items.filter(item => {
    // Check if the item has the occasion either as direct property or in the occasions array
    return item.occasion === occasion || 
           (item.occasions && Array.isArray(item.occasions) && item.occasions.includes(occasion));
  });
};

// Filter by last worn time frame
export const filterByTimeFrame = (items: ClothingItem[], timeFrame: 'all' | 'recent' | '3months' | '6months'): ClothingItem[] => {
  if (timeFrame === 'all') return items;
  
  const now = new Date();
  
  return items.filter(item => {
    if (!item.lastWorn) return false;
    
    const lastWornDate = new Date(item.lastWorn);
    
    switch(timeFrame) {
      case 'recent':
        // Recently worn: last 30 days
        return differenceInDays(now, lastWornDate) <= 30;
      case '3months':
        // Last 3 months
        return differenceInMonths(now, lastWornDate) <= 3;
      case '6months':
        // Last 6 months
        return differenceInMonths(now, lastWornDate) <= 6;
      default:
        return true;
    }
  });
};

// Filter by favorite status
export const filterByFavorite = (items: ClothingItem[], favorite: boolean | null): ClothingItem[] => {
  if (favorite === null) return items;
  return items.filter(item => item.favorite === favorite);
};

// Filter by weather appropriateness
export const filterByWeather = (
  items: ClothingItem[], 
  weatherAppropriate: boolean | null, 
  temperature?: number, 
  condition?: string
): ClothingItem[] => {
  if (weatherAppropriate !== true || !temperature) return items;
  
  // Determine season based on temperature
  let currentSeason: ClothingSeason;
  
  if (temperature < 5) currentSeason = 'winter';
  else if (temperature >= 5 && temperature < 15) currentSeason = 'autumn';
  else if (temperature >= 15 && temperature < 25) currentSeason = 'spring';
  else currentSeason = 'summer';
  
  return items.filter(item => {
    // If the item has seasons defined, check if it includes the current season or 'all'
    if (item.season && Array.isArray(item.season)) {
      return item.season.includes(currentSeason) || item.season.includes('all');
    }
    
    // If no seasons are defined, assume it's wearable in all weather
    return true;
  });
};

// Search through items
export const searchItems = (items: ClothingItem[], query: string): ClothingItem[] => {
  if (!query.trim()) return items;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return items.filter(item => {
    const searchableFields = [
      item.name || '',
      item.type || '',
      item.color || '',
      item.brand || '',
      item.material || '',
      item.occasion || '',
      ...(item.tags || []),
      ...(item.occasions || [])
    ].map(field => field.toLowerCase());
    
    // Check if ALL search terms match at least one field
    return searchTerms.every(term => 
      searchableFields.some(field => field.includes(term))
    );
  });
};

// Apply all filters together
export const applyFilters = (
  items: ClothingItem[], 
  filters: WardrobeFilters, 
  temperature?: number,
  weatherCondition?: string
): ClothingItem[] => {
  let filteredItems = [...items];
  
  // Apply each filter in sequence
  filteredItems = filterByCategory(filteredItems, filters.category);
  filteredItems = filterByColor(filteredItems, filters.color);
  filteredItems = filterByOccasion(filteredItems, filters.occasion);
  filteredItems = filterByTimeFrame(filteredItems, filters.timeFrame);
  filteredItems = filterByFavorite(filteredItems, filters.favorite);
  filteredItems = filterByWeather(filteredItems, filters.weatherAppropriate, temperature, weatherCondition);
  filteredItems = searchItems(filteredItems, filters.searchQuery);
  
  return filteredItems;
};
