
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Thermometer, Edit, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Outfit } from '@/lib/types';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface OutfitFeedbackSectionProps {
  outfit: Outfit | null;
  onMakeWarmer: () => void;
  onChangeTop: () => void;
  onSaveOutfit: () => void;
}

const OutfitFeedbackSection = ({ 
  outfit,
  onMakeWarmer,
  onChangeTop,
  onSaveOutfit
}: OutfitFeedbackSectionProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  
  const saveFeedback = async (label: string) => {
    if (!user?.id || !outfit) return;
    
    try {
      await supabase.from('outfit_feedback').insert({
        user_id: user.id,
        outfit_id: outfit.id,
        label,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Thanks! Olivia will adjust future outfits accordingly.");
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };
  
  const handleLike = async () => {
    await saveFeedback('like');
  };
  
  const handleDislike = async () => {
    await saveFeedback('dislike');
  };
  
  const handleMakeWarmer = async () => {
    await saveFeedback('warmer');
    onMakeWarmer();
  };
  
  const handleChangeTop = async () => {
    await saveFeedback('change_top');
    onChangeTop();
  };
  
  const handleAddToCalendar = async (date: Date) => {
    if (!user?.id || !outfit) {
      toast.error("Please sign in to save to calendar");
      return;
    }
    
    try {
      await supabase.from('calendar_events').insert({
        user_id: user.id,
        outfit_id: outfit.id,
        date: date.toISOString(),
        activity_tag: outfit.occasion || 'casual'
      });
      
      toast.success(`Outfit scheduled for ${format(date, 'EEEE, MMM d')}`);
      setSelectedDate(undefined);
    } catch (error) {
      console.error("Error adding to calendar:", error);
      toast.error("Couldn't add to calendar");
    }
  };
  
  return (
    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-800/70 border-t border-white/10">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleLike}
        className="border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        Like
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleDislike}
        className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
      >
        <ThumbsDown className="h-4 w-4 mr-2" />
        Dislike
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                handleAddToCalendar(date);
              }
              setSelectedDate(date);
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleMakeWarmer}
        className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
      >
        <Thermometer className="h-4 w-4 mr-2" />
        Warmer
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleChangeTop}
        className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
      >
        <Edit className="h-4 w-4 mr-2" />
        Top
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onSaveOutfit}
        className="border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
      >
        Save
      </Button>
    </div>
  );
};

export default OutfitFeedbackSection;
