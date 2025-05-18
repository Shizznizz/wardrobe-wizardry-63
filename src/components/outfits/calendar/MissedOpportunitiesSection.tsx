
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format, subDays, isSameDay } from 'date-fns';
import { Cloud, CloudRain, Sun, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Outfit } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MissedOpportunitiesProps {
  outfitLogs: OutfitLog[];
  outfits: Outfit[];
}

interface MissedOpportunity {
  date: Date;
  weather?: string;
  activity?: string;
}

const MissedOpportunitiesSection = ({ outfitLogs, outfits }: MissedOpportunitiesProps) => {
  const [missedOpportunities, setMissedOpportunities] = useState<MissedOpportunity[]>([]);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { user } = useAuth();

  // Weather conditions for demo
  const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Overcast'];
  const activities = ['Work', 'Casual Day', 'Dinner', 'Date Night', 'Shopping', 'Workout'];

  // Generate demo missed opportunities - in a real app, this would be based on actual data
  useEffect(() => {
    const today = new Date();
    const missedDates: MissedOpportunity[] = [];
    
    // Look back 30 days
    for (let i = 1; i <= 30; i++) {
      const date = subDays(today, i);
      
      // Check if this date has outfit logs
      const hasLogs = outfitLogs.some(log => 
        log.date && isSameDay(new Date(log.date), date)
      );
      
      // Randomly add some missed opportunities (for demo purposes)
      // In a real app, check against activity data
      if (!hasLogs && Math.random() > 0.8) {
        missedDates.push({
          date,
          weather: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
          activity: Math.random() > 0.4 ? activities[Math.floor(Math.random() * activities.length)] : undefined
        });
      }
    }
    
    setMissedOpportunities(missedDates.slice(0, 5)); // Limit to 5 items
  }, [outfitLogs]);

  const handleAssignOutfit = (date: Date) => {
    setSelectedDate(date);
    setIsSelectionOpen(true);
  };

  const getWeatherIcon = (weather?: string) => {
    if (!weather) return null;
    
    if (weather.toLowerCase().includes('rain')) {
      return <CloudRain className="h-5 w-5 text-blue-400" />;
    } else if (weather.toLowerCase().includes('cloud')) {
      return <Cloud className="h-5 w-5 text-gray-400" />;
    } else {
      return <Sun className="h-5 w-5 text-yellow-400" />;
    }
  };

  // If no missed opportunities, show a message
  if (missedOpportunities.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Calendar className="h-10 w-10 mx-auto mb-4 text-purple-400 opacity-60" />
          <p className="text-purple-200">Great job! You haven't missed any opportunities to log your outfits recently.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missedOpportunities.map((opportunity, index) => (
          <Card 
            key={index}
            className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm transition-all hover:bg-slate-800/70"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-medium text-white">
                  {format(opportunity.date, 'EEE, MMM d')}
                </p>
                <div className="flex items-center gap-2">
                  {getWeatherIcon(opportunity.weather)}
                  <span className="text-sm text-white/80">{opportunity.weather}</span>
                </div>
              </div>
              
              {opportunity.activity && (
                <div className="mb-4">
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wide">Activity</span>
                  <p className="text-white/90">{opportunity.activity}</p>
                </div>
              )}
              
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full mt-2 bg-purple-800/30 hover:bg-purple-700/40"
                onClick={() => handleAssignOutfit(opportunity.date)}
              >
                Assign Outfit Retroactively
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isSelectionOpen} onOpenChange={setIsSelectionOpen}>
        <DialogContent className="bg-slate-900 border-purple-500/20 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Assign Outfit for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {outfits.slice(0, 6).map((outfit) => (
                <Card 
                  key={outfit.id}
                  className="bg-slate-800/50 border-purple-500/20 cursor-pointer hover:bg-slate-700/50 transition-all"
                  onClick={() => {
                    // In a real app, call a function to create a log entry
                    // addOutfitLog({ outfitId: outfit.id, date: selectedDate, ... })
                    setIsSelectionOpen(false);
                    // Show success message or update UI
                  }}
                >
                  <CardContent className="p-4">
                    <p className="font-medium text-white mb-1">{outfit.name}</p>
                    <p className="text-sm text-white/70">
                      {outfit.occasions 
                        ? outfit.occasions[0] 
                        : 'Casual'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissedOpportunitiesSection;
