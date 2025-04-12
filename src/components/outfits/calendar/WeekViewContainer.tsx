
import React from 'react';
import { motion } from 'framer-motion';
import WeekView from './WeekView';
import DayDetailView from './DayDetailView';
import WardrobeRecommendations from './WardrobeRecommendations';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Outfit, ClothingItem } from '@/lib/types';

interface WeekViewContainerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  outfitLogsOnDate: OutfitLog[];
  rarelyWornOutfits: Outfit[];
  frequentlyWornOutfits: Outfit[];
  getOutfitById: (id: string) => Outfit | undefined;
  getLogsForDay: (date: Date) => OutfitLog[];
  handleOpenLogDialog: (date: Date) => void;
  handleEditLog: (log: OutfitLog) => void;
  handleDeleteLog: (id: string) => void;
  handleSelectOutfit: (outfitId: string) => void;
  getSeasonalSuggestions: (outfits: Outfit[], clothingItems: ClothingItem[]) => any;
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const WeekViewContainer = ({
  selectedDate,
  setSelectedDate,
  outfitLogsOnDate,
  rarelyWornOutfits,
  frequentlyWornOutfits,
  getOutfitById,
  getLogsForDay,
  handleOpenLogDialog,
  handleEditLog,
  handleDeleteLog,
  handleSelectOutfit,
  getSeasonalSuggestions,
  outfits,
  clothingItems
}: WeekViewContainerProps) => {
  return (
    <motion.div
      key="week-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 gap-4"
    >
      <WeekView
        currentDate={selectedDate || new Date()}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        getLogsForDay={getLogsForDay}
        getOutfitById={getOutfitById}
        handleOpenLogDialog={handleOpenLogDialog}
      />
      
      {selectedDate && (
        <DayDetailView
          selectedDate={selectedDate}
          outfitLogs={outfitLogsOnDate}
          getOutfitById={getOutfitById}
          handleOpenLogDialog={handleOpenLogDialog}
          handleEditLog={handleEditLog}
          handleDeleteLog={handleDeleteLog}
        />
      )}
      
      <WardrobeRecommendations
        rarelyWornOutfits={rarelyWornOutfits}
        frequentlyWornOutfits={frequentlyWornOutfits}
        handleSelectOutfit={handleSelectOutfit}
        seasonalSuggestions={getSeasonalSuggestions(outfits, clothingItems)}
      />
    </motion.div>
  );
};

export default WeekViewContainer;
