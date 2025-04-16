
import React from 'react';
import { motion } from 'framer-motion';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ClothingItem, Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import DayDetailView from './DayDetailView';

interface DailyViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  outfitLogs: OutfitLog[];
  onLogDelete: (logId: string) => Promise<boolean>;
  onAddOutfit: (outfitId: string) => void;
  onAddActivity: (activity: string) => void;
  weatherLocation?: { city: string; country: string };
}

const DailyView = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  outfits,
  clothingItems,
  outfitLogs,
  onLogDelete,
  onAddOutfit,
  onAddActivity,
  weatherLocation
}: DailyViewProps) => {
  // Filter logs for the selected date
  const selectedDateLogs = outfitLogs.filter(log => 
    isSameDay(new Date(log.date), selectedDate)
  );

  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-2 px-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goToPreviousDay}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className={`h-8 text-xs ${isSameDay(selectedDate, new Date()) ? 'bg-primary/20' : ''}`}
        >
          Today
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goToNextDay}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">{format(selectedDate, 'EEEE')}</h2>
        <p className="text-sm text-muted-foreground">{format(selectedDate, 'MMMM d, yyyy')}</p>
      </div>

      <DayDetailView
        selectedDate={selectedDate}
        outfits={outfits}
        outfitLogs={selectedDateLogs}
        onAddOutfit={onAddOutfit}
        onAddActivity={onAddActivity}
        weatherLocation={weatherLocation}
        onDeleteLog={onLogDelete}
      />
    </motion.div>
  );
};

export default DailyView;
