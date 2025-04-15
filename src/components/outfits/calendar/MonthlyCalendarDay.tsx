
import { useState } from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Button } from '@/components/ui/button';
import { Outfit } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthlyCalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  logs: OutfitLog[];
  onDateClick: (date: Date) => void;
  onAddLog: () => void;
  getOutfitById: (id: string) => Outfit | undefined;
}

const MonthlyCalendarDay = ({
  date,
  isCurrentMonth,
  logs,
  onDateClick,
  onAddLog,
  getOutfitById,
}: MonthlyCalendarDayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleDayClick = () => {
    onDateClick(date);
    if (isMobile) {
      setIsOpen(true);
    }
  };

  const renderContent = () => (
    <div className="min-w-[200px] max-w-[300px]">
      <h3 className="text-sm font-medium mb-2">{format(date, 'MMMM d, yyyy')}</h3>
      
      {logs.length > 0 ? (
        <div className="space-y-2">
          {logs.map((log) => {
            const outfit = getOutfitById(log.outfitId);
            return (
              <div
                key={log.id}
                className="text-xs p-2 bg-secondary/10 rounded-md"
              >
                <div className="font-medium">{outfit?.name || 'Untitled Outfit'}</div>
                {log.activity && (
                  <div className="text-muted-foreground">
                    {log.customActivity || log.activity}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-2 text-sm text-muted-foreground">
          Plan with Olivia?
        </div>
      )}
      
      <Button
        size="sm"
        variant="outline"
        className="w-full mt-3"
        onClick={(e) => {
          e.stopPropagation();
          onAddLog();
        }}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Outfit
      </Button>
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          onClick={handleDayClick}
          className={cn(
            "w-full h-full min-h-[70px] p-1 relative flex flex-col items-start justify-start",
            !isCurrentMonth && "opacity-50",
            isToday(date) && "border border-primary",
            logs.length > 0 && "bg-secondary/5"
          )}
        >
          <span className={cn(
            "text-xs font-medium",
            isToday(date) && "text-primary"
          )}>
            {format(date, 'd')}
          </span>
          
          {logs.length > 0 && (
            <div className="absolute top-1 right-1 flex -space-x-1">
              {logs.map((log, i) => (
                <div
                  key={log.id}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i === 0 ? "bg-primary" : "bg-secondary"
                  )}
                />
              ))}
            </div>
          )}
          
          {logs.length > 0 && (
            <div className="mt-auto text-[10px] text-muted-foreground">
              {logs.length} outfit{logs.length > 1 ? 's' : ''}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent side="right" className="w-[300px] p-4">
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
};

export default MonthlyCalendarDay;
