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
import EnhancedStyleContext from '@/components/outfits/EnhancedStyleContext';
import OutfitGroupsSection from '@/components/outfits/OutfitGroupsSection';
import QuickFilters from '@/components/outfits/QuickFilters';
import { ClothingSeason } from '@/lib/types';

const Outfits = () => {
  const navigate = useNavigate();
  const [locationUpdated, setLocationUpdated] = useState(false);
  const { savedLocation } = useLocationStorage();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  
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

  const safeOutfits = Array.isArray(outfits) ? outfits : [];

  const handleOutfitAddedToCalendar = (log: OutfitLog) => {
    addOutfitLog(log);
    toast.success(`Outfit added to calendar for ${new Date(log.date).toLocaleDateString()}`);
    // Optional: navigate to calendar with the date pre-selected
    // navigate(`/calendar?date=${new Date(log.date).toISOString().split('T')[0]}`);
  };

  useEffect(() => {
    if (savedLocation && !locationUpdated) {
      setLocationUpdated(true);
    }
  }, [savedLocation]);
  
  useEffect(() => {
    if (safeOutfits.length > 0 && !hideTips) {
      const timeoutId = setTimeout(() => {
        if (safeOutfits[0]) {
          showOutfitRecommendation(safeOutfits[0], 'current');
        }
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [safeOutfits, hideTips, showOutfitRecommendation]);
  
  const handleFeedbackAction = (feedbackType: string, outfit: any) => {
    showFeedbackResponse(feedbackType, outfit);
    
    if (['dislike', 'warmer', 'change-top'].includes(feedbackType)) {
      handleRefreshOutfit();
    }
  };
  
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };
  
  const toggleOwnedOnly = () => {
    setShowOwnedOnly(!showOwnedOnly);
    toast.success(showOwnedOnly 
      ? "Showing all outfits" 
      : "Showing only outfits with items you own", 
      { duration: 2000 }
    );
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const groupedOutfits = safeOutfits.reduce((groups, outfit) => {
    if (!outfit) return groups;
    
    const safeOutfit = {
      ...outfit,
      seasons: Array.isArray(outfit.seasons) ? outfit.seasons : [],
      occasions: Array.isArray(outfit.occasions) ? outfit.occasions : [],
      tags: Array.isArray(outfit.tags) ? outfit.tags : [],
      colors: Array.isArray(outfit.colors) ? outfit.colors : []
    };
    
    if (activeFilters.length > 0) {
      const matchesFilters = activeFilters.some(filter => 
        safeOutfit.seasons.includes(filter as ClothingSeason) || 
        safeOutfit.occasions.includes(filter) ||
        (safeOutfit.colors && safeOutfit.colors.includes(filter))
      );
      
      if (!matchesFilters) return groups;
    }
    
    if (showOwnedOnly) {
      const userOwnsItems = Math.random() > 0.5;
      if (!userOwnsItems) return groups;
    }
    
    let group = 'Other';
    
    if ((safeOutfit.tags && safeOutfit.tags.includes('casual')) || safeOutfit.occasions.includes('casual')) {
      group = 'Casual & Comfortable';
    } else if ((safeOutfit.tags && safeOutfit.tags.includes('formal')) || safeOutfit.occasions.includes('formal')) {
      group = 'Elegant & Formal';
    } else if (safeOutfit.seasons.includes('summer')) {
      group = 'Summer Ready';
    } else if (safeOutfit.seasons.includes('winter')) {
      group = 'Winter Warmth';
    }
    
    if (!groups[group]) {
      groups[group] = [];
    }
    
    groups[group].push(safeOutfit);
    return groups;
  }, {} as Record<string, typeof outfits>);

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
          <div className="flex flex-col lg:flex-row items-start gap-6 mb-12">
            <OutfitHero />
            
            <div className="w-full lg:w-3/5">
              <EnhancedStyleContext />
            </div>
          </div>
          
          {!selectedOutfit && !hideTips && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4 text-center mb-8"
            >
              <p className="text-white/90 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                  alt="Olivia" 
                  className="w-6 h-6 rounded-full border border-purple-400/30 mr-2" 
                />
                <span>Stuck on what to wear? Describe your day and I'll suggest the perfect outfit for you!</span>
              </p>
            </motion.div>
          )}
      
          <QuickFilters 
            onFilterChange={handleFilterChange} 
            toggleOwnedOnly={toggleOwnedOnly} 
            showOwnedOnly={showOwnedOnly}
          />
          
          <RecommendedOutfit 
            outfit={outfits[0]} 
            clothingItems={clothingItems}
            onRefreshOutfit={() => {
              handleRefreshOutfit();
              setTimeout(() => {
                showOutfitRecommendation(outfits[0], 'current');
              }, 500);
            }}
            onOutfitAddedToCalendar={handleOutfitAddedToCalendar}
            onFeedbackAction={handleFeedbackAction}
          />
          
          {Object.keys(groupedOutfits).length > 0 ? (
            <OutfitGroupsSection 
              groupedOutfits={groupedOutfits}
              onToggleFavorite={(id) => {
                handleToggleFavorite(id);
                const outfit = outfits.find(o => o.id === id);
                if (outfit) {
                  if (outfit.favorite) {
                    showOutfitSaved(outfit);
                  }
                }
              }}
              onOutfitAddedToCalendar={handleOutfitAddedToCalendar}
              clothingItems={clothingItems}
            />
          ) : (
            <OutfitCollection 
              outfits={outfits}
              onCreateOutfit={handleCreateOutfit}
              onEditOutfit={handleEditOutfit}
              onDeleteOutfit={handleDeleteOutfit}
              onToggleFavorite={(id) => {
                handleToggleFavorite(id);
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
          )}
          
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
      
      <SummonOliviaButton
        position="bottom-right"
        onSummon={summonOlivia}
        tooltip="Get style advice from Olivia"
      />
    </div>
  );
};

export default Outfits;
