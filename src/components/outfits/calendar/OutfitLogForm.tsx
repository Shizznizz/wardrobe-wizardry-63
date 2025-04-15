
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Textarea } from '@/components/ui/textarea';

interface OutfitLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: Outfit[];
  selectedDate?: Date;
  onSubmit: (data: Omit<OutfitLog, 'id'>) => void;
  editMode?: boolean;
  initialData?: OutfitLog | null;
}

const OutfitLogForm = ({
  isOpen,
  onClose,
  outfits,
  selectedDate,
  onSubmit,
  editMode = false,
  initialData
}: OutfitLogFormProps) => {
  // Simple state management for the form
  const [outfitId, setOutfitId] = React.useState(initialData?.outfitId || '');
  const [timeOfDay, setTimeOfDay] = React.useState(initialData?.timeOfDay || 'day');
  const [notes, setNotes] = React.useState(initialData?.notes || '');
  
  React.useEffect(() => {
    if (initialData) {
      setOutfitId(initialData.outfitId);
      setTimeOfDay(initialData.timeOfDay || 'day');
      setNotes(initialData.notes || '');
    } else {
      // Reset form when opening for a new entry
      setOutfitId('');
      setTimeOfDay('day');
      setNotes('');
    }
  }, [initialData, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!outfitId) return;
    
    onSubmit({
      outfitId,
      date: selectedDate || new Date(),
      timeOfDay,
      notes,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-purple-200">
            {editMode ? 'Edit Outfit Log' : 'Add Outfit to Calendar'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {selectedDate ? `For ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select an outfit to log'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outfit">Select Outfit</Label>
            <Select value={outfitId} onValueChange={setOutfitId}>
              <SelectTrigger id="outfit">
                <SelectValue placeholder="Choose an outfit" />
              </SelectTrigger>
              <SelectContent>
                {outfits.map(outfit => (
                  <SelectItem key={outfit.id} value={outfit.id}>
                    {outfit.name || 'Unnamed Outfit'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeOfDay">Time of Day</Label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger id="timeOfDay">
                <SelectValue placeholder="When will you wear it?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Any notes about this outfit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!outfitId}>
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitLogForm;
