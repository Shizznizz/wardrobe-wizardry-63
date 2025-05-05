import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Outfit, TimeOfDay } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { OutfitLog } from './OutfitLogItem';

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
        timeOfDay: 'morning' as TimeOfDay,
        notes: '',
        weatherCondition: '',
        temperature: ''
      };

      let savedLog: OutfitLog | null = null;
      if (user) {
        const { data, error } = await supabase
          .from('outfit_logs')
          .insert({
            user_id: user.id,
            outfit_id: outfit.id,
            date: selectedDate.toISOString(),
            time_of_day: 'morning',
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
        savedLog = {
          id: Date.now().toString(),
          ...newLog as any
        };
      }

      if (onSuccess && savedLog) {
        onSuccess(savedLog);
      }

      toast.success(`Added "${outfit.name}" to ${format(selectedDate, 'MMMM d')}`);
      setIsOpen(false);
      
      navigate(`/calendar?date=${format(selectedDate, 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Failed to add outfit to calendar:', error);
      toast.error('Failed to add outfit to calendar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={() => setIsOpen(true)} className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <Calendar className="h-4 w-4 mr-2" />
      Add to Calendar
    </Button>
  );
};

export default AddToCalendarButton;
