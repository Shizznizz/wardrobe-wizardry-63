
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outfit, ClothingItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import OutfitCollection from '@/components/outfits/OutfitCollection';

interface OutfitSelectionSectionProps {
  fashionCollections: any[];
  clothingItems: ClothingItem[];
  selectedOutfit: Outfit | null;
  isPremiumUser: boolean;
  onSelectOutfit: (outfit: Outfit) => void;
}

const OutfitSelectionSection = ({
  fashionCollections,
  clothingItems,
  selectedOutfit,
  isPremiumUser,
  onSelectOutfit
}: OutfitSelectionSectionProps) => {
  const { isAuthenticated } = useAuth();
  const effectivePremiumUser = isPremiumUser || isAuthenticated;
  const [activeCollection, setActiveCollection] = useState(fashionCollections[0]?.id || 'recommended');
  
  // Filter collections - show premium ones only to premium or authenticated users
  const visibleCollections = fashionCollections.filter(collection => 
    !collection.premium || effectivePremiumUser
  );

  // Function to handle outfit selection and forward it to parent component
  const handleOutfitSelection = (outfit: Outfit) => {
    onSelectOutfit(outfit);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Outfit Collections</h2>
      <ScrollArea className="rounded-md border border-white/[0.15] bg-black/[0.1] backdrop-blur-sm">
        <div className="flex flex-nowrap gap-4 p-3">
          {visibleCollections.map(collection => (
            <motion.button
              key={collection.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200
                ${activeCollection === collection.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white/90'
                }`}
              onClick={() => setActiveCollection(collection.id)}
            >
              {collection.name}
            </motion.button>
          ))}
        </div>
      </ScrollArea>
      
      {visibleCollections.map(collection => (
        <div key={collection.id} className={collection.id === activeCollection ? 'block' : 'hidden'}>
          <OutfitCollection
            outfits={collection.outfits}
            clothingItems={clothingItems}
            onCreateOutfit={() => {}}
            onEditOutfit={() => {}}
            onDeleteOutfit={() => {}}
            onToggleFavorite={() => {}}
            onOutfitAddedToCalendar={() => {}}
            onSelectOutfit={handleOutfitSelection}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default OutfitSelectionSection;
