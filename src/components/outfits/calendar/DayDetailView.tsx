
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface DayDetailViewProps {
  selectedDate: Date;
  outfitLogs: OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleOpenLogDialog: (date: Date) => void;
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
  handleOpenLogDialog 
}: DayDetailViewProps) => {
  const formattedDate = format(selectedDate, 'EEEE, MMMM d');
  const hasLogs = outfitLogs && outfitLogs.length > 0;
  
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
                    <div key={log.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
    </AnimatePresence>
  );
};

export default DayDetailView;
