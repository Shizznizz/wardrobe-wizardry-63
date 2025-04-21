
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
import { useLocation } from '@/hooks/useLocation';
import StyleQuiz from './StyleQuiz';

interface WeatherSectionProps {
  onWeatherUpdate: (weather: WeatherInfo) => void;
  onSituationChange: (situation: string) => void;
}

const WeatherSection = ({ onWeatherUpdate, onSituationChange }: WeatherSectionProps) => {
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
  const [weatherKey, setWeatherKey] = useState(0); // Used to force WeatherWidget refresh
  
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
      }
    } else {
      toast.error('Please select both country and city');
    }
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
                  Use Current Location
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
        </div>
        
        <WeatherWidget 
          key={weatherKey}
          className="my-4"
          onWeatherChange={onWeatherUpdate}
          city={city}
          country={country}
          showToasts={true}
          savePreferences={false} // We handle saving with explicit button
        />
      </div>

      <StyleQuiz onComplete={handleQuizComplete} />
    </div>
  );
};

export default WeatherSection;
