
import { format, eachDayOfInterval, isToday, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthlyCalendarViewProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  getLogsForDay: (day: Date) => OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
}

const MonthlyCalendarView = ({
  currentMonth,
  selectedDate,
  setSelectedDate,
  getLogsForDay,
  getOutfitById,
}: MonthlyCalendarViewProps) => {
  const isMobile = useIsMobile();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mobileDaysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  return (
    <Card className="col-span-1 md:col-span-3 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-purple-200">Monthly Calendar View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {(isMobile ? mobileDaysOfWeek : daysOfWeek).map(day => (
            <div key={day} className="text-xs font-medium text-slate-400 mb-1">{day}</div>
          ))}
          
          {eachDayOfInterval({
            start: startOfMonth(currentMonth),
            end: endOfMonth(currentMonth)
          }).map(day => {
            const dayLogs = getLogsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            
            return (
              <div 
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  p-1 rounded-sm text-xs cursor-pointer relative
                  ${isCurrentMonth ? 'hover:bg-slate-700/50' : 'opacity-40'}
                  ${isSelected ? 'bg-purple-700/50 text-white' : ''}
                  ${isToday(day) ? 'border border-purple-500' : ''}
                  ${dayLogs.length > 0 ? 'bg-slate-800' : ''}
                  ${isMobile ? 'h-8' : ''}
                `}
              >
                <div className={isMobile ? "text-[10px]" : "mb-2"}>{format(day, 'd')}</div>
                {dayLogs.length > 0 && (
                  <div className="flex justify-center gap-0.5">
                    {dayLogs.slice(0, isMobile ? 2 : 3).map((log, i) => {
                      const outfit = getOutfitById(log.outfitId);
                      if (!outfit) return null;
                      
                      return (
                        <div 
                          key={log.id}
                          className={`
                            h-1 w-1 rounded-full
                            ${i === 0 ? 'bg-purple-500' : i === 1 ? 'bg-blue-500' : 'bg-pink-500'}
                          `}
                          title={outfit.name}
                        />
                      );
                    })}
                    {dayLogs.length > (isMobile ? 2 : 3) && (
                      <div className="text-[8px] text-slate-400">+{dayLogs.length - (isMobile ? 2 : 3)}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendarView;
