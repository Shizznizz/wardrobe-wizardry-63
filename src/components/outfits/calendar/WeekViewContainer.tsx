import React from 'react';
import { motion } from 'framer-motion';
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClothingItem, Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Plus, Shirt } from 'lucide-react';

interface WeekViewContainerProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate?: (date: Date) => void;
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  outfitLogs: Outfit[];
  outfitLogsOnDate?: OutfitLog[];
  rarelyWornOutfits?: Outfit[];
  frequentlyWornOutfits?: Outfit[];
  getOutfitById?: (id: string) => Outfit | undefined;
  getLogsForDay?: (day: Date) => OutfitLog[];
  handleOpenLogDialog?: (date: Date) => void;
  handleEditLog?: (log: OutfitLog) => void;
  handleDeleteLog?: (id: string) => Promise<boolean>;
  handleSelectOutfit?: (outfitId: string) => void;
  getSeasonalSuggestions?: (outfits: Outfit[], clothingItems: ClothingItem[]) => Outfit[];
  onDateClick: (date: Date) => void;
  onLogDelete: (logId: string) => Promise<boolean>;
}

const WeekViewContainer = ({ 
  currentDate, 
  selectedDate, 
  outfits, 
  clothingItems, 
  outfitLogs, 
  onDateClick,
  onLogDelete,
  setSelectedDate
}: WeekViewContainerProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  const daysInWeek = [];
  let day = weekStart;
  
  while (day <= weekEnd) {
    daysInWeek.push(day);
    day = addDays(day, 1);
  }

  const weekLogs = outfitLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= weekStart && logDate <= weekEnd;
  });

  const handleLogDeleteWrapper = async (logId: string): Promise<boolean> => {
    try {
      await onLogDelete(logId);
      return true;
    } catch (error) {
      console.error("Error deleting log:", error);
      return false;
    }
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
      className="h-full flex flex-col"
    >
      <div className="flex justify-between mb-4">
        {daysInWeek.map((date) => (
          <Button
            key={date.toISOString()}
            onClick={() => handleDateClick(date)}
            variant={isSameDay(date, selectedDate) ? "default" : "outline"}
            className={`
              flex-1 flex flex-col items-center justify-center h-auto py-2
              ${isSameDay(date, new Date()) ? 'border-primary' : ''}
              transition-all duration-200 hover:scale-105
            `}
          >
            <span className="text-xs font-medium mb-1">{format(date, 'EEE')}</span>
            <span className={`text-lg ${isSameDay(date, selectedDate) ? 'font-bold' : ''}`}>
              {format(date, 'd')}
            </span>
          </Button>
        ))}
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="grid grid-cols-7 gap-2 h-full">
          {daysInWeek.map(date => {
            const dayLogs = weekLogs.filter(log => isSameDay(new Date(log.date), date));
            
            return (
              <div 
                key={date.toISOString()} 
                className={`
                  flex flex-col space-y-2 p-2 border rounded-md min-h-[300px]
                  ${isSameDay(date, selectedDate) ? 'border-primary bg-primary/5' : 'border-gray-200'}
                  transition-all duration-200 hover:border-purple-500/50
                `}
                onClick={() => handleDateClick(date)}
              >
                {dayLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 text-center">
                    <Shirt className="h-8 w-8 text-gray-400 animate-pulse" />
                    <p className="text-gray-400 text-xs px-2">
                      No outfits logged yet
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(date);
                      }}
                      className="mt-2 group hover:border-purple-500/50"
                    >
                      <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                      Log Outfit
                    </Button>
                  </div>
                ) : (
                  dayLogs.map(log => (
                    <div 
                      key={log.id} 
                      className="p-2 bg-card rounded-md border border-border text-xs"
                    >
                      <div className="font-medium">{log.timeOfDay || 'Outfit'}</div>
                      <div className="text-gray-400 mt-1">{log.notes || 'No notes'}</div>
                      <div className="flex justify-end mt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogDeleteWrapper(log.id);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default WeekViewContainer;
