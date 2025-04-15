
import { format, eachDayOfInterval, isToday, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar as CalendarIcon } from 'lucide-react';
import MonthlyCalendarDay from './MonthlyCalendarDay';

interface MonthlyCalendarViewProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  getLogsForDay: (day: Date) => OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
  onAddLog: () => void;
}

const MonthlyCalendarView = ({
  currentMonth,
  selectedDate,
  setSelectedDate,
  getLogsForDay,
  getOutfitById,
  onAddLog
}: MonthlyCalendarViewProps) => {
  const isMobile = useIsMobile();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mobileDaysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  return (
    <Card className="col-span-1 md:col-span-3 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-xl text-purple-200">Plan Your Week</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {(isMobile ? mobileDaysOfWeek : daysOfWeek).map(day => (
            <div key={day} className="text-xs font-medium text-slate-400 mb-1">
              {day}
            </div>
          ))}
          
          {days.map((day) => {
            const dayLogs = getLogsForDay(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            
            return (
              <MonthlyCalendarDay
                key={day.toISOString()}
                date={day}
                isCurrentMonth={isCurrentMonth}
                logs={dayLogs}
                onDateClick={setSelectedDate}
                onAddLog={onAddLog}
                getOutfitById={getOutfitById}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendarView;
