
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Outfit, TimeOfDay, Activity } from '@/lib/types';
import { OutfitLog } from '../OutfitLogItem';
import { CalendarIcon, X } from 'lucide-react';

interface OutfitLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: Outfit[];
  selectedDate: Date;
  onSubmit: (data: Omit<OutfitLog, 'id'>) => void;
  editMode?: boolean;
  initialData?: OutfitLog | null;
}

const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
const timeOfDayOptions: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
const activityOptions: Activity[] = ['casual', 'work', 'formal', 'party', 'date', 'interview', 'presentation', 'dinner', 'sport', 'other'];

const OutfitLogForm = ({ 
  isOpen, 
  onClose, 
  outfits, 
  selectedDate, 
  onSubmit,
  editMode = false,
  initialData = null
}: OutfitLogFormProps) => {
  const [date, setDate] = useState<Date>(selectedDate);
  const [outfitId, setOutfitId] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [weatherCondition, setWeatherCondition] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [activity, setActivity] = useState<Activity | ''>('');
  const [customActivity, setCustomActivity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [askForAiSuggestion, setAskForAiSuggestion] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Populate form with initialData when in edit mode
  useEffect(() => {
    if (initialData && editMode) {
      setDate(new Date(initialData.date));
      setOutfitId(initialData.outfitId);
      // Type assertion to ensure proper types
      setTimeOfDay(initialData.timeOfDay as TimeOfDay || 'morning');
      setWeatherCondition(initialData.weatherCondition || '');
      setTemperature(initialData.temperature || '');
      setActivity(initialData.activity as Activity | '' || '');
      setCustomActivity(initialData.customActivity || '');
      setNotes(initialData.notes || '');
      setAskForAiSuggestion(initialData.askForAiSuggestion || false);
    } else {
      // Reset form when not in edit mode
      setDate(selectedDate);
      setOutfitId('');
      setTimeOfDay('morning');
      setWeatherCondition('');
      setTemperature('');
      setActivity('');
      setCustomActivity('');
      setNotes('');
      setAskForAiSuggestion(false);
    }
  }, [initialData, editMode, isOpen, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outfitId) return;
    
    setIsSubmitting(true);
    
    try {
      const logData: Omit<OutfitLog, 'id'> = {
        outfitId,
        date,
        timeOfDay,
        weatherCondition: weatherCondition || undefined,
        temperature: temperature || undefined,
        activity: activity as Activity | undefined,
        customActivity: activity === 'other' ? customActivity : undefined,
        notes: notes || undefined,
        askForAiSuggestion,
      };
      
      await onSubmit(logData);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setOutfitId('');
    setTimeOfDay('morning');
    setWeatherCondition('');
    setTemperature('');
    setActivity('');
    setCustomActivity('');
    setNotes('');
    setAskForAiSuggestion(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {editMode ? 'Edit Outfit Log' : 'Log an Outfit'}
          </DialogTitle>
          
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outfit">Select Outfit</Label>
            <Select 
              value={outfitId} 
              onValueChange={setOutfitId}
            >
              <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select an outfit" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {outfits.map((outfit) => (
                  <SelectItem key={outfit.id} value={outfit.id}>
                    {outfit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-slate-800 border-slate-700 text-white justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="bg-slate-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeOfDay">Time of Day</Label>
            <Select 
              value={timeOfDay} 
              onValueChange={(value: string) => setTimeOfDay(value as TimeOfDay)}
            >
              <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select time of day" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {timeOfDayOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weather">Weather (Optional)</Label>
              <Select 
                value={weatherCondition} 
                onValueChange={setWeatherCondition}
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Weather condition" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="">None</SelectItem>
                  {weatherOptions.map((weather) => (
                    <SelectItem key={weather} value={weather}>
                      {weather.charAt(0).toUpperCase() + weather.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (Optional)</Label>
              <Input
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 20°C"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activity">Activity/Occasion (Optional)</Label>
            <Select 
              value={activity} 
              onValueChange={(value: string) => setActivity(value as Activity | '')}
            >
              <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select activity or occasion" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="">None</SelectItem>
                {activityOptions.map((activityOption) => (
                  <SelectItem key={activityOption} value={activityOption}>
                    {activityOption.charAt(0).toUpperCase() + activityOption.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {activity === 'other' && (
              <div className="mt-2">
                <Input
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  placeholder="Specify the activity"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this outfit..."
              className="min-h-[80px] bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!outfitId || isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? 'Saving...' : editMode ? 'Update Outfit' : 'Save Log'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitLogForm;
