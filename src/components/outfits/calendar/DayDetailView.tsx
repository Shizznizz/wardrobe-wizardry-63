
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Outfit, WeatherInfo, ClothingSeason } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sun, Cloud, CloudRain, Thermometer, Check, Shirt, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { OutfitLog } from '../OutfitLogItem';
import { Badge } from '@/components/ui/badge';
import WeatherWidget from '@/components/WeatherWidget';
import { fetchWeatherData, generateRandomWeather } from '@/services/WeatherService';
import { toast } from 'sonner';

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
    
    const { temperature, condition, icon } = weather;
    const date = format(selectedDate, 'do MMMM');
    const city = weather.city || weatherLocation?.city || 'your location';
    
    let emoji = '☀️';
    let suggestion = '';
    
    if (icon === 'sun') {
      emoji = '☀️';
      suggestion = temperature > 20 
        ? 'Time to grab those sunglasses and a flowy outfit!'
        : 'Perfect for a light jacket and your favorite accessories!';
    } else if (icon === 'cloud') {
      emoji = '☁️';
      suggestion = 'I\'d suggest a light jacket and your comfy boots!';
    } else if (icon === 'rain') {
      emoji = '🌧️';
      suggestion = 'Don\'t forget your umbrella and a waterproof coat!';
    } else if (icon === 'snow') {
      emoji = '❄️';
      suggestion = 'Bundle up with a warm coat, scarf, and boots!';
    }
    
    return `${emoji} ${condition ? condition.charAt(0).toUpperCase() + condition.slice(1) : 'Looks like'} ${temperature}°C in ${city} on ${date} – ${suggestion}`;
  };

  return (
    <Card className="w-full mt-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
          <div className="flex gap-2">
            {isAddingActivity ? (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Enter activity..."
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-48"
                />
                <Button 
                  onClick={handleAddActivity} 
                  variant="outline" 
                  size="sm"
                  className={activitySuccess ? "bg-green-500 text-white" : ""}
                >
                  {activitySuccess ? <Check className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  {activitySuccess ? "Added" : "Add"}
                </Button>
                <Button 
                  onClick={() => setIsAddingActivity(false)} 
                  variant="ghost" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingActivity(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Activity
              </Button>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Outfit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Outfit</DialogTitle>
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
                    onValueChange={handleAddOutfit} 
                    disabled={!selectedSeason || outfitSuccess}
                  >
                    <SelectTrigger className={outfitSuccess ? "border-green-500 bg-green-500/10" : ""}>
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Olivia's Weather Advice */}
        {weatherLocation?.city && (
          <Card className="bg-card/30 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg">
                  O
                </div>
                <div className="flex-1 p-3 bg-gray-800/30 rounded-xl border border-white/10">
                  <p className="text-sm text-white/90">{getWeatherMessage() || "Checking the weather forecast for this day..."}</p>
                </div>
              </div>
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
            </CardContent>
          </Card>
        )}

        {/* Logged Items */}
        {outfitLogs.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Planned for this day:</h3>
            {outfitLogs.map(log => (
              <Card key={log.id} className="bg-card/30 hover:bg-card/50 transition-colors">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    {log.outfitId === 'activity' ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <p className="font-medium">
                          {log.customActivity || log.activity || "Activity"}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Shirt className="w-4 h-4 text-primary" />
                          <p className="font-medium">{log.outfitId}</p>
                        </div>
                        {log.activity && (
                          <Badge variant="secondary" className="mt-1 w-fit">
                            {log.activity}
                          </Badge>
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
