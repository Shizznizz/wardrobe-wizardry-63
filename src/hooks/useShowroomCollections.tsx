
import { useState } from 'react';
import { toast } from 'sonner';
import { ClothingItem, Outfit } from '@/lib/types';

export const useShowroomCollections = (sampleOutfits: Outfit[] = [], sampleClothingItems: ClothingItem[] = []) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);

  // Ensure sampleOutfits and sampleClothingItems are arrays
  const safeOutfits = Array.isArray(sampleOutfits) ? sampleOutfits : [];
  const safeClothingItems = Array.isArray(sampleClothingItems) ? sampleClothingItems : [];

  // Create collections with safe arrays
  const fashionCollections = [
    {
      id: 'recommended',
      name: 'Olivia\'s Picks',
      description: 'Personalized recommendations based on your style profile',
      outfits: safeOutfits.slice(0, 4),
    },
    {
      id: 'wardrobe',
      name: 'Your Outfits',
      description: 'Outfits you\'ve created and saved',
      outfits: safeOutfits.slice(0, 3),
    },
    {
      id: 'business',
      name: 'Business Casual',
      description: 'Professional looks that maintain comfort and style',
      outfits: safeOutfits.slice(2, 6),
      premium: true,
    },
    {
      id: 'summer',
      name: 'Summer Breeze',
      description: 'Light and airy ensembles for warm weather',
      outfits: safeOutfits.slice(1, 5),
      premium: true,
    },
    {
      id: 'winter',
      name: 'Winter Formal',
      description: 'Elegant outfits for colder months and special occasions',
      outfits: safeOutfits.slice(3, 7),
      premium: true,
    },
  ];

  const handleAddItem = (item: ClothingItem) => {
    if (!item) return;
    
    setSelectedItems(prev => [...prev, item]);
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
    setSelectedItems,  // Ensure this is exposed
    handleAddItem,
    handleTryOnTrendingItem,
    handleSuggestAnotherOutfit,
    clothingItems: safeClothingItems
  };
};
