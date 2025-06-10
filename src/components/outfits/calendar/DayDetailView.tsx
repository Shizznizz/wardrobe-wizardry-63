
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash, CalendarDays, Pencil, Shirt, MapPin, AlertCircle } from 'lucide-react';
import { Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import CompactWeather from './CompactWeather';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import OutfitSelectorDialog from './OutfitSelectorDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface DayDetailViewProps {
  selectedDate: Date;
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  onAddOutfit?: (outfitId?: string) => void;
  onAddActivity?: (activity: string) => void;
  weatherLocation?: { city: string; country: string };
  onDeleteLog?: (id: string) => Promise<boolean>;
  onWeatherChange?: (weather: any) => void;
  onReassignOutfit?: (logId: string, newOutfitId: string) => Promise<boolean>;
}

const DayDetailView = ({ 
  selectedDate, 
  outfits, 
  outfitLogs, 
  onAddOutfit,
  onAddActivity,
  weatherLocation,
  onDeleteLog,
  onWeatherChange,
  onReassignOutfit
}: DayDetailViewProps) => {
  const [newActivity, setNewActivity] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [isOutfitSelectorOpen, setIsOutfitSelectorOpen] = useState(false);
  const [currentReassignLogId, setCurrentReassignLogId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setNewActivity('');
    setIsAddingActivity(false);
  }, [selectedDate]);

  const handleAddActivity = async () => {
    if (newActivity.trim() !== '') {
      await onAddActivity?.(newActivity.trim());
      setNewActivity('');
      setIsAddingActivity(false);
    } else {
      toast.error("Please enter an activity");
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (onDeleteLog) {
      const success = await onDeleteLog(id);
      if (success) {
        toast.success("Item removed successfully");
      }
    }
  };

  const handleOpenOutfitSelector = () => {
    onAddOutfit?.();
  };

  const handleReassignOutfit = (logId: string) => {
    setCurrentReassignLogId(logId);
    setIsOutfitSelectorOpen(true);
  };

  const handleOutfitSelected = async (outfitId: string) => {
    if (currentReassignLogId && onReassignOutfit) {
      const success = await onReassignOutfit(currentReassignLogId, outfitId);
      if (success) {
        toast.success("Outfit reassigned successfully");
      } else {
        toast.error("Failed to reassign outfit");
      }
      setCurrentReassignLogId(null);
    } else {
      onAddOutfit?.(outfitId);
    }
    setIsOutfitSelectorOpen(false);
  };

  // Helper function to find outfit details with better error handling
  const getOutfitDetails = (outfitId: string) => {
    if (outfitId === 'activity') return null;
    return outfits.find(o => o.id === outfitId) || null;
  };

  const favoriteOutfits = outfits.filter(outfit => outfit.favorite);
  const hasOutfits = outfits && outfits.length > 0;

  return (
    <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm" data-day-detail>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="text-lg text-purple-200">{format(selectedDate, 'EEEE, MMMM d')}</div>
          <div className="text-sm text-purple-300/70">{format(selectedDate, 'yyyy')}</div>
        </CardTitle>
        <CardDescription>
          {outfitLogs.length > 0 
            ? `${outfitLogs.length} item${outfitLogs.length > 1 ? 's' : ''} planned`
            : "Nothing planned yet"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {weatherLocation?.city && (
          <CompactWeather 
            date={selectedDate}
            weather={null}
            location={weatherLocation}
            onWeatherChange={onWeatherChange}
          />
        )}
        
        {/* Outfit and Activity Logs */}
        {outfitLogs.length > 0 ? (
          <div className="space-y-2">
            {outfitLogs.map(log => {
              const outfitDetails = getOutfitDetails(log.outfitId);
                
              return (
                <div key={log.id} 
                  className="flex items-center justify-between bg-slate-700/30 p-2 rounded-lg border border-slate-600/30">
                  <div className="flex items-center gap-2">
                    {log.outfitId === 'activity' ? (
                      <>
                        <MapPin className="h-4 w-4 text-orange-400" />
                        <span className="text-sm">
                          {log.customActivity || log.activity || "Activity"}
                        </span>
                      </>
                    ) : outfitDetails ? (
                      <>
                        <Shirt className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">{outfitDetails.name}</span>
                        {log.timeOfDay && log.timeOfDay !== 'all-day' && (
                          <span className="text-xs text-slate-400">({log.timeOfDay})</span>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <span className="text-sm text-amber-300">This outfit was deleted</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs py-0 h-6 ml-1 text-blue-400 hover:text-blue-300"
                          onClick={() => handleReassignOutfit(log.id)}
                        >
                          Choose new outfit
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 w-7 p-0 text-gray-400 hover:text-white" 
                      onClick={() => handleDeleteLog(log.id)}>
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-600/30 rounded-lg">
            <CalendarDays className="h-8 w-8 mx-auto mb-2 text-slate-500" />
            No items planned for this day
          </div>
        )}
        
        {/* Add Outfit/Activity Section */}
        <div className={`pt-4 border-t border-slate-600/30 space-y-4 ${isMobile ? 'pb-8' : ''}`}>
          {!isAddingActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={handleOpenOutfitSelector}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-300 flex items-center justify-center gap-2 h-12 font-medium"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Add Outfit
              </Button>

              <Button 
                variant="outline" 
                onClick={() => setIsAddingActivity(true)}
                className="border-orange-400/30 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400/50 shadow-md transition-all duration-300 flex items-center justify-center gap-2 h-12 font-medium"
                size="lg"
              >
                <MapPin className="h-5 w-5" />
                Add Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
              <div className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Add New Activity
              </div>
              <Input 
                placeholder="Enter activity..." 
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 h-12"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                autoFocus
              />
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleAddActivity}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-md flex-1 h-10"
                  size="sm"
                >
                  Add Activity
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingActivity(false)}
                  className="border-slate-500 text-slate-300 hover:bg-slate-600/50 flex-1 h-10"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <OutfitSelectorDialog
        isOpen={isOutfitSelectorOpen}
        onClose={() => {
          setIsOutfitSelectorOpen(false);
          setCurrentReassignLogId(null);
        }}
        onSubmit={handleOutfitSelected}
        outfits={outfits}
      />
    </Card>
  );
};

export default DayDetailView;
