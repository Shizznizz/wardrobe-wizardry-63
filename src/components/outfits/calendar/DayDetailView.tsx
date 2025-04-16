import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Outfit, WeatherInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { OutfitLog } from '../OutfitLogItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import CompactWeather from './CompactWeather';
import OutfitPreview from './OutfitPreview';
import OutfitSelectorDialog from './OutfitSelectorDialog';
import ActivityInputDialog from './ActivityInputDialog';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';

interface DayDetailViewProps {
  selectedDate: Date;
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  onAddOutfit: (outfitId: string) => void;
  onAddActivity: (activity: string) => void;
  weatherLocation?: { city: string; country: string };
  onWeatherChange?: (weather: WeatherInfo) => void;
  onDeleteLog?: (logId: string) => Promise<boolean>;
}

const DayDetailView = ({
  selectedDate,
  outfits,
  outfitLogs,
  onAddOutfit,
  onAddActivity,
  weatherLocation,
  onWeatherChange,
  onDeleteLog
}: DayDetailViewProps) => {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [isAddingOutfit, setIsAddingOutfit] = useState(false);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const isMobile = useIsMobile();
  
  const getWeatherBasedTip = (weather: WeatherInfo | null, date: Date) => {
    if (!weather) return "Getting weather information...";
    
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    const month = date.getMonth();
    const season = month >= 2 && month <= 4 ? 'spring' :
                  month >= 5 && month <= 7 ? 'summer' :
                  month >= 8 && month <= 10 ? 'autumn' : 'winter';
    
    if (condition.includes('rain')) {
      return `Don't forget your umbrella and waterproof layers for the ${temp}°C rainy weather!`;
    }
    
    if (season === 'summer' && temp > 25) {
      return "Stay cool with breathable fabrics and light colors today!";
    }
    
    if (season === 'winter' && temp < 5) {
      return "Bundle up with warm layers and don't forget your scarf!";
    }
    
    if (condition.includes('wind')) {
      return "Consider a windbreaker or layered outfit today.";
    }
    
    return temp < 15 ? "Layer up for comfort in the cool weather." :
           temp < 20 ? "Perfect weather for a light jacket or cardigan." :
           "Opt for comfortable, breathable clothing today.";
  };

  useEffect(() => {
    const getWeather = async () => {
      if (weatherLocation?.city && weatherLocation?.country) {
        try {
          const data = await fetchWeatherData(weatherLocation.city, weatherLocation.country);
          setWeather(data);
          if (onWeatherChange) {
            onWeatherChange(data);
          }
        } catch (error) {
          console.error("Failed to fetch weather data:", error);
          const randomWeather = generateRandomWeather(weatherLocation.city, weatherLocation.country);
          setWeather(randomWeather);
          if (onWeatherChange) {
            onWeatherChange(randomWeather);
          }
        }
      }
    };
    
    getWeather();
  }, [weatherLocation, onWeatherChange]);

  const handleDeleteLog = async (logId: string) => {
    if (onDeleteLog) {
      const success = await onDeleteLog(logId);
      if (success) {
        toast.success('Item removed successfully');
      } else {
        toast.error('Failed to remove item');
      }
    }
  };

  const getOutfitById = (id: string) => {
    return outfits.find(outfit => outfit.id === id);
  };

  return (
    <Card className="w-full mt-4 bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingActivity(true)}
              className={isMobile ? "flex-1" : ""}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Activity
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingOutfit(true)}
              className={isMobile ? "flex-1" : ""}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Outfit
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {weatherLocation?.city && (
          <div className="flex flex-col gap-3">
            <CompactWeather 
              weather={weather} 
              date={selectedDate}
              customTip={getWeatherBasedTip(weather, selectedDate)}
            />
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Planned for this day:</h3>
          <div className="grid gap-3">
            {outfitLogs.map(log => (
              <Card key={log.id} className="bg-card/30 hover:bg-card/50 transition-colors">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    {log.outfitId === 'activity' ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm">
                          {log.customActivity || log.activity || "Activity"}
                        </p>
                      </div>
                    ) : (
                      <>
                        {getOutfitById(log.outfitId) && (
                          <OutfitPreview 
                            outfit={getOutfitById(log.outfitId)!} 
                            isCompact={isMobile}
                          />
                        )}
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>

      <ActivityInputDialog
        isOpen={isAddingActivity}
        onClose={() => setIsAddingActivity(false)}
        onSubmit={onAddActivity}
      />

      <OutfitSelectorDialog
        isOpen={isAddingOutfit}
        onClose={() => setIsAddingOutfit(false)}
        onSubmit={onAddOutfit}
        outfits={outfits}
      />
    </Card>
  );
};

export default DayDetailView;
