
import React from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface OutfitLog {
  id: string;
  outfitId: string;
  date: Date | string;
  timeOfDay: string;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
  customActivity?: string;
  activity?: string;
  aiSuggested?: boolean;
  occasion?: string;
  askForAiSuggestion?: boolean;
  aiSuggestionFeedback?: 'positive' | 'negative' | null;
}

interface OutfitLogItemProps {
  log: OutfitLog;
  outfitName: string;
  className?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const OutfitLogItem = ({
  log,
  outfitName,
  className,
  onView,
  onEdit,
  onDelete
}: OutfitLogItemProps) => {
  const formattedDate = format(new Date(log.date), 'MMMM d, yyyy');
  
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-sm">{outfitName}</h4>
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <div className="flex space-x-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onEdit}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive/80"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-xs">
        {log.timeOfDay && (
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Time:</span>
            <span>{log.timeOfDay}</span>
          </div>
        )}
        
        {log.occasion && (
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Occasion:</span>
            <span>{log.occasion}</span>
          </div>
        )}
        
        {log.weatherCondition && (
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Weather:</span>
            <span>{log.weatherCondition} {log.temperature && `(${log.temperature})`}</span>
          </div>
        )}
      </div>
      
      {log.notes && (
        <div className="mt-2 pt-2 border-t border-border text-xs">
          <p className="text-muted-foreground">{log.notes}</p>
        </div>
      )}
      
      {onView && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 h-7 text-xs"
          onClick={onView}
        >
          View Details
        </Button>
      )}
    </div>
  );
};

export default OutfitLogItem;
