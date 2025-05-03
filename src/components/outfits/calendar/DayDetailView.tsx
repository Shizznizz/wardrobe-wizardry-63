import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash, CalendarDays, Pencil, Shirt, MapPin } from 'lucide-react';
import { Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import CompactWeather from './CompactWeather';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface DayDetailViewProps {
  selectedDate: Date;
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  onAddOutfit?: (outfitId: string) => void;
  onAddActivity?: (activity: string) => void;
  weatherLocation?: { city: string; country: string };
  onDeleteLog?: (id: string) => Promise<boolean>;
  onWeatherChange?: (weather: any) => void;
}

const DayDetailView = ({ 
  selectedDate, 
  outfits, 
  outfitLogs, 
  onAddOutfit,
  onAddActivity,
  weatherLocation,
  onDeleteLog,
  onWeatherChange
}: DayDetailViewProps) => {
  const [newActivity, setNewActivity] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  useEffect(() => {
    // Reset the activity input state when the selected date changes
    setNewActivity('');
    setIsAddingActivity(false);
  }, [selectedDate]);

  const handleAddActivity = () => {
    if (newActivity.trim() !== '') {
      onAddActivity?.(newActivity.trim());
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

  const favoriteOutfits = outfits.filter(outfit => outfit.favorite);

  return (
    <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
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
              // Find the outfit details for outfit logs
              const outfitDetails = log.outfitId !== 'activity' 
                ? outfits.find(o => o.id === log.outfitId) 
                : null;
                
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
                      </>
                    ) : (
                      <span className="text-sm text-red-300">Unknown outfit</span>
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
          <div className="text-center py-4 text-slate-400 text-sm">
            No items planned for this day
          </div>
        )}
        
        {/* Add Outfit/Activity Section */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-600/30">
          {!isAddingActivity ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Outfit
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-2 bg-slate-800 border-purple-500/30">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium mb-2">Quick add outfit:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {favoriteOutfits.length > 0 ? (
                        favoriteOutfits.slice(0, 6).map(outfit => (
                          <Button 
                            key={outfit.id} 
                            variant="outline" 
                            size="sm"
                            className="text-xs justify-start truncate"
                            onClick={() => {
                              onAddOutfit?.(outfit.id);
                            }}>
                            <Shirt className="h-3 w-3 mr-1 text-purple-400" />
                            {outfit.name}
                          </Button>
                        ))
                      ) : (
                        <div className="col-span-2 text-center text-xs text-slate-400 p-2">
                          No favorite outfits found
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
          
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setIsAddingActivity(true)}>
                <MapPin className="h-4 w-4 mr-1" />
                Add Activity
              </Button>
            </>
          ) : (
            <div className="flex w-full items-center gap-1">
              <Input 
                placeholder="Enter activity..." 
                className="text-xs h-8 bg-slate-700/50"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
              />
              <Button 
                size="sm" 
                className="h-8" 
                onClick={handleAddActivity}>
                Add
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8" 
                onClick={() => setIsAddingActivity(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayDetailView;
