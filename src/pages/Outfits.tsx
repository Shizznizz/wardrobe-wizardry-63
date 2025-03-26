
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import OutfitBuilder from '@/components/OutfitBuilder';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import OutfitHero from '@/components/outfits/OutfitHero';
import RecommendedOutfit from '@/components/outfits/RecommendedOutfit';
import OutfitCollection from '@/components/outfits/OutfitCollection';
import { useOutfitState } from '@/hooks/useOutfitState';
import OliviaTips from '@/components/OliviaTips';
import StyleSituation from '@/components/StyleSituation';

const Outfits = () => {
  const {
    outfits,
    clothingItems,
    isBuilderOpen,
    selectedOutfit,
    showAssistant,
    weatherBackground,
    handleCreateOutfit,
    handleEditOutfit,
    handleSaveOutfit,
    handleDeleteOutfit,
    handleToggleFavorite,
    handleAssistantAction,
    handleRefreshOutfit,
    handleShowTips,
    setShowAssistant,
    setIsBuilderOpen
  } = useOutfitState(sampleOutfits, sampleClothingItems);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${weatherBackground} text-white transition-colors duration-700`}>
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <OutfitHero onCreateOutfit={handleCreateOutfit} />
            
            <StyleSituation />
          </div>
      
          <RecommendedOutfit 
            outfit={outfits[0]} 
            clothingItems={clothingItems}
            onRefreshOutfit={handleRefreshOutfit}
          />
          
          <OutfitCollection 
            outfits={outfits}
            onCreateOutfit={handleCreateOutfit}
            onEditOutfit={handleEditOutfit}
            onDeleteOutfit={handleDeleteOutfit}
            onToggleFavorite={handleToggleFavorite}
            clothingItems={clothingItems}
          />
          
          <OutfitBuilder
            isOpen={isBuilderOpen}
            onClose={() => setIsBuilderOpen(false)}
            onSave={handleSaveOutfit}
            clothingItems={clothingItems}
            initialOutfit={selectedOutfit}
          />
        </motion.div>
      </main>
      
      <OliviaTips position="top-right" />
      
      {showAssistant && (
        <OliviaBloomAssistant
          message="I've created a style suggestion based on the current weather and your preferences."
          type="tip"
          timing="medium"
          actionText="Thanks!"
          onAction={handleAssistantAction}
          position="bottom-right"
        />
      )}
    </div>
  );
};

export default Outfits;
