
import { useState, useEffect } from 'react';
import { Outfit, ClothingItem, WeatherInfo, ClothingSeason } from '@/lib/types';
import { useWardrobeData } from '@/hooks/useWardrobeData';
import { generateRandomWeather } from '@/services/WeatherService';
import { toast } from 'sonner';

export const useOliviaOutfitSuggestions = () => {
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [currentSeason, setCurrentSeason] = useState<ClothingSeason>('autumn');
  const { clothingItems, isLoadingItems } = useWardrobeData();

  // Get current season based on date
  useEffect(() => {
    const determineCurrentSeason = (): ClothingSeason => {
      const now = new Date();
      const month = now.getMonth();
      
      // Northern hemisphere seasons (rough approximation)
      if (month >= 2 && month <= 4) return 'spring';
      if (month >= 5 && month <= 7) return 'summer';
      if (month >= 8 && month <= 10) return 'autumn';
      return 'winter';
    };
    
    setCurrentSeason(determineCurrentSeason());
  }, []);

  // Get current weather
  useEffect(() => {
    // For now, we'll use mock weather data
    // In a real app, this would use the user's location and a weather API
    const weather = generateRandomWeather();
    setCurrentWeather(weather);
  }, []);

  // Generate outfits based on weather, season, and wardrobe
  const generateOutfits = () => {
    setIsGenerating(true);
    
    try {
      if (!clothingItems || clothingItems.length === 0) {
        setGeneratedOutfits([]);
        setIsGenerating(false);
        return;
      }

      // Group items by type
      const tops = clothingItems.filter(item => 
        ['shirt', 't-shirt', 'blouse', 'tank-top', 'crop-top', 'sweater', 'sweatshirt', 'hoodie', 'top'].includes(item.type)
      );
      
      const bottoms = clothingItems.filter(item => 
        ['pants', 'jeans', 'shorts', 'skirt', 'leggings', 'joggers', 'sweatpants', 'bottom'].includes(item.type)
      );
      
      const shoes = clothingItems.filter(item => 
        ['sneakers', 'boots', 'sandals', 'heels', 'flats', 'loafers', 'shoes'].includes(item.type)
      );
      
      const outerwear = clothingItems.filter(item => 
        ['jacket', 'blazer', 'coat', 'windbreaker', 'vest', 'cardigan', 'outerwear'].includes(item.type)
      );
      
      const accessories = clothingItems.filter(item => 
        ['belt', 'scarf', 'hat', 'gloves', 'bag', 'jewelry', 'sunglasses', 'accessory', 'accessories'].includes(item.type)
      );

      // Check if we have essential items
      if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
        setGeneratedOutfits([]);
        setIsGenerating(false);
        return;
      }

      // Filter by season
      const filterBySeason = (items: ClothingItem[]): ClothingItem[] => {
        return items.filter(item => 
          !item.season || 
          (Array.isArray(item.season) && (item.season.includes(currentSeason) || item.season.includes('all')))
        );
      };

      const seasonalTops = filterBySeason(tops);
      const seasonalBottoms = filterBySeason(bottoms);
      const seasonalShoes = filterBySeason(shoes);
      const seasonalOuterwear = filterBySeason(outerwear);
      const seasonalAccessories = filterBySeason(accessories);

      // If we don't have enough seasonal items, use all items
      const availableTops = seasonalTops.length >= 2 ? seasonalTops : tops;
      const availableBottoms = seasonalBottoms.length >= 2 ? seasonalBottoms : bottoms;
      const availableShoes = seasonalShoes.length >= 2 ? seasonalShoes : shoes;
      
      // Generate 3 unique outfits
      const outfits: Outfit[] = [];
      const usedItemIds = new Set<string>();
      
      // Create outfit names
      const outfitNames = [
        `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Daily Look`,
        `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Casual Style`,
        `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Ensemble`
      ];
      
      for (let i = 0; i < 3; i++) {
        if (outfits.length >= 3) break;
        
        // Try to avoid reusing items
        const availableUnusedTops = availableTops.filter(item => !usedItemIds.has(item.id));
        const availableUnusedBottoms = availableBottoms.filter(item => !usedItemIds.has(item.id));
        const availableUnusedShoes = availableShoes.filter(item => !usedItemIds.has(item.id));
        
        // If we don't have enough unused items, allow reuse
        const topOptions = availableUnusedTops.length > 0 ? availableUnusedTops : availableTops;
        const bottomOptions = availableUnusedBottoms.length > 0 ? availableUnusedBottoms : availableBottoms;
        const shoeOptions = availableUnusedShoes.length > 0 ? availableUnusedShoes : availableShoes;
        
        if (topOptions.length === 0 || bottomOptions.length === 0 || shoeOptions.length === 0) {
          break; // Can't create more outfits
        }
        
        // Randomly select items
        const top = topOptions[Math.floor(Math.random() * topOptions.length)];
        const bottom = bottomOptions[Math.floor(Math.random() * bottomOptions.length)];
        const shoe = shoeOptions[Math.floor(Math.random() * shoeOptions.length)];
        
        // Mark items as used
        usedItemIds.add(top.id);
        usedItemIds.add(bottom.id);
        usedItemIds.add(shoe.id);
        
        // Add outerwear based on temperature if available
        const needsOuterwear = currentWeather && currentWeather.temperature && currentWeather.temperature < 18;
        let outerwearItem: ClothingItem | undefined;
        
        if (needsOuterwear && seasonalOuterwear.length > 0) {
          outerwearItem = seasonalOuterwear[Math.floor(Math.random() * seasonalOuterwear.length)];
          usedItemIds.add(outerwearItem.id);
        }
        
        // Add accessory if available (30% chance)
        let accessoryItem: ClothingItem | undefined;
        if (seasonalAccessories.length > 0 && Math.random() < 0.3) {
          accessoryItem = seasonalAccessories[Math.floor(Math.random() * seasonalAccessories.length)];
          usedItemIds.add(accessoryItem.id);
        }
        
        // Create outfit with selected items
        const outfitItems = [top.id, bottom.id, shoe.id];
        if (outerwearItem) outfitItems.push(outerwearItem.id);
        if (accessoryItem) outfitItems.push(accessoryItem.id);
        
        // Determine occasion based on items
        const occasions = [
          'casual', // Default
          ...(top.occasions || []),
          ...(bottom.occasions || []),
          ...(shoe.occasions || [])
        ];
        
        // Count frequency of each occasion and find the most common
        const occasionCounts: Record<string, number> = {};
        let mostCommonOccasion = 'casual';
        let maxCount = 0;
        
        occasions.forEach(occasion => {
          occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
          if (occasionCounts[occasion] > maxCount) {
            maxCount = occasionCounts[occasion];
            mostCommonOccasion = occasion;
          }
        });
        
        // Create outfit colors list
        const colors = [
          ...(top.color ? [top.color] : []),
          ...(bottom.color ? [bottom.color] : []),
          ...(shoe.color ? [shoe.color] : []),
          ...(outerwearItem?.color ? [outerwearItem.color] : []),
          ...(accessoryItem?.color ? [accessoryItem.color] : [])
        ];
        
        outfits.push({
          id: `olivia-suggestion-${i}`,
          name: outfitNames[i] || `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Outfit`,
          items: outfitItems,
          seasons: [currentSeason],
          occasions: [mostCommonOccasion],
          occasion: mostCommonOccasion,
          colors: colors,
          personality_tags: ['trendy', 'casual'],
          dateAdded: new Date()
        });
      }
      
      setGeneratedOutfits(outfits);
    } catch (error) {
      console.error('Error generating outfits:', error);
      toast.error('Failed to generate outfit suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate outfits when clothing items or weather change
  useEffect(() => {
    if (!isLoadingItems && clothingItems && clothingItems.length > 0) {
      generateOutfits();
    }
  }, [isLoadingItems, clothingItems, currentSeason, currentWeather]);

  return {
    outfits: generatedOutfits,
    isGenerating,
    weather: currentWeather,
    season: currentSeason,
    refreshOutfits: generateOutfits,
    isLoading: isGenerating || isLoadingItems
  };
};
