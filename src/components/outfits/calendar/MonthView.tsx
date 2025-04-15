
import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, getDaysInMonth, getDay, addDays, isSameDay, isToday, isSameMonth } from 'date-fns';
import { Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Clothing, CalendarDays } from 'lucide-react';
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
      hasOutfit: outfitLogs.some(log => isSameDay(new Date(log.date), currentDayDate)),
      hasActivity: outfitLogs.some(log => 
        isSameDay(new Date(log.date), currentDayDate) && 
        (log.activity || log.customActivity)
      ),
      outfitCount: outfitLogs.filter(log => 
        isSameDay(new Date(log.date), currentDayDate)
      ).length
    };
  });
  
  // Break days into weeks and filter out weeks that are entirely in the next month
  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    const week = daysArray.slice(i, i + 7);
    if (week.some(day => day.isCurrentMonth)) {
      weeks.push(week);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full space-y-4"
    >
      {/* Month label */}
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-1">
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}
        </div>
        <div className="text-2xl font-light bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
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
                      <Clothing className="w-3 h-3 text-primary" />
                    )}
                    {day.hasActivity && (
                      <CalendarDays className="w-3 h-3 text-secondary" />
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
