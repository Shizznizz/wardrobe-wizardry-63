
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import { Outfit } from '@/lib/types';
import AddToCalendarButton from '@/components/outfits/AddToCalendarButton';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
      
      <AddToCalendarButton 
        outfit={outfit} 
        fullWidth={true}
        variant="outline"
        className="border-purple-500/30 hover:bg-purple-500/10 w-full text-xs h-8"
        onSuccess={onOutfitAddedToCalendar}
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
    </div>
  );
};

export default OutfitCardActions;
