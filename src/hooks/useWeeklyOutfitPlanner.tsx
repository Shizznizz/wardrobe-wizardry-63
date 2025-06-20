import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { ClothingItem, Outfit } from '@/lib/types';
import { generateWeatherForDate } from '@/services/WeatherService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';


export const useWeeklyOutfitPlanner = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const generateWeeklyOutfits = async (
    clothingItems: ClothingItem[],
    weatherLocation?: { city: string; country: string }
  ): Promise<Outfit[]> => {
    if (!clothingItems.length) {
      throw new Error('No clothing items available');
    }

    const outfits: Outfit[] = [];
    const usedItemIds = new Set<string>();
    const startDate = new Date();

    const itemsByType = {
      tops: clothingItems.filter(item => 
        ['top', 'shirt', 'blouse', 'sweater', 'jacket', 'hoodie'].some(type => 
          item.type.toLowerCase().includes(type)
        )
      ),
      bottoms: clothingItems.filter(item => 
        ['bottom', 'pants', 'jeans', 'skirt', 'shorts'].some(type => 
          item.type.toLowerCase().includes(type)
        )
      ),
      shoes: clothingItems.filter(item => 
        ['shoe', 'sneaker', 'boot', 'sandal'].some(type => 
          item.type.toLowerCase().includes(type)
        )
      ),
      accessories: clothingItems.filter(item => 
        ['accessory', 'bag', 'hat', 'jewelry', 'belt'].some(type => 
          item.type.toLowerCase().includes(type)
        )
      )
    };

    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(startDate, day);
      const weather = generateWeatherForDate(
        currentDate, 
        weatherLocation?.city, 
        weatherLocation?.country
      );

      const getAvailableItems = (items: ClothingItem[]) => 
        items.filter(item => {
          if (usedItemIds.has(item.id)) return false;
          
          if (weather.temperature < 10) {
            return item.material?.toLowerCase().includes('wool') || 
                   item.material?.toLowerCase().includes('fleece') ||
                   item.type.toLowerCase().includes('jacket');
          } else if (weather.temperature > 25) {
            return !item.material?.toLowerCase().includes('wool') &&
                   !item.type.toLowerCase().includes('jacket');
          }
          return true;
        });

      const availableTops = getAvailableItems(itemsByType.tops);
      const availableBottoms = getAvailableItems(itemsByType.bottoms);
      const availableShoes = getAvailableItems(itemsByType.shoes);
      const availableAccessories = getAvailableItems(itemsByType.accessories);

      if (!availableTops.length || !availableBottoms.length || !availableShoes.length) {
        if (day > 3) {
          const itemsToReset = Array.from(usedItemIds).slice(0, Math.floor(usedItemIds.size / 2));
          itemsToReset.forEach(id => usedItemIds.delete(id));
          day--;
          continue;
        }
      }

      const selectedTop = availableTops.length > 0 ? 
        availableTops[Math.floor(Math.random() * availableTops.length)] : 
        itemsByType.tops[Math.floor(Math.random() * itemsByType.tops.length)];
      
      const selectedBottom = availableBottoms.length > 0 ? 
        availableBottoms[Math.floor(Math.random() * availableBottoms.length)] : 
        itemsByType.bottoms[Math.floor(Math.random() * itemsByType.bottoms.length)];
      
      const selectedShoes = availableShoes.length > 0 ? 
        availableShoes[Math.floor(Math.random() * availableShoes.length)] : 
        itemsByType.shoes[Math.floor(Math.random() * itemsByType.shoes.length)];
      
      const selectedAccessory = availableAccessories.length > 0 ? 
        availableAccessories[Math.floor(Math.random() * availableAccessories.length)] : null;

      const outfitItems = [selectedTop, selectedBottom, selectedShoes, selectedAccessory]
        .filter(Boolean)
        .map(item => item!.id);

      outfitItems.forEach(id => usedItemIds.add(id));

      const dayOfWeek = currentDate.getDay();
      const occasion = dayOfWeek === 0 || dayOfWeek === 6 ? 'casual' : 'work';

      const outfit: Outfit = {
        id: `olivia-weekly-${Date.now()}-${day}`,
        name: `${format(currentDate, 'EEEE')} Outfit`,
        items: outfitItems,
        occasions: [occasion],
        occasion,
        seasons: [getCurrentSeason(currentDate)],
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        personality_tags: ['olivia-suggested', 'weekly-plan'],
        colors: [selectedTop?.color, selectedBottom?.color].filter(Boolean)
      };

      outfits.push(outfit);
    }

    return outfits;
  };

  const saveOutfitToSupabase = async (outfit: Outfit): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          id: outfit.id,
          user_id: user.id,
          name: outfit.name,
          items: outfit.items,
          occasions: outfit.occasions,
          occasion: outfit.occasion,
          season: outfit.seasons,
          favorite: outfit.favorite,
          times_worn: outfit.timesWorn,
          date_added: outfit.dateAdded.toISOString(),
          personality_tags: outfit.personality_tags,
          colors: outfit.colors
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving outfit:', error);
      return null;
    }
  };

  const getCurrentSeason = (date: Date): string => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  return {
    generateWeeklyOutfits,
    saveOutfitToSupabase,
    isGenerating,
    setIsGenerating
  };
};
