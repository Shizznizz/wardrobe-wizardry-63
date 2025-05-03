import React from 'react';
import { motion } from 'framer-motion';
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClothingItem, Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import DayDetailView from './DayDetailView';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeekViewContainerProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate?: (date: Date) => void;
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  outfitLogs: OutfitLog[];
  outfitLogsOnDate?: OutfitLog[];
  onDateClick: (date: Date) => void;
  onLogDelete: (logId: string) => Promise<boolean>;
  onAddOutfit: (outfitId: string) => void;
  onAddActivity: (activity: string) => void;
  weatherLocation?: { city: string; country: string };
}

const WeekViewContainer = ({ 
  currentDate, 
  selectedDate, 
  outfits, 
  clothingItems, 
  outfitLogs,
  onDateClick,
  onLogDelete,
  setSelectedDate,
  onAddOutfit,
  onAddActivity,
  weatherLocation
}: WeekViewContainerProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const isMobile = useIsMobile();
  
  // Generate array of dates for the week
  const weekDates = [];
  let day = weekStart;
  
  while (day <= weekEnd) {
    weekDates.push(day);
    day = addDays(day, 1);
  }

  // Filter logs for specific date
  const getLogsForDay = (date: Date) => {
    return outfitLogs.filter(log => isSameDay(new Date(log.date), date));
  };

  const handleDateClick = (date: Date) => {
    if (setSelectedDate) {
      setSelectedDate(date);
    }
    onDateClick(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col gap-6"
    >
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => (
          <Button
            key={date.toISOString()}
            onClick={() => handleDateClick(date)}
            variant={isSameDay(date, selectedDate) ? "default" : "outline"}
            className={`
              flex-1 flex flex-col items-center justify-center h-auto py-2
              ${isSameDay(date, new Date()) ? 'border-primary' : ''}
              ${isSameDay(date, selectedDate) ? 'bg-primary/20' : ''}
            `}
          >
            <span className="text-xs font-medium mb-1">{format(date, 'EEE')}</span>
            <span className={`text-lg ${isSameDay(date, selectedDate) ? 'font-bold' : ''}`}>
              {format(date, 'd')}
            </span>
            {getLogsForDay(date).length > 0 && (
              <div className="text-xs bg-primary/20 px-2 py-0.5 rounded-full mt-1">
                {getLogsForDay(date).length}
              </div>
            )}
          </Button>
        ))}
      </div>
      
      {selectedDate && (
        <div className="w-full">
          <DayDetailView
            selectedDate={selectedDate}
            outfits={outfits}
            outfitLogs={getLogsForDay(selectedDate)}
            onAddOutfit={onAddOutfit}
            onAddActivity={onAddActivity}
            weatherLocation={weatherLocation}
            onDeleteLog={onLogDelete}
          />
        </div>
      )}
    </motion.div>
  );
};

export default WeekViewContainer;
