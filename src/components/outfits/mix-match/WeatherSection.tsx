
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { WeatherInfo } from '@/lib/types';
import WeatherWidget from '@/components/WeatherWidget';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/data/countries';
import { getCitiesByCountry } from '@/services/LocationService';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import StyleQuiz from './StyleQuiz';

interface WeatherSectionProps {
  onWeatherUpdate: (weather: WeatherInfo) => void;
  onSituationChange: (situation: string) => void;
}

const WeatherSection = ({ onWeatherUpdate, onSituationChange }: WeatherSectionProps) => {
  const { savedLocation, saveLocation } = useLocationStorage();
  const [country, setCountry] = useState<string>(savedLocation?.country || 'US');
  const [city, setCity] = useState<string>(savedLocation?.city || 'San Francisco');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  
  useEffect(() => {
    if (country) {
      const cities = getCitiesByCountry(country);
      setAvailableCities(cities);
      
      if (cities.length > 0 && !cities.includes(city)) {
        setCity(cities[0]);
      }
    }
  }, [country, city]);
  
  const handleCountryChange = (value: string) => {
    setCountry(value);
    const cities = getCitiesByCountry(value);
    if (cities.length > 0) {
      setCity(cities[0]);
      saveLocation(cities[0], value);
    }
  };
  
  const handleCityChange = (value: string) => {
    setCity(value);
    saveLocation(value, country);
  };

  const handleQuizComplete = (answers: Record<string, string>) => {
    setQuizComplete(true);
    onSituationChange(answers.activity.toLowerCase());
  };

  const handleRefreshWeather = () => {
    toast.success('Refreshing weather data...');
  };
  
  return (
    <div className="space-y-6">
      <div className="neo-blur border border-white/10 rounded-xl p-4 space-y-4 w-[475px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-white">Weather & Location</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefreshWeather}
            className="h-8 w-8 text-white/70 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-sm text-white/70">Country</Label>
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
            
            <div className="space-y-2">
              <Label className="text-sm text-white/70">City</Label>
              <Select value={city} onValueChange={handleCityChange}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select city" />
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
        </div>
        
        <WeatherWidget 
          className="my-4"
          onWeatherChange={onWeatherUpdate}
          city={city}
          country={country}
          showToasts={true}
        />
      </div>

      <StyleQuiz onComplete={handleQuizComplete} />
    </div>
  );
};

export default WeatherSection;
