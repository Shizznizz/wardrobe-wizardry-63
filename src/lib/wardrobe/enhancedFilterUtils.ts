import { ClothingItem, ClothingSeason, ClothingOccasion } from '@/lib/types';

export const filterItemsBySearchTerm = (items: ClothingItem[], searchTerm: string): ClothingItem[] => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(lowerSearchTerm) ||
    item.type.toLowerCase().includes(lowerSearchTerm) ||
    item.color.toLowerCase().includes(lowerSearchTerm) ||
    (item.material && item.material.toLowerCase().includes(lowerSearchTerm)) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))) ||
    (item.styleTags && item.styleTags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
  );
};

export const applyBasicFilters = (
  items: ClothingItem[],
  filters: {
    seasons?: ClothingSeason[];
    occasions?: ClothingOccasion[];
    colors?: string[];
    types?: string[];
  }
): ClothingItem[] => {
  return items.filter(item => {
    if (filters.seasons && filters.seasons.length > 0) {
      if (!item.season || item.season.length === 0) return false;
      const hasMatchingSeason = filters.seasons.some(season => item.season?.includes(season) || item.season?.includes('all'));
      if (!hasMatchingSeason) return false;
    }

    if (filters.occasions && filters.occasions.length > 0) {
      if (!item.occasions || item.occasions.length === 0) return false;
      const hasMatchingOccasion = filters.occasions.some(occasion => item.occasions?.includes(occasion));
      if (!hasMatchingOccasion) return false;
    }

    if (filters.colors && filters.colors.length > 0) {
      if (!filters.colors.includes(item.color)) return false;
    }

    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(item.type)) return false;
    }

    return true;
  });
};

export const applyAdvancedFilters = (
  items: ClothingItem[],
  filters: {
    seasons?: ClothingSeason[];
    occasions?: ClothingOccasion[];
    colors?: string[];
    types?: string[];
    favoriteOnly?: boolean;
    recentlyWorn?: boolean;
    timesWornRange?: [number, number];
  }
): ClothingItem[] => {
  return items.filter(item => {
    // Season filter
    if (filters.seasons && filters.seasons.length > 0) {
      const itemSeasons = Array.isArray(item.season) ? item.season : [];
      const hasMatchingSeason = filters.seasons.some(season => 
        itemSeasons.includes(season) || itemSeasons.includes('all')
      );
      if (!hasMatchingSeason) return false;
    }

    // Occasion filter - use occasions property instead of occasion
    if (filters.occasions && filters.occasions.length > 0) {
      const itemOccasions = Array.isArray(item.occasions) ? item.occasions : [];
      const hasMatchingOccasion = filters.occasions.some(occasion => 
        itemOccasions.includes(occasion)
      );
      if (!hasMatchingOccasion) return false;
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0 && !filters.colors.includes(item.color)) {
      return false;
    }

    // Type filter
    if (filters.types && filters.types.length > 0 && !filters.types.includes(item.type)) {
      return false;
    }

    // Favorite only filter
    if (filters.favoriteOnly && !item.favorite) {
      return false;
    }

    // Recently worn filter (example: within the last 30 days)
    if (filters.recentlyWorn) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (!item.lastWorn || item.lastWorn < thirtyDaysAgo) {
        return false;
      }
    }

    // Times worn range filter
    if (filters.timesWornRange) {
      const [min, max] = filters.timesWornRange;
      if (item.timesWorn < min || item.timesWorn > max) {
        return false;
      }
    }

    return true;
  });
};

export const sortItems = (items: ClothingItem[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): ClothingItem[] => {
  const sortedItems = [...items];

  sortedItems.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'color':
        comparison = a.color.localeCompare(b.color);
        break;
      case 'dateAdded':
        comparison = a.dateAdded.getTime() - b.dateAdded.getTime();
        break;
      case 'timesWorn':
        comparison = a.timesWorn - b.timesWorn;
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }

    return sortOrder === 'asc' ? comparison : comparison * -1;
  });

  return sortedItems;
};

export const getItemCompatibilityScore = (item1: ClothingItem, item2: ClothingItem): number => {
  let score = 0;
  
  // Season compatibility
  const seasons1 = Array.isArray(item1.season) ? item1.season : [];
  const seasons2 = Array.isArray(item2.season) ? item2.season : [];
  const seasonOverlap = seasons1.some(s => seasons2.includes(s) || s === 'all' || seasons2.includes('all'));
  if (seasonOverlap) score += 30;
  
  // Occasion compatibility - use occasions property
  const occasions1 = Array.isArray(item1.occasions) ? item1.occasions : [];
  const occasions2 = Array.isArray(item2.occasions) ? item2.occasions : [];
  const occasionOverlap = occasions1.some(o => occasions2.includes(o));
  if (occasionOverlap) score += 40;
  
  // Color compatibility (simplified)
  if (item1.color === item2.color) score += 10;
  
  // Type compatibility (e.g., top + bottom)
  const compatibleTypes = (
    (item1.type === 'top' && item2.type === 'pants') ||
    (item1.type === 'pants' && item2.type === 'top') ||
    (item1.type === 'dress' && item2.type === 'shoes') ||
    (item1.type === 'shoes' && item2.type === 'dress')
  );
  if (compatibleTypes) score += 20;
  
  return Math.min(score, 100);
};

export interface WardrobeFilters {
  types: string[];
  colors: string[];
  seasons: string[];
  occasions: string[];
  favorites: boolean;
}
