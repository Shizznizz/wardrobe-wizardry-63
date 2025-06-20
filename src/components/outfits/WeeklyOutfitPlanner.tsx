import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { ClothingItem, Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { useCalendarState } from '@/hooks/useCalendarState';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import OutfitPreviewCard from './OutfitPreviewCard';
import OutfitSelectorDialog from './calendar/OutfitSelectorDialog';
import { toast } from 'sonner';

interface WeeklyOutfitPlannerProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  currentDate?: Date;
  weatherLocation?: { city: string; country: string };
}

const WeeklyOutfitPlanner = ({ 
  outfits, 
  clothingItems, 
  currentDate = new Date(),
  weatherLocation
}: WeeklyOutfitPlannerProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isOutfitSelectorOpen, setIsOutfitSelectorOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const {
    outfitLogs,
    addOutfitLog,
    deleteOutfitLog,
  } = useCalendarState(outfits, clothingItems);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  const weekDates: Date[] = [];
  let day = weekStart;
  
  while (day <= weekEnd) {
    weekDates.push(day);
    day = addDays(day, 1);
  }

  const getOutfitForDay = (date: Date) => {
    return outfitLogs.find(log => isSameDay(new Date(log.date), date));
  };

  const getOutfitById = (id: string) => {
    return outfits.find(outfit => outfit.id === id);
  };

  const handleChooseOutfit = (date: Date) => {
    setSelectedDate(date);
    setIsOutfitSelectorOpen(true);
  };

  const handleOutfitSelected = async (outfitId: string) => {
    if (!selectedDate || !user) return;
    
    const newLog = {
      outfitId,
      date: selectedDate,
      timeOfDay: 'all-day' as const,
      user_id: user.id
    };
    
    try {
      await addOutfitLog(newLog);
      toast.success(`Outfit assigned for ${format(selectedDate, 'EEEE, MMM d')}`);
      setIsOutfitSelectorOpen(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error adding outfit log:', error);
      toast.error('Failed to assign outfit. Please try again.');
    }
  };

  const handleRemoveOutfit = async (date: Date) => {
    const outfitLog = getOutfitForDay(date);
    if (outfitLog) {
      try {
        await deleteOutfitLog(outfitLog.id);
        toast.success(`Outfit removed from ${format(date, 'EEEE, MMM d')}`);
      } catch (error) {
        console.error('Error removing outfit:', error);
        toast.error('Failed to remove outfit. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-purple-200">Weekly Outfit Planner</h2>
        <p className="text-purple-200/80">Plan your outfits for the week ahead</p>
      </div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-7'}`}>
        {weekDates.map((date) => {
          const outfitLog = getOutfitForDay(date);
          const outfit = outfitLog ? getOutfitById(outfitLog.outfitId) : null;
          
          return (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: weekDates.indexOf(date) * 0.1 }}
              className="space-y-3"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-200">
                  {format(date, 'EEE')}
                </h3>
                <p className="text-sm text-purple-200/70">
                  {format(date, 'MMM d')}
                </p>
              </div>
              
              {outfit ? (
                <div className="relative">
                  <OutfitPreviewCard
                    outfit={outfit}
                    clothingItems={clothingItems}
                    weather={{
                      temperature: 22,
                      condition: 'Partly Cloudy',
                      city: weatherLocation?.city || 'Your City'
                    }}
                    activitySuggestion="daily wear"
                    onCardClick={() => {}}
                    compact={true}
                  />
                  <Button
                    onClick={() => handleRemoveOutfit(date)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500/80 hover:bg-red-500 text-white rounded-full"
                    size="sm"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-900/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center space-y-4">
                  <div className="text-center text-white/60">
                    <p className="text-sm mb-4">No outfit assigned</p>
                    <Button
                      onClick={() => handleChooseOutfit(date)}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Choose Outfit
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <OutfitSelectorDialog
        isOpen={isOutfitSelectorOpen}
        onClose={() => {
          setIsOutfitSelectorOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleOutfitSelected}
        outfits={outfits}
      />
    </div>
  );
};

export default WeeklyOutfitPlanner;
