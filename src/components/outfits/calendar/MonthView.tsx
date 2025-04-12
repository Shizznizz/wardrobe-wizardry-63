
import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, getDaysInMonth, getDay, addDays, isSameDay, isToday } from 'date-fns';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  outfits: Outfit[];
  outfitLogs: any[];
  outfitLogsOnDate: any[];
  rarelyWornOutfits: Outfit[];
  frequentlyWornOutfits: Outfit[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleViewLog: (log: any) => void;
  handleOpenLogDialog: (date: Date) => void;
  handleDeleteLog: (id: string) => Promise<boolean>;
  handleSelectOutfit: (outfitId: string) => void;
  getSeasonalSuggestions: (outfits: Outfit[], clothingItems: any[]) => Outfit[];
  clothingItems: any[];
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
  handleDeleteLog 
}: MonthViewProps) => {
  const startOfCurrentMonth = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(startOfCurrentMonth);
  const startDay = getDay(startOfCurrentMonth);
  
  // Array to hold all days in the current month view (including padding days)
  const daysArray = Array.from({ length: 42 }, (_, i) => {
    const dayOffset = i - startDay;
    const currentDayDate = addDays(startOfCurrentMonth, dayOffset);
    return {
      date: currentDayDate,
      isCurrentMonth: dayOffset >= 0 && dayOffset < daysInMonth,
      hasOutfit: outfitLogs.some(log => isSameDay(new Date(log.date), currentDayDate)),
      outfitCount: outfitLogs.filter(log => isSameDay(new Date(log.date), currentDayDate)).length
    };
  });
  
  // Break days into weeks for rendering
  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    weeks.push(daysArray.slice(i, i + 7));
  }

  const handleLogDeleteWrapper = async (id: string): Promise<boolean> => {
    try {
      await handleDeleteLog(id);
      return true;
    } catch (error) {
      console.error("Error deleting log:", error);
      return false;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <Button
                key={`${weekIndex}-${dayIndex}`}
                variant={isToday(day.date) ? "default" : day.isCurrentMonth ? "outline" : "ghost"}
                className={`
                  p-1 h-auto min-h-[70px] flex flex-col items-center justify-center relative
                  ${day.isCurrentMonth ? 'text-white' : 'text-gray-400 opacity-40'}
                  ${day.hasOutfit && day.isCurrentMonth ? 'bg-primary/10 hover:bg-primary/20' : ''}
                `}
                onClick={() => setSelectedDate(day.date)}
              >
                <span className="text-xs">{format(day.date, 'd')}</span>
                {day.outfitCount > 0 && (
                  <span className="text-xs mt-1 bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {day.outfitCount}
                  </span>
                )}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MonthView;
