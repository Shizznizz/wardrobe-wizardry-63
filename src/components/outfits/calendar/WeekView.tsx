
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, isFuture, addWeeks, subWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';  // Add this import
import { useMemo, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DayDetailView from './DayDetailView';

interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  getLogsForDay: (day: Date) => OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleOpenLogDialog: (date: Date) => void;
  moveOutfitLog?: (logId: string, fromDate: Date, toDate: Date) => void;
  outfits: Outfit[];
  clothingItems: any[];
  location?: { city: string; country: string };
  onAddOutfit: (outfitId: string) => void;
  onAddActivity: (activity: string) => void;
  onWeatherChange?: (weather: any) => void;
}

const WeekView = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  getLogsForDay,
  getOutfitById,
  handleOpenLogDialog,
  moveOutfitLog,
  outfits,
  clothingItems,
  location,
  onAddOutfit,
  onAddActivity,
  onWeatherChange
}: WeekViewProps) => {
  const isMobile = useIsMobile();
  const [weekOffset, setWeekOffset] = useState(0);
  
  const weekDates = useMemo(() => {
    const offsetDate = weekOffset === 0 ? currentDate : 
      weekOffset > 0 ? addWeeks(currentDate, weekOffset) : subWeeks(currentDate, Math.abs(weekOffset));
    const startDate = startOfWeek(offsetDate, { weekStartsOn: 0 });
    const endDate = endOfWeek(offsetDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate, weekOffset]);
  
  const goToPreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };
  
  const goToNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };
  
  const goToCurrentWeek = () => {
    setWeekOffset(0);
  };
  
  const weekLabel = useMemo(() => {
    const startDateStr = format(weekDates[0], 'MMMM d');
    const endDateStr = format(weekDates[6], 'MMMM d, yyyy');
    return `${startDateStr} - ${endDateStr}`;
  }, [weekDates]);
  
  const handleDaySelect = (day: Date) => {
    setSelectedDate(day);
  };
  
  return (
    <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-purple-200">Week View</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToPreviousWeek}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToCurrentWeek}
              className={`h-8 text-xs ${weekOffset === 0 ? 'bg-purple-500/20' : ''}`}
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToNextWeek}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-purple-200/70 mt-1">{weekLabel}</p>
      </CardHeader>
      <CardContent className="px-2 py-3">
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayLogs = getLogsForDay(day);
            const isCurrentDay = isToday(day);
            const isSelectedDay = selectedDate && isSameDay(day, selectedDate);
            const isFutureDay = isFuture(day);
            
            return (
              <div key={dateStr} className="flex flex-col gap-1">
                <Button 
                  className={`
                    p-2 h-auto flex flex-col items-center rounded-lg
                    ${isCurrentDay ? 'bg-purple-600/20 border-purple-500/30' : 
                      isSelectedDay ? 'bg-pink-600/20 border-pink-500/30' : 
                      'bg-slate-800/20 border-slate-700/30'}
                  `}
                  onClick={() => handleDaySelect(day)}
                >
                  <span className="text-xs text-slate-400">{format(day, 'EEE')}</span>
                  <span className={`
                    text-lg font-semibold mt-1
                    ${isCurrentDay ? 'text-purple-300' : 
                      isSelectedDay ? 'text-pink-300' : 'text-white'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayLogs.length > 0 && (
                    <Badge variant="secondary" className="mt-1 bg-slate-700/50">
                      {dayLogs.length}
                    </Badge>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
        
        {selectedDate && (
          <div className="mt-4">
            <DayDetailView
              selectedDate={selectedDate}
              outfits={outfits}
              outfitLogs={getLogsForDay(selectedDate)}
              onAddOutfit={onAddOutfit}
              onAddActivity={onAddActivity}
              weatherLocation={location}
              onWeatherChange={onWeatherChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeekView;
