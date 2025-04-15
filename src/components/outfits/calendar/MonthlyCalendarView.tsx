
import { format, eachDayOfInterval, isToday, isSameDay, startOfMonth, endOfMonth, isFuture } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MonthlyCalendarViewProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  getLogsForDay: (day: Date) => OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
}

// Mapping of activities to emojis
const activityEmojis: Record<string, string> = {
  casual: '👕',
  work: '💼',
  formal: '👔',
  party: '🎉',
  date: '❤️',
  interview: '🎓',
  presentation: '📊',
  dinner: '🍽️',
  sport: '🏃',
  other: '📝'
};

const weatherConditionMap: Record<string, string> = {
  sunny: 'sunny',
  cloudy: 'cloudy',
  rainy: 'rainy',
  snowy: 'snowy',
  windy: 'windy',
  hot: 'hot',
  cold: 'cold',
  mild: 'mild',
  cool: 'cool',
  warm: 'warm'
};

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
  
  const getTooltipContent = (logs: OutfitLog[]) => {
    if (logs.length === 0) return null;
    
    return logs.map(log => {
      const outfit = getOutfitById(log.outfitId);
      if (!outfit) return null;
      
      const activity = log.activity === 'other' && log.customActivity ? log.customActivity : log.activity;
      const weatherInfo = log.weatherCondition || log.temperature 
        ? `${log.weatherCondition || ''} ${log.temperature ? `(${log.temperature})` : ''}`
        : '';
      
      return (
        <div key={log.id} className="py-1">
          {isFuture(new Date(log.date)) 
            ? `Planned: "${outfit.name}" for ${activity}`
            : `Wore "${outfit.name}" for ${activity}`}
          {weatherInfo && <div className="text-xs opacity-70">{weatherInfo}</div>}
        </div>
      );
    });
  };
  
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
            const isFutureDate = isFuture(day);
            
            return (
              <TooltipProvider key={day.toString()}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
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
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-0.5">
                          {dayLogs.slice(0, isMobile ? 1 : 2).map((log, i) => {
                            const outfit = getOutfitById(log.outfitId);
                            if (!outfit) return null;
                            
                            // Display activity emoji if available
                            const emoji = log.activity ? activityEmojis[log.activity] : '';
                            
                            return (
                              <div key={log.id} className="flex items-center justify-center">
                                {emoji && (
                                  <span className="text-[8px]">{emoji}</span>
                                )}
                                <div 
                                  className={`
                                    h-1.5 w-1.5 rounded-full mx-0.5
                                    ${i === 0 ? 'bg-purple-500' : 'bg-blue-500'}
                                    ${isFutureDate ? 'opacity-60' : ''}
                                  `}
                                  title={outfit.name}
                                />
                              </div>
                            );
                          })}
                          {dayLogs.length > (isMobile ? 1 : 2) && (
                            <div className="text-[8px] text-slate-400">+{dayLogs.length - (isMobile ? 1 : 2)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  {dayLogs.length > 0 && (
                    <TooltipContent side="top" align="center" className="bg-slate-900 border-purple-500/30 p-2 max-w-[250px]">
                      <p className="font-medium mb-1">{format(day, 'MMMM d, yyyy')}</p>
                      {getTooltipContent(dayLogs)}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendarView;
