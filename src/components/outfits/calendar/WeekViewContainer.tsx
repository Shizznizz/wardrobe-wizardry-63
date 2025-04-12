
import React from 'react';
import { motion } from 'framer-motion';
import { addDays, format, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClothingItem, Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';

interface WeekViewContainerProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate?: (date: Date) => void;  // Made optional since some places might not pass it
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  outfitLogs: OutfitLog[];
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
  
  // Generate array of dates for the week
  const daysInWeek = [];
  let day = weekStart;
  
  while (day <= weekEnd) {
    daysInWeek.push(day);
    day = addDays(day, 1);
  }

  // Filter logs for the current week
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
                `}
                onClick={() => handleDateClick(date)}
              >
                {dayLogs.length === 0 ? (
                  <div className="text-center text-gray-400 text-xs mt-4">
                    No outfits logged
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
