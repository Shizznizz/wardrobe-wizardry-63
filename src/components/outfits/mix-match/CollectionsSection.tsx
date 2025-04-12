
import React from 'react';
import OutfitCollectionPreview from '@/components/outfits/OutfitCollectionPreview';
import { Outfit, ClothingItem } from '@/lib/types';

interface CollectionsSectionProps {
  personalOutfits: Outfit[];
  popularOutfits: Outfit[];
  sampleOutfits: Outfit[];
  clothingItems: ClothingItem[];
}

const CollectionsSection = ({ 
  personalOutfits, 
  popularOutfits, 
  sampleOutfits,
  clothingItems 
}: CollectionsSectionProps) => {
  return (
    <>
      {/* Personal Collection - Lazy load images */}
      <section className="mb-8">
        <OutfitCollectionPreview
          title="My Outfit Collection"
          description="Outfits you've created and saved"
          outfits={personalOutfits.length ? personalOutfits : sampleOutfits.slice(0, 4)}
          clothingItems={clothingItems}
          viewAllLink="/outfits"
        />
      </section>
      
      {/* Popular Outfits - Lazy load images */}
      <section>
        <OutfitCollectionPreview
          title="Popular Today"
          description="Trending outfits loved by the community"
          outfits={popularOutfits.slice(0, 4)}
          clothingItems={clothingItems}
        />
      </section>
    </>
  );
};

export default CollectionsSection;
