
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Edit, ExternalLink, Trash2 } from 'lucide-react';
import { Outfit } from '@/lib/types';
import AddToCalendarButton from '@/components/outfits/AddToCalendarButton';
import { OutfitLog } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface OutfitCardActionsProps {
  outfit: Outfit;
  onEdit: (outfit: Outfit) => void;
  onDelete: (id: string) => void;
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  onPreviewInFittingRoom: (outfit: Outfit) => void;
}

const OutfitCardActions = ({ 
  outfit, 
  onEdit, 
  onDelete,
  onOutfitAddedToCalendar,
  onPreviewInFittingRoom 
}: OutfitCardActionsProps) => {
  const [actionsExpanded, setActionsExpanded] = useState(false);
  
  return (
    <div className="space-y-2">
      <Button 
        variant="default"
        size="sm"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-xs h-8"
        onClick={() => onPreviewInFittingRoom(outfit)}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
        Preview in Fitting Room
      </Button>
      
      <Collapsible
        open={actionsExpanded}
        onOpenChange={setActionsExpanded}
        className="border-t border-white/10 pt-2 mt-2"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full text-xs justify-center border-white/10 hover:bg-white/5",
              actionsExpanded ? "text-white" : "text-white/60"
            )}
          >
            {actionsExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                Hide Options
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                More Options
              </>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-2 space-y-2">
          <AddToCalendarButton 
            outfit={outfit} 
            fullWidth={true}
            variant="outline"
            className="border-purple-500/30 hover:bg-purple-500/10 w-full text-xs h-8"
            onSuccess={onOutfitAddedToCalendar ? 
              (log) => {
                // Add user_id if it's missing
                const completeLog: OutfitLog = {
                  ...log,
                  user_id: log.user_id || ''
                };
                onOutfitAddedToCalendar(completeLog);
              } : undefined}
          />

          <div className="flex justify-between mt-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs border-white/10 hover:text-blue-300 hover:border-blue-500/30 hover:bg-blue-950/20"
              onClick={() => onEdit(outfit)}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs border-white/10 hover:text-red-300 hover:border-red-500/30 hover:bg-red-950/20"
              onClick={() => onDelete(outfit.id)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Remove
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default OutfitCardActions;
