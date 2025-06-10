
import React from 'react';
import { motion } from 'framer-motion';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ClothingItem, Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import DayDetailView from './DayDetailView';
import { useIsMobile } from '@/hooks/use-mobile';

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
  onReassignOutfit?: (logId: string, newOutfitId: string) => Promise<boolean>;
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
  onReassignOutfit,
  weatherLocation
}: DailyViewProps) => {
  const isMobile = useIsMobile();
  
  // Filter logs for the selected date
  const selectedDateLogs = outfitLogs.filter(log => 
    isSameDay(new Date(log.date), selectedDate)
  );

  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  const handleReassignOutfit = async (logId: string, newOutfitId: string) => {
    if (onReassignOutfit) {
      return await onReassignOutfit(logId, newOutfitId);
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col gap-6"
    >
      {/* Navigation with better spacing */}
      <div className={`bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 ${isMobile ? 'mx-2' : ''}`}>
        <div className="flex items-center justify-between gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousDay}
            className="h-10 w-10 p-0 border-slate-600 hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 text-center">
            <Button 
              variant={isSameDay(selectedDate, new Date()) ? "default" : "outline"}
              size="sm" 
              onClick={goToToday}
              className={`px-4 ${isSameDay(selectedDate, new Date()) ? 
                'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 
                'border-slate-600 hover:bg-slate-700'
              }`}
            >
              Today
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextDay}
            className="h-10 w-10 p-0 border-slate-600 hover:bg-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Date display with separation */}
      <div className={`text-center py-4 ${isMobile ? 'mx-2' : ''}`}>
        <motion.h2 
          className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {format(selectedDate, 'EEEE')}
        </motion.h2>
        <p className="text-lg text-slate-300 mt-1">{format(selectedDate, 'MMMM d, yyyy')}</p>
      </div>

      {/* Day detail view with mobile padding */}
      <div className={`${isMobile ? 'px-2 pb-20' : 'pb-6'}`}>
        <motion.div
          key={selectedDate.toISOString()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DayDetailView
            selectedDate={selectedDate}
            outfits={outfits}
            outfitLogs={selectedDateLogs}
            onAddOutfit={onAddOutfit}
            onAddActivity={onAddActivity}
            weatherLocation={weatherLocation}
            onDeleteLog={onLogDelete}
            onReassignOutfit={handleReassignOutfit}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DailyView;
