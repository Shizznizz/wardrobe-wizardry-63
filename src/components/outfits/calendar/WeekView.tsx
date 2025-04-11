
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, isFuture, addWeeks, subWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  getLogsForDay: (day: Date) => OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleOpenLogDialog: (date: Date) => void;
  moveOutfitLog?: (logId: string, fromDate: Date, toDate: Date) => void;
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

const WeekView = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  getLogsForDay,
  getOutfitById,
  handleOpenLogDialog,
  moveOutfitLog
}: WeekViewProps) => {
  const isMobile = useIsMobile();
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Calculate the week dates based on the current date and week offset
  const weekDates = useMemo(() => {
    const offsetDate = weekOffset === 0 ? currentDate : 
      weekOffset > 0 ? addWeeks(currentDate, weekOffset) : subWeeks(currentDate, Math.abs(weekOffset));
    const startDate = startOfWeek(offsetDate, { weekStartsOn: 0 });
    const endDate = endOfWeek(offsetDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate, weekOffset]);
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };
  
  // Reset to current week
  const goToCurrentWeek = () => {
    setWeekOffset(0);
  };
  
  // Calculate the week label (e.g., "April 7 - 13, 2025")
  const weekLabel = useMemo(() => {
    const startDateStr = format(weekDates[0], 'MMMM d');
    const endDateStr = format(weekDates[6], 'MMMM d, yyyy');
    return `${startDateStr} - ${endDateStr}`;
  }, [weekDates]);
  
  // Handle drag and drop of outfit logs
  const handleDragEnd = (result: any) => {
    if (!result.destination || !moveOutfitLog) return;
    
    const { draggableId, source, destination } = result;
    const fromDateStr = source.droppableId;
    const toDateStr = destination.droppableId;
    
    // Convert the date strings back to Date objects
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);
    
    moveOutfitLog(draggableId, fromDate, toDate);
  };
  
  return (
    <Card className="col-span-1 md:col-span-3 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={`grid grid-cols-7 gap-1 ${isMobile ? 'gap-0.5' : 'gap-2'}`}>
            {weekDates.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayLogs = getLogsForDay(day);
              const isCurrentDay = isToday(day);
              const isSelectedDay = selectedDate && isSameDay(day, selectedDate);
              const isFutureDay = isFuture(day);
              
              return (
                <div 
                  key={dateStr}
                  className={`
                    border rounded-lg 
                    ${isMobile ? 'p-1 min-h-[100px]' : 'p-2 min-h-[120px]'}
                    ${isCurrentDay ? 'border-purple-500' : 'border-slate-700'} 
                    ${isSelectedDay ? 'bg-slate-700/30' : 'bg-slate-800/20'}
                    transition-all duration-200 touch-manipulation
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-center mb-1">
                    <div className={`text-xs text-slate-400 ${isMobile ? 'mb-0' : 'mb-1'}`}>
                      {format(day, 'EEE')}
                    </div>
                    <div className={`
                      font-semibold rounded-full mx-auto w-7 h-7 flex items-center justify-center
                      ${isCurrentDay ? 'bg-purple-600 text-white' : ''}
                    `}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  
                  <Droppable droppableId={dateStr}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-1 ${isMobile ? 'max-h-[70px]' : 'max-h-[120px]'} overflow-y-auto scrollbar-thin`}
                      >
                        {dayLogs.map((log, index) => {
                          const outfit = getOutfitById(log.outfitId);
                          if (!outfit) return null;
                          
                          const activityEmoji = log.activity ? activityEmojis[log.activity] : '';
                          
                          return (
                            <Draggable 
                              key={log.id} 
                              draggableId={log.id} 
                              index={index}
                              isDragDisabled={!moveOutfitLog || isMobile}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    p-1 rounded text-xs bg-slate-700 border border-slate-600
                                    ${isFutureDay ? 'border-dashed' : ''}
                                    ${log.aiSuggested ? 'border-l-4 border-l-purple-500' : ''}
                                  `}
                                >
                                  <div className="flex items-center gap-1 overflow-hidden">
                                    {activityEmoji && <span className="flex-shrink-0">{activityEmoji}</span>}
                                    <span className="truncate whitespace-nowrap">{outfit.name}</span>
                                  </div>
                                  {!isMobile && log.timeOfDay && (
                                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                      {log.timeOfDay}
                                      {log.activity && log.activity !== 'other' && ` • ${log.activity}`}
                                      {log.activity === 'other' && log.customActivity && ` • ${log.customActivity}`}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`w-full mt-1 h-6 text-xs text-slate-400 
                      ${isMobile ? 'px-1' : 'mt-2'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLogDialog(day);
                    }}
                  >
                    <Plus className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3 mr-1'}`} />
                    {!isMobile && "Add"}
                  </Button>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default WeekView;
