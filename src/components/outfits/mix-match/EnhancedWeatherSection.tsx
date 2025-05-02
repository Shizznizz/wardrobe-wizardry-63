
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw, Thermometer, Sun, Cloud, CloudRain, Snowflake, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { WeatherInfo } from '@/lib/types';
import WeatherWidget from '@/components/WeatherWidget';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/data/countries';
import { getCitiesByCountry } from '@/services/LocationService';
import { useLocation } from '@/hooks/useLocation';
import StyleQuiz from './StyleQuiz';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface EnhancedWeatherSectionProps {
  onWeatherUpdate: (weather: WeatherInfo) => void;
  onSituationChange: (situation: string) => void;
  onTemperatureChange: (temp: number) => void;
  onWeatherConditionChange: (condition: string) => void;
  temperature: number;
  weatherCondition: string;
}

const EnhancedWeatherSection = ({ 
  onWeatherUpdate, 
  onSituationChange,
  onTemperatureChange,
  onWeatherConditionChange,
  temperature,
  weatherCondition
}: EnhancedWeatherSectionProps) => {
  const { 
    country, 
    city, 
    handleCountryChange, 
    handleCityChange, 
    detectLocation, 
    saveLocationPreference, 
    isDetecting, 
    isSavingPreference 
  } = useLocation();
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [weatherKey, setWeatherKey] = useState(0);
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  
  useEffect(() => {
    if (country) {
      const cities = getCitiesByCountry(country);
      setAvailableCities(cities);
    }
  }, [country]);
  
  const handleQuizComplete = (answers: Record<string, string>) => {
    setQuizComplete(true);
    onSituationChange(answers.activity.toLowerCase());
  };

  const handleRefreshWeather = () => {
    setWeatherKey(prev => prev + 1);
    toast.success('Refreshing weather data...');
  };

  const handleSaveLocation = async () => {
    if (country && city) {
      const success = await saveLocationPreference();
      if (success) {
        handleRefreshWeather();
        setLocationOpen(false);
      }
    } else {
      toast.error('Please select both country and city');
    }
  };

  const handleLocalWeatherUpdate = (weather: WeatherInfo) => {
    setWeatherData(weather);
    onWeatherUpdate(weather);
    
    if (weather.temperature) {
      onTemperatureChange(weather.temperature);
    }
    
    if (weather.condition) {
      onWeatherConditionChange(weather.condition.toLowerCase());
    }
  };
  
  const getWeatherIcon = () => {
    switch(weatherCondition) {
      case 'clear': return <Sun className="h-5 w-5 text-yellow-400" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-blue-300" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'snowy': return <Snowflake className="h-5 w-5 text-cyan-200" />;
      case 'windy': return <Wind className="h-5 w-5 text-slate-300" />;
      default: return <Sun className="h-5 w-5 text-yellow-400" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="neo-blur border border-white/10 rounded-xl overflow-hidden bg-slate-800/50 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Weather Widget Column */}
          <div className="p-4 md:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Weather</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleRefreshWeather}
                className="h-8 w-8 text-white/70 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <Collapsible
              open={locationOpen}
              onOpenChange={setLocationOpen}
              className="mb-3"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs border-white/20 text-white/70 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {country && city ? `${city}, ${country}` : 'Set Location'}
                  </div>
                  {locationOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/70">Country</Label>
                    <Select value={country} onValueChange={handleCountryChange}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 max-h-[200px]">
                        {countries.map(c => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/70">City</Label>
                    <Select 
                      value={city} 
                      onValueChange={handleCityChange}
                      disabled={!country || availableCities.length === 0}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder={!country ? "Select country first" : "Select city"} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 max-h-[200px]">
                        {availableCities.map(cityName => (
                          <SelectItem key={cityName} value={cityName}>
                            {cityName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={detectLocation} 
                    disabled={isDetecting}
                    className="text-xs border-white/20 text-white/70 flex-1"
                  >
                    {isDetecting ? 'Detecting...' : (
                      <>
                        <MapPin className="h-3 w-3 mr-1" />
                        Current Location
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveLocation} 
                    disabled={isSavingPreference || !country || !city}
                    className="text-xs border-white/20 text-white/70 flex-1"
                  >
                    {isSavingPreference ? 'Saving...' : 'Save Preference'}
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <WeatherWidget 
              key={weatherKey}
              className="mb-3"
              onWeatherChange={handleLocalWeatherUpdate}
              city={city}
              country={country}
              showToasts={false}
              savePreferences={false}
              compact={true}
            />
          </div>
          
          {/* Temperature and Conditions Column */}
          <div className="p-4 md:col-span-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2 text-red-400" />
                  <h4 className="text-sm font-medium text-white">Temperature</h4>
                </div>
                <Badge variant="outline" className="bg-slate-700/50 text-xs">
                  {temperature}°C
                </Badge>
              </div>
              <Slider 
                defaultValue={[temperature]} 
                value={[temperature]}
                min={-10} 
                max={40} 
                step={1}
                onValueChange={(value) => onTemperatureChange(value[0])}
                className="mt-3"
              />
              <div className="flex justify-between mt-2 text-xs text-white/60">
                <span>Cold</span>
                <span>Cool</span>
                <span>Mild</span>
                <span>Warm</span>
                <span>Hot</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-white">Condition</h4>
                <div className="flex items-center gap-1.5">
                  {getWeatherIcon()}
                  <Badge variant="outline" className="bg-slate-700/50 text-xs">
                    {weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1)}
                  </Badge>
                </div>
              </div>
              <Select value={weatherCondition} onValueChange={onWeatherConditionChange}>
                <SelectTrigger className="bg-slate-700/50 border-white/10">
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  <SelectItem value="clear">Clear</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="snowy">Snowy</SelectItem>
                  <SelectItem value="windy">Windy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Style Quiz Column */}
          <div className="p-4 md:col-span-1">
            <StyleQuiz onComplete={handleQuizComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWeatherSection;
