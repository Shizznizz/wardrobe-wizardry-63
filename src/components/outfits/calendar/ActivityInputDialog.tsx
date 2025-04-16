
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ActivityInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: string) => void;
}

const ActivityInputDialog = ({ isOpen, onClose, onSubmit }: ActivityInputDialogProps) => {
  const [activity, setActivity] = useState('');

  const handleSubmit = () => {
    if (activity.trim()) {
      onSubmit(activity.trim());
      setActivity('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Add Activity
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Textarea
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="e.g. Birthday dinner, Gym, Festival..."
            className="min-h-[100px] bg-slate-800 border-slate-700 text-white"
          />
          
          {activity.trim() && (
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <Badge variant="outline" className="bg-slate-700/50 gap-2">
                <CalendarDays className="w-4 h-4" />
                {activity}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!activity.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Add Activity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityInputDialog;
