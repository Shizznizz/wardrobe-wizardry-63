
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, isFuture } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

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
  // Calculate the week dates based on the current date
  const weekDates = useMemo(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);
  
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
        <CardTitle className="text-xl text-purple-200">Week View</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-7 gap-2">
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
                    border rounded-lg p-2 
                    ${isCurrentDay ? 'border-purple-500' : 'border-slate-700'} 
                    ${isSelectedDay ? 'bg-slate-700/30' : 'bg-slate-800/20'}
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-center mb-2">
                    <div className="text-xs text-slate-400">{format(day, 'EEE')}</div>
                    <div className="text-lg font-semibold">{format(day, 'd')}</div>
                  </div>
                  
                  <Droppable droppableId={dateStr}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-2 min-h-[100px]"
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
                              isDragDisabled={!moveOutfitLog}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    p-2 rounded text-xs bg-slate-700 border border-slate-600
                                    ${isFutureDay ? 'border-dashed' : ''}
                                    ${log.aiSuggested ? 'border-l-4 border-l-purple-500' : ''}
                                  `}
                                >
                                  <div className="flex items-center gap-1">
                                    {activityEmoji && <span>{activityEmoji}</span>}
                                    <span className="truncate">{outfit.name}</span>
                                  </div>
                                  {log.timeOfDay && (
                                    <div className="text-[10px] text-slate-400 mt-1">
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
                    className="w-full mt-2 h-7 text-xs text-slate-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLogDialog(day);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
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
