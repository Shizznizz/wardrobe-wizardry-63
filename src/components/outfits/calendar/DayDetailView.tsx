
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Outfit, WeatherInfo, ClothingSeason } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Plus, Sun, Cloud, CloudRain, Thermometer, Check, Shirt, MapPin, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { OutfitLog } from '../OutfitLogItem';
import { Badge } from '@/components/ui/badge';
import WeatherWidget from '@/components/WeatherWidget';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Card className="w-full mt-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
          <div className="flex gap-2">
            {isAddingActivity ? (
              <div className={`flex gap-2 items-center ${isMobile ? 'flex-col w-full' : ''}`}>
                <div className="relative w-full">
                  <Input
                    placeholder="Enter activity..."
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="pr-10"
                  />
                  <DialogClose asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={handleCloseActivityInput}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      if (activity.trim()) {
                        onAddActivity(activity.trim());
                        setActivity('');
                        setActivitySuccess(true);
                        setTimeout(() => setActivitySuccess(false), 2000);
                        setIsAddingActivity(false);
                      }
                    }} 
                    variant="outline" 
                    size="sm"
                    className={`${activitySuccess ? "bg-green-500 text-white" : ""} ${isMobile ? "w-full" : ""}`}
                  >
                    {activitySuccess ? <Check className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                    {activitySuccess ? "Added" : "Add"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingActivity(true)}
                className={isMobile ? "w-full" : ""}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Activity
              </Button>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className={isMobile ? "w-full" : ""}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Outfit
                </Button>
              </DialogTrigger>
              <DialogContent className={`${isMobile ? "w-[95vw] max-w-lg" : ""}`}>
                <DialogHeader className="flex justify-between items-center">
                  <DialogTitle>Add Outfit</DialogTitle>
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Select onValueChange={(value) => setSelectedSeason(value as ClothingSeason)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
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
                      setSelectedOutfitId(value);
                      onAddOutfit(value);
                      setOutfitSuccess(true);
                      setTimeout(() => setOutfitSuccess(false), 2000);
                    }}
                    value={selectedOutfitId || undefined}
                    disabled={!selectedSeason || outfitSuccess}
                  >
                    <SelectTrigger className={outfitSuccess ? "border-green-500 bg-green-500/10" : ""}>
                      <SelectValue placeholder={outfitSuccess ? "Outfit Added! ✓" : "Select outfit"} />
                    </SelectTrigger>
                    <SelectContent>
                      {outfits
                        .filter(outfit => !selectedSeason || outfit.seasons.includes(selectedSeason))
                        .map(outfit => (
                          <SelectItem key={outfit.id} value={outfit.id}>
                            {outfit.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {selectedOutfit && (
                    <Card className="bg-slate-800/50 p-4">
                      <div className="flex items-center gap-3">
                        {selectedOutfit.tags && selectedOutfit.tags.includes('image') && (
                          <img 
                            src={selectedOutfit.tags.find(tag => tag.startsWith('http'))} 
                            alt={selectedOutfit.name}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{selectedOutfit.name}</h4>
                          <div className="flex gap-1 mt-1">
                            {selectedOutfit.seasons.map(season => (
                              <Badge key={season} variant="secondary" className="text-xs">
                                {season}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {weatherLocation?.city && (
          <Card className="bg-card/30 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm">
                        O
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Style tips from Olivia</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex-1 py-2 px-3 bg-gray-800/30 rounded-xl border border-white/10">
                  <p className="text-sm text-white/90">{getWeatherMessage() || "Checking the weather forecast..."}</p>
                </div>
              </div>
              {!isMobile && (
                <div className="mt-3">
                  <WeatherWidget
                    city={weatherLocation.city}
                    country={weatherLocation.country}
                    onWeatherChange={onWeatherChange}
                    showToasts={false}
                    showError={false}
                    className="bg-transparent border-none shadow-none p-0"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {outfitLogs.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Planned for this day:</h3>
            {outfitLogs.map(log => (
              <Card key={log.id} className="bg-card/30 hover:bg-card/50 transition-colors">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex flex-col gap-2 w-full">
                    {log.outfitId === 'activity' ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <p className="font-medium">
                          {log.customActivity || log.activity || "Activity"}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shirt className="w-4 h-4 text-primary" />
                            <p className="font-medium">{log.outfitId}</p>
                          </div>
                          {log.activity && (
                            <Badge variant="secondary" className="text-xs">
                              {log.activity}
                            </Badge>
                          )}
                        </div>
                        {getOutfitById(log.outfitId)?.tags?.includes('image') && (
                          <img 
                            src={getOutfitById(log.outfitId)?.tags?.find(tag => tag.startsWith('http'))} 
                            alt={log.outfitId}
                            className="w-full h-32 object-cover rounded-md mt-2"
                          />
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-4 bg-gray-800/20 rounded-xl border border-white/10">
            <p className="text-muted-foreground">
              No outfits or activities planned for this day
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
