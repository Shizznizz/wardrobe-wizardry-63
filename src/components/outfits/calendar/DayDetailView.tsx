
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

interface DayDetailViewProps {
  selectedDate: Date;
  outfitLogs: OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleOpenLogDialog: (date: Date) => void;
  handleEditLog: (log: OutfitLog) => void;
  handleDeleteLog: (logId: string) => Promise<boolean>;
}

// Mapping of activities to emojis
const activityEmojis: Record<string, string> = {
  casual: '👕',
  work: '💼',
  formal: '👔',
  party: '🎉',
  date: '❤️',
  interview: '🎓',
  presentation: '📊',
  dinner: '🍽️',
  sport: '🏃',
  other: '📝'
};

// Mapping of weather conditions to emojis
const weatherEmojis: Record<string, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
  windy: '💨'
};

const DayDetailView = ({ 
  selectedDate, 
  outfitLogs, 
  getOutfitById, 
  handleOpenLogDialog,
  handleEditLog,
  handleDeleteLog
}: DayDetailViewProps) => {
  const formattedDate = format(selectedDate, 'EEEE, MMMM d');
  const hasLogs = outfitLogs && outfitLogs.length > 0;
  const [logToDelete, setLogToDelete] = useState<OutfitLog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const confirmDelete = async () => {
    if (!logToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await handleDeleteLog(logToDelete.id);
      if (success) {
        toast.success("Outfit log deleted successfully");
      } else {
        toast.error("Failed to delete outfit log");
      }
    } finally {
      setIsDeleting(false);
      setLogToDelete(null);
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={format(selectedDate, 'yyyy-MM-dd')}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm mt-4">
          <CardContent className="p-4">
            {hasLogs ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-100">
                  {formattedDate} – Logged Outfit{outfitLogs.length > 1 ? 's' : ''}
                </h3>
                
                {outfitLogs.map((log) => {
                  const outfit = getOutfitById(log.outfitId);
                  if (!outfit) return null;
                  
                  const activityEmoji = log.activity ? activityEmojis[log.activity] : '';
                  const weatherEmoji = log.weatherCondition ? weatherEmojis[log.weatherCondition] : '';
                  const activityName = log.activity === 'other' && log.customActivity ? log.customActivity : log.activity;
                  
                  return (
                    <div key={log.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 relative">
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-purple-300 hover:text-purple-100 hover:bg-slate-600/50"
                          onClick={() => handleEditLog(log)}
                          title="Edit outfit log"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-300 hover:text-red-100 hover:bg-slate-600/50"
                          onClick={() => setLogToDelete(log)}
                          title="Delete outfit log"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-16">
                        <div>
                          <p className="flex items-center text-white">
                            <span className="font-semibold mr-2">Look:</span> 
                            {outfit.name}
                          </p>
                          
                          {activityName && (
                            <p className="flex items-center text-purple-100">
                              <span className="font-semibold mr-2">Occasion:</span>
                              {activityEmoji && <span className="mr-1">{activityEmoji}</span>}
                              {activityName}
                            </p>
                          )}
                          
                          {log.timeOfDay && (
                            <p className="text-purple-100">
                              <span className="font-semibold mr-2">Time:</span> 
                              {log.timeOfDay}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          {(log.weatherCondition || log.temperature) && (
                            <p className="text-purple-100">
                              <span className="font-semibold mr-2">Weather:</span>
                              {weatherEmoji && <span className="mr-1">{weatherEmoji}</span>}
                              {log.weatherCondition}
                              {log.weatherCondition && log.temperature && ', '}
                              {log.temperature}
                            </p>
                          )}
                          
                          {log.notes && (
                            <p className="text-purple-100">
                              <span className="font-semibold mr-2">Notes:</span>
                              <span className="italic">"{log.notes}"</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <Button
                  onClick={() => handleOpenLogDialog(selectedDate)}
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Another Outfit
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-lg text-purple-100 mb-4">
                  No outfit or activity planned for this day yet.
                </p>
                <Button
                  onClick={() => handleOpenLogDialog(selectedDate)}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Outfit & Activity
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <AlertDialog open={!!logToDelete} onOpenChange={(open) => !open && setLogToDelete(null)}>
        <AlertDialogContent className="bg-slate-800 border-purple-500/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outfit Log</AlertDialogTitle>
            <AlertDialogDescription className="text-purple-200">
              Are you sure you want to delete this outfit log for {logToDelete ? format(logToDelete.date, 'MMMM d, yyyy') : ''}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
};

export default DayDetailView;
