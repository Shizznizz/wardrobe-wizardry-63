
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import OutfitBuilder from '@/components/OutfitBuilder';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import OutfitHero from '@/components/outfits/OutfitHero';
import RecommendedOutfit from '@/components/outfits/RecommendedOutfit';
import OutfitCollection from '@/components/outfits/OutfitCollection';
import { useOutfitState } from '@/hooks/useOutfitState';
import StyleSituation from '@/components/StyleSituation';
import RecommendedOutfits from '@/components/outfits/RecommendedOutfits';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { toast } from 'sonner';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import OptimizedOliviaAssistant from '@/components/outfits/OptimizedOliviaAssistant';
import SummonOliviaButton from '@/components/outfits/SummonOliviaButton';
import { useOliviaAssistant } from '@/hooks/useOliviaAssistant';

const Outfits = () => {
  const navigate = useNavigate();
  const [locationUpdated, setLocationUpdated] = useState(false);
  const { savedLocation } = useLocationStorage();
  
  const {
    outfits,
    clothingItems,
    isBuilderOpen,
    selectedOutfit,
    weatherBackground,
    handleCreateOutfit,
    handleEditOutfit,
    handleSaveOutfit,
    handleDeleteOutfit,
    handleToggleFavorite,
    handleRefreshOutfit,
    outfitLogs,
    addOutfitLog,
    setIsBuilderOpen
  } = useOutfitState(sampleOutfits, sampleClothingItems);

  const {
    assistantState,
    hideTips,
    setHideTips,
    closeAssistant,
    showOutfitRecommendation,
    showOutfitSaved,
    showFeedbackResponse,
    summonOlivia
  } = useOliviaAssistant();

  // Handle when an outfit is added to the calendar
  const handleOutfitAddedToCalendar = (log: OutfitLog) => {
    addOutfitLog(log);
    toast.success(`Outfit added to calendar for ${new Date(log.date).toLocaleDateString()}`);
    // Optional: navigate to calendar with the date pre-selected
    // navigate(`/calendar?date=${new Date(log.date).toISOString().split('T')[0]}`);
  };
  
  // Set location updated flag when location is saved
  useEffect(() => {
    if (savedLocation && !locationUpdated) {
      setLocationUpdated(true);
    }
  }, [savedLocation]);
  
  // Show initial recommendation when outfits load
  useEffect(() => {
    if (outfits.length > 0 && !hideTips) {
      const timeoutId = setTimeout(() => {
        showOutfitRecommendation(outfits[0], 'current');
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [outfits, hideTips, showOutfitRecommendation]);
  
  // Handle feedback actions from RecommendedOutfit component
  const handleFeedbackAction = (feedbackType: string, outfit: any) => {
    showFeedbackResponse(feedbackType, outfit);
    
    // For some feedback types, we'll also refresh the outfit
    if (['dislike', 'warmer', 'change-top'].includes(feedbackType)) {
      handleRefreshOutfit();
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${weatherBackground} text-white transition-colors duration-700 overflow-x-hidden`}>
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-full">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <OutfitHero />
            
            <StyleSituation />
          </div>
      
          <RecommendedOutfit 
            outfit={outfits[0]} 
            clothingItems={clothingItems}
            onRefreshOutfit={() => {
              handleRefreshOutfit();
              // Show assistant message after refreshing outfit
              setTimeout(() => {
                showOutfitRecommendation(outfits[0], 'current');
              }, 500);
            }}
            onOutfitAddedToCalendar={handleOutfitAddedToCalendar}
            onFeedbackAction={handleFeedbackAction}
          />
          
          <OutfitCollection 
            outfits={outfits}
            onCreateOutfit={handleCreateOutfit}
            onEditOutfit={handleEditOutfit}
            onDeleteOutfit={handleDeleteOutfit}
            onToggleFavorite={(id) => {
              handleToggleFavorite(id);
              // Find the outfit that was favorited
              const outfit = outfits.find(o => o.id === id);
              if (outfit) {
                if (outfit.favorite) {
                  showOutfitSaved(outfit);
                }
              }
            }}
            clothingItems={clothingItems}
            onOutfitAddedToCalendar={handleOutfitAddedToCalendar}
          />
          
          <RecommendedOutfits className="pt-8" />
          
          <AnimatePresence>
            {isBuilderOpen && (
              <OutfitBuilder
                isOpen={isBuilderOpen}
                onClose={() => setIsBuilderOpen(false)}
                onSave={handleSaveOutfit}
                clothingItems={clothingItems}
                initialOutfit={selectedOutfit}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      
      {/* Optimized Olivia Assistant */}
      <OptimizedOliviaAssistant
        show={assistantState.show}
        message={assistantState.message}
        trigger={assistantState.trigger}
        outfit={assistantState.outfit}
        onClose={closeAssistant}
        onAction={assistantState.onAction}
        actionText={assistantState.actionText}
        position="bottom"
        hideTipsPreference={hideTips}
        setHideTipsPreference={setHideTips}
      />
      
      {/* Summon Olivia Button */}
      <SummonOliviaButton
        position="bottom-right"
        onSummon={summonOlivia}
        tooltip="Get style advice from Olivia"
      />
    </div>
  );
};

export default Outfits;
