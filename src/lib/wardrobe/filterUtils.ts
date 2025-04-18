
import { ClothingItem, ClothingType } from '@/lib/types';
import { Outfit } from '@/lib/types';

export const filterItemsByCategory = (items: ClothingItem[], category: ClothingType | null): ClothingItem[] => {
  if (!category) return items;
  return items.filter(item => item.type === category);
};

export const applySmartFilter = (
  items: ClothingItem[],
  filterType: string | null,
  itemForPairing: string | null,
  outfits: Outfit[]
): ClothingItem[] => {
  if (!filterType) return items;

  switch (filterType) {
    case 'weather':
      const currentSeason = 'spring';
      return items.filter(item => 
        item.season && Array.isArray(item.season) && 
        (item.season.includes(currentSeason) || item.season.includes('all'))
      );
      
    case 'pairing':
      if (itemForPairing) {
        const relevantOutfits = outfits.filter(outfit => 
          outfit.items && Array.isArray(outfit.items) &&
          outfit.items.includes(itemForPairing)
        );
        
        const pairingItemIds = new Set<string>();
        relevantOutfits.forEach(outfit => {
          if (outfit.items && Array.isArray(outfit.items)) {
            outfit.items.forEach(id => {
              if (id !== itemForPairing) {
                pairingItemIds.add(id);
              }
            });
          }
        });
        
        return items.filter(item => 
          pairingItemIds.has(item.id) || item.id === itemForPairing
        );
      }
      return items;
      
    case 'olivia':
      const popularColors = ['black', 'white', 'blue', 'gray'];
      const versatileTypes = ['shirt', 'jeans', 'sneakers', 'sweater'];
      
      return items.filter(item => 
        (item.color && popularColors.includes(item.color)) || 
        (item.type && versatileTypes.includes(item.type)) ||
        item.favorite
      );

    default:
      return items;
  }
};

export const sortItems = (items: ClothingItem[], sortOption: string): ClothingItem[] => {
  return [...items].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime();
      case 'favorites':
        return Number(b.favorite || false) - Number(a.favorite || false);
      case 'most-worn':
        return (b.timesWorn || 0) - (a.timesWorn || 0);
      case 'color':
        return (a.color || '').localeCompare(b.color || '');
      case 'most-matched':
        return (b.timesWorn || 0) - (a.timesWorn || 0);
      case 'weather-fit':
        const currentSeason = 'spring';
        return (b.season && Array.isArray(b.season) && b.season.includes(currentSeason)) ? -1 : 1;
      case 'not-recent':
        return (a.timesWorn || 0) - (b.timesWorn || 0);
      default:
        return 0;
    }
  });
};
