
import React from 'react';
import { motion } from 'framer-motion';
import DateSelector from './DateSelector';
import OutfitLogsList from './OutfitLogsList';
import WardrobeRecommendations from './WardrobeRecommendations';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Outfit, ClothingItem } from '@/lib/types';

interface MonthViewProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  outfitLogs: OutfitLog[];
  outfitLogsOnDate: OutfitLog[];
  rarelyWornOutfits: Outfit[];
  frequentlyWornOutfits: Outfit[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleViewLog: (log: OutfitLog) => void;
  handleOpenLogDialog: (date: Date) => void;
  handleDeleteLog: (id: string) => void;
  handleSelectOutfit: (outfitId: string) => void;
  getSeasonalSuggestions: (outfits: Outfit[], clothingItems: ClothingItem[]) => any;
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  isMobile: boolean;
}

const MonthView = ({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  outfitLogs,
  outfitLogsOnDate,
  rarelyWornOutfits,
  frequentlyWornOutfits,
  getOutfitById,
  handleViewLog,
  handleOpenLogDialog,
  handleDeleteLog,
  handleSelectOutfit,
  getSeasonalSuggestions,
  outfits,
  clothingItems,
  isMobile
}: MonthViewProps) => {
  return (
    <motion.div 
      key="month-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}
    >
      <DateSelector 
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        outfitLogs={outfitLogs}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />
      
      <OutfitLogsList 
        selectedDate={selectedDate}
        outfitLogsOnDate={outfitLogsOnDate}
        getOutfitById={getOutfitById}
        handleViewLog={handleViewLog}
        handleOpenLogDialog={handleOpenLogDialog}
        handleDeleteLog={handleDeleteLog}
      />
      
      <WardrobeRecommendations
        rarelyWornOutfits={rarelyWornOutfits}
        frequentlyWornOutfits={frequentlyWornOutfits}
        handleSelectOutfit={handleSelectOutfit}
        seasonalSuggestions={getSeasonalSuggestions(outfits, clothingItems)}
      />
    </motion.div>
  );
};

export default MonthView;
