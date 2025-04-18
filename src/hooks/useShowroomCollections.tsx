
import { useState } from 'react';
import { toast } from 'sonner';
import { ClothingItem, Outfit } from '@/lib/types';

export const useShowroomCollections = (sampleOutfits: Outfit[] = [], sampleClothingItems: ClothingItem[] = []) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);

  // Ensure sampleOutfits and sampleClothingItems are arrays
  const safeOutfits = Array.isArray(sampleOutfits) ? sampleOutfits : [];
  const safeClothingItems = Array.isArray(sampleClothingItems) ? sampleClothingItems : [];

  // Create collections with safe arrays and ensure each outfit array is safe too
  const fashionCollections = [
    {
      id: 'recommended',
      name: 'Olivia\'s Picks',
      description: 'Personalized recommendations based on your style profile',
      outfits: safeOutfits.length > 4 ? safeOutfits.slice(0, 4) : [...safeOutfits],
      premium: false
    },
    {
      id: 'wardrobe',
      name: 'Your Outfits',
      description: 'Outfits you\'ve created and saved',
      outfits: safeOutfits.length > 3 ? safeOutfits.slice(0, 3) : [...safeOutfits],
      premium: false
    },
    {
      id: 'business',
      name: 'Business Casual',
      description: 'Professional looks that maintain comfort and style',
      outfits: safeOutfits.length > 6 ? safeOutfits.slice(2, 6) : (safeOutfits.length > 2 ? safeOutfits.slice(2) : []),
      premium: true,
    },
    {
      id: 'summer',
      name: 'Summer Breeze',
      description: 'Light and airy ensembles for warm weather',
      outfits: safeOutfits.length > 5 ? safeOutfits.slice(1, 5) : (safeOutfits.length > 1 ? safeOutfits.slice(1) : []),
      premium: true,
    },
    {
      id: 'winter',
      name: 'Winter Formal',
      description: 'Elegant outfits for colder months and special occasions',
      outfits: safeOutfits.length > 7 ? safeOutfits.slice(3, 7) : (safeOutfits.length > 3 ? safeOutfits.slice(3) : []),
      premium: true,
    },
  ];

  const handleAddItem = (item: ClothingItem) => {
    if (!item) return;
    
    setSelectedItems(prev => {
      // Ensure prev is an array
      const safePrev = Array.isArray(prev) ? prev : [];
      return [...safePrev, item];
    });
    toast.success(`Added ${item.name} to your outfit!`);
  };

  const handleTryOnTrendingItem = (item: ClothingItem, isPremiumUser: boolean) => {
    if (!item || !isPremiumUser) {
      return false;
    }
    
    // For now, just show a placeholder behavior
    toast.success(`Preparing to try on ${item.name}...`);
    return item.imageUrl;
  };

  const handleSuggestAnotherOutfit = (handleTryOnOutfit: (outfit: Outfit) => void) => {
    // Find recommended collection
    const recommendedCollection = fashionCollections.find(c => c.id === 'recommended');
    if (!recommendedCollection) return;
    
    const recommendedOutfits = Array.isArray(recommendedCollection.outfits) ? recommendedCollection.outfits : [];
    
    if (recommendedOutfits.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendedOutfits.length);
      const randomOutfit = recommendedOutfits[randomIndex];
      
      if (randomOutfit) {
        handleTryOnOutfit(randomOutfit);
        toast.success('Olivia suggested a new outfit for you!');
      }
    }
  };

  return {
    fashionCollections,
    selectedItems,
    setSelectedItems,
    handleAddItem,
    handleTryOnTrendingItem,
    handleSuggestAnotherOutfit,
    clothingItems: safeClothingItems
  };
};
