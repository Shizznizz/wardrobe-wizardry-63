
import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { OutfitLog } from './OutfitLogItem';
import { Outfit, TimeOfDay } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AddToCalendarButtonProps {
  outfit: Outfit;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  onSuccess?: (log: OutfitLog) => void;
  className?: string;
}

const AddToCalendarButton = ({
  outfit,
  variant = 'outline',
  size = 'sm',
  fullWidth = false,
  onSuccess,
  className = ''
}: AddToCalendarButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSelectedDate(new Date());
    }
  };

  const handleAddToCalendar = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsSubmitting(true);
    try {
      const newLog: Partial<OutfitLog> = {
        outfitId: outfit.id,
        date: selectedDate,
        timeOfDay: 'morning' as TimeOfDay, // Using a valid TimeOfDay value
        notes: '',
        weatherCondition: '',
        temperature: ''
      };

      // If user is logged in, save to Supabase
      let savedLog: OutfitLog | null = null;
      if (user) {
        const { data, error } = await supabase
          .from('outfit_logs')
          .insert({
            user_id: user.id,
            outfit_id: outfit.id,
            date: selectedDate.toISOString(),
            time_of_day: 'morning', // Using a valid time_of_day value
            notes: '',
            weather_condition: '',
            temperature: ''
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving outfit log:', error);
          toast.error('Failed to add outfit to calendar');
          return;
        }

        savedLog = {
          id: data.id,
          outfitId: data.outfit_id,
          date: new Date(data.date),
          timeOfDay: data.time_of_day as TimeOfDay,
          notes: data.notes,
          weatherCondition: data.weather_condition,
          temperature: data.temperature
        };
      } else {
        // For non-logged in users, save to localStorage via callback
        savedLog = {
          id: Date.now().toString(),
          ...newLog as any
        };
      }

      // Call success callback if provided
      if (onSuccess && savedLog) {
        onSuccess(savedLog);
      }

      toast.success(`Added "${outfit.name}" to ${format(selectedDate, 'MMMM d')}`);
      setIsOpen(false);
      
      // Optionally navigate to calendar page with date preloaded
      // Uncomment the following line to enable navigation
      // navigate(`/calendar?date=${format(selectedDate, 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Failed to add outfit to calendar:', error);
      toast.error('Failed to add outfit to calendar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Add to Calendar
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-slate-900 border-purple-500/20 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Add "{outfit.name}" to Calendar</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 flex flex-col items-center">
            <p className="text-white/70 mb-4">Select a date to schedule this outfit:</p>
            <div className="bg-slate-800 p-2 rounded-lg border border-purple-500/20">
              <CalendarPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="mx-auto"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCalendar}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? 'Saving...' : 'Add to Calendar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToCalendarButton;
