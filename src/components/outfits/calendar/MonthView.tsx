
import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, getDaysInMonth, getDay, addDays, isSameDay, isToday } from 'date-fns';
import { Outfit, ClothingItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import MonthlyCalendarView from './MonthlyCalendarView';

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  outfitLogsOnDate: OutfitLog[];
  rarelyWornOutfits: Outfit[];
  frequentlyWornOutfits: Outfit[];
  getOutfitById: (outfit: any) => Outfit | undefined;
  handleViewLog: (log: OutfitLog) => void;
  handleOpenLogDialog: (date: Date) => void;
  handleDeleteLog: (id: string) => Promise<boolean>;
  handleSelectOutfit: (outfitId: string) => void;
  getSeasonalSuggestions: (outfits: Outfit[], clothingItems: ClothingItem[]) => Outfit[];
  clothingItems: ClothingItem[];
  isMobile: boolean;
}

const MonthView = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  outfits,
  outfitLogs,
  handleOpenLogDialog,
  handleDeleteLog,
  getOutfitById
}: MonthViewProps) => {
  // Function to get logs for a specific day
  const getLogsForDay = (day: Date) => {
    return outfitLogs.filter(log => 
      log.date && isSameDay(new Date(log.date), day)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main calendar grid */}
        <MonthlyCalendarView
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          getLogsForDay={getLogsForDay}
          getOutfitById={id => outfits.find(o => o.id === id)}
          onAddLog={() => handleOpenLogDialog(selectedDate)}
        />
        
        {/* You can add additional panels here for recommendations or trending outfits */}
      </div>
    </motion.div>
  );
};

export default MonthView;
