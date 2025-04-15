import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Outfit, WeatherInfo, ClothingSeason } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Plus, X, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { OutfitLog } from '../OutfitLogItem';
import { Badge } from '@/components/ui/badge';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import CompactWeather from './CompactWeather';
import OutfitPreview from './OutfitPreview';

interface DayDetailViewProps {
  selectedDate: Date;
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  onAddOutfit: (outfitId: string) => void;
  onAddActivity: (activity: string) => void;
  weatherLocation?: { city: string; country: string };
  onWeatherChange?: (weather: WeatherInfo) => void;
}

const DayDetailView = ({
  selectedDate,
  outfits,
  outfitLogs,
  onAddOutfit,
  onAddActivity,
  weatherLocation,
  onWeatherChange
}: DayDetailViewProps) => {
  const [activity, setActivity] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason | ''>('');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activitySuccess, setActivitySuccess] = useState(false);
  const [outfitSuccess, setOutfitSuccess] = useState(false);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Add a helper function to get outfit by ID
  const getOutfitById = (id: string): Outfit | undefined => {
    return outfits.find(outfit => outfit.id === id);
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
          // Use generated weather as fallback
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

  const handleAddActivity = () => {
    if (activity.trim()) {
      onAddActivity(activity.trim());
      setActivity('');
      setActivitySuccess(true);
      setTimeout(() => setActivitySuccess(false), 2000);
      setIsAddingActivity(false);
    }
  };

  const handleAddOutfit = (outfitId: string) => {
    onAddOutfit(outfitId);
    setOutfitSuccess(true);
    setTimeout(() => setOutfitSuccess(false), 2000);
  };
  
  const filteredOutfits = selectedSeason 
    ? outfits.filter(outfit => outfit.seasons.includes(selectedSeason))
    : outfits;

  const getWeatherMessage = () => {
    if (!weather) return null;
    
    const { temperature, condition } = weather;
    const date = format(selectedDate, 'do MMMM');
    
    let suggestion = '';
    
    if (temperature > 25) {
      suggestion = 'light, breathable outfits recommended';
    } else if (temperature > 15) {
      suggestion = 'a light jacket might be nice';
    } else if (temperature > 5) {
      suggestion = 'layer up for comfort';
    } else {
      suggestion = 'bundle up warmly';
    }
    
    return isMobile ? 
      `${temperature}°C, ${condition} – ${suggestion}` :
      `${temperature}°C ${condition} in ${weather.city || weatherLocation?.city || 'your location'} on ${date} – ${suggestion}`;
  };

  const handleCloseActivityInput = () => {
    setIsAddingActivity(false);
    setActivity('');
  };

  const selectedOutfit = selectedOutfitId ? outfits.find(o => o.id === selectedOutfitId) : null;

  return (
    <Card className="w-full mt-4 bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
          <div className="flex gap-2">
            {isAddingActivity ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter activity..."
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full max-w-[200px]"
                />
                <Button 
                  onClick={handleAddActivity} 
                  variant="outline" 
                  size="sm"
                  className={activitySuccess ? "bg-green-500 text-white" : ""}
                >
                  {activitySuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setIsAddingActivity(false);
                    setActivity('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingActivity(true)}
                className={isMobile ? "flex-1" : ""}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Activity
              </Button>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className={isMobile ? "flex-1" : ""}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Outfit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle>Add Outfit</DialogTitle>
                    <DialogClose>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </DialogClose>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <Select onValueChange={(value) => setSelectedSeason(value as ClothingSeason)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="autumn">Autumn</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) => {
                      handleAddOutfit(value);
                      setSelectedOutfitId(value);
                      setOutfitSuccess(true);
                      setTimeout(() => setOutfitSuccess(false), 2000);
                    }}
                    value={selectedOutfitId || undefined}
                    disabled={!selectedSeason || outfitSuccess}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={outfitSuccess ? "Outfit Added! ✓" : "Select outfit"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredOutfits.map(outfit => (
                        <SelectItem key={outfit.id} value={outfit.id}>
                          {outfit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedOutfit && <OutfitPreview outfit={selectedOutfit} />}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {weatherLocation?.city && (
          <div className="flex flex-col gap-3">
            <CompactWeather weather={weather} date={selectedDate} />
          </div>
        )}

        {outfitLogs.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Planned for this day:</h3>
            <div className="grid gap-3">
              {outfitLogs.map(log => (
                <Card key={log.id} className="bg-card/30 hover:bg-card/50 transition-colors">
                  <CardContent className="p-3">
                    {log.outfitId === 'activity' ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-700/50">
                          Activity
                        </Badge>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 px-4 bg-gray-800/20 rounded-xl border border-white/10">
            <p className="text-muted-foreground">
              No outfits or activities planned
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use the buttons above to add your plans
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayDetailView;
