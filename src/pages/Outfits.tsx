
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import OutfitBuilder from '@/components/OutfitBuilder';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import OutfitHero from '@/components/outfits/OutfitHero';
import OutfitTips from '@/components/outfits/OutfitTips';
import RecommendedOutfit from '@/components/outfits/RecommendedOutfit';
import OutfitCollection from '@/components/outfits/OutfitCollection';
import { useOutfitState } from '@/hooks/useOutfitState';

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
    setShowAssistant
  } = useOutfitState(sampleOutfits, sampleClothingItems);
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const outfitTips = [
    {
      id: 1,
      title: "Color Harmony",
      content: "For this weather, try combining cool blues with warm accents for a balanced look that matches the day's mood."
    },
    {
      id: 2,
      title: "Layering Strategy",
      content: "The temperature will vary today. Layer a light cardigan over your outfit that you can easily remove as it warms up."
    },
    {
      id: 3,
      title: "Accessory Advice",
      content: "Complete your look with a statement piece that brightens your outfit - perfect for boosting your mood on this type of day."
    }
  ];
  
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
            <OutfitTips 
              tips={outfitTips} 
              onShowAssistant={handleShowTips}
              showAssistant={showAssistant}
            />
          </div>
      
          {/* Today's Recommended Outfit Section */}
          <RecommendedOutfit 
            outfit={outfits[0]} 
            clothingItems={clothingItems}
            onRefreshOutfit={handleRefreshOutfit}
          />
          
          {/* User's Outfit Collection */}
          <OutfitCollection 
            outfits={outfits}
            onCreateOutfit={handleCreateOutfit}
            onEditOutfit={handleEditOutfit}
            onDeleteOutfit={handleDeleteOutfit}
            onToggleFavorite={handleToggleFavorite}
            clothingItems={clothingItems}
          />
          
          {/* Outfit Builder Section */}
          <OutfitBuilder
            isOpen={isBuilderOpen}
            onClose={() => handleCreateOutfit()}
            onSave={handleSaveOutfit}
            clothingItems={clothingItems}
            initialOutfit={selectedOutfit}
          />
        </motion.div>
      </main>
      
      {showAssistant && (
        <OliviaBloomAssistant
          message={outfitTips[currentTipIndex].content}
          type="tip"
          timing="medium"
          actionText="Got it!"
          onAction={handleAssistantAction}
          position="bottom-right"
        />
      )}
    </div>
  );
};

export default Outfits;
