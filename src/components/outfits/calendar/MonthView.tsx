
import React from 'react';
import { motion } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  getDaysInMonth, 
  getDay, 
  addDays, 
  isSameDay, 
  isToday, 
  isSameMonth,
  subMonths,
  addMonths
} from 'date-fns';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Shirt, CalendarDays, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  outfits: Outfit[];
  outfitLogs: any[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleViewLog: (log: any) => void;
  handleOpenLogDialog: (date: Date) => void;
  handleDeleteLog: (id: string) => Promise<boolean>;
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
  isMobile
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
      isCurrentMonth: isSameMonth(currentDayDate, currentMonth),
      hasOutfit: outfitLogs.some(log => isSameDay(new Date(log.date), currentDayDate) && log.outfitId !== 'activity'),
      hasActivity: outfitLogs.some(log => 
        isSameDay(new Date(log.date), currentDayDate) && 
        (log.activity || log.customActivity || log.outfitId === 'activity')
      ),
      outfitCount: outfitLogs.filter(log => 
        isSameDay(new Date(log.date), currentDayDate)
      ).length
    };
  });
  
  // Break days into weeks but only include a week if it has at least one day in the current month
  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    const week = daysArray.slice(i, i + 7);
    if (week.some(day => day.isCurrentMonth)) {
      weeks.push(week);
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full space-y-4"
    >
      {/* Month heading and navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-light bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className={`h-8 text-xs ${isToday(currentMonth) ? 'bg-primary/20' : ''}`}
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Weekday labels in a grid, aligned with days */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-1 text-xs font-medium text-gray-400">
            {isMobile ? day.charAt(0) : day}
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
                className={cn(`
                  p-1 h-auto min-h-[70px] flex flex-col items-center justify-between relative
                  transition-all duration-200 group
                  ${day.isCurrentMonth ? 'text-white hover:shadow-lg hover:scale-[1.02]' : 'text-gray-400 opacity-40'}
                  ${day.hasOutfit && day.isCurrentMonth ? 'bg-primary/10 hover:bg-primary/20' : ''}
                  ${isSameDay(day.date, selectedDate) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                `)}
                onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
                disabled={!day.isCurrentMonth}
              >
                <div className="flex items-center justify-between w-full px-2 pt-1">
                  <span className={cn(
                    "text-xs",
                    isSameDay(day.date, selectedDate) && "font-bold"
                  )}>
                    {format(day.date, 'd')}
                  </span>
                  <div className="flex gap-0.5">
                    {day.hasOutfit && (
                      <Shirt className="w-3 h-3 text-primary" />
                    )}
                    {day.hasActivity && (
                      <MapPin className="w-3 h-3 text-orange-400" />
                    )}
                  </div>
                </div>
                
                {day.outfitCount > 0 ? (
                  <span className="text-[10px] bg-primary/20 px-1.5 py-0.5 rounded-full mt-1">
                    {day.outfitCount}
                  </span>
                ) : day.isCurrentMonth ? (
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Plan with Olivia?
                  </span>
                ) : null}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MonthView;
