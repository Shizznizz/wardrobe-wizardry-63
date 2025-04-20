
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { WeatherInfo } from '@/lib/types';
import WeatherWidget from '@/components/WeatherWidget';

interface WeatherSectionProps {
  onWeatherUpdate: (weather: WeatherInfo) => void;
  onSituationChange: (situation: string) => void;
}

const WeatherSection = ({ onWeatherUpdate, onSituationChange }: WeatherSectionProps) => {
  const [city, setCity] = useState<string>('San Francisco');
  const [country, setCountry] = useState<string>('USA');
  const [situation, setSituation] = useState<string>('casual');
  
  const handleSituationChange = (value: string) => {
    setSituation(value);
    onSituationChange(value);
  };
  
  const handleUpdateLocation = () => {
    if (!city || !country) {
      toast.error('Please enter both city and country');
      return;
    }
    toast.success(`Location updated to ${city}, ${country}`);
  };
  
  const handleDetectLocation = () => {
    // This would use the browser's geolocation API in a real implementation
    toast.success('Detecting your location...');
    setTimeout(() => {
      setCity('San Francisco');
      setCountry('USA');
      toast.success('Location detected: San Francisco, USA');
    }, 1000);
  };

  const handleRefreshWeather = () => {
    toast.success('Refreshing weather data...');
    // Trigger weather update
    if (city && country) {
      handleUpdateLocation();
    }
  };
  
  return (
    <div className="neo-blur border border-white/10 rounded-xl p-4 space-y-4">
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
        <div className="flex gap-2">
          <Input 
            placeholder="City" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-white/5 border-white/10"
          />
          <Input 
            placeholder="Country" 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-white/5 border-white/10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
            onClick={handleUpdateLocation}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Update Location
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
            onClick={handleDetectLocation}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Detect Location
          </Button>
        </div>
      </div>
      
      <WeatherWidget 
        className="my-4"
        onWeatherChange={onWeatherUpdate}
        city={city}
        country={country}
        showToasts={true}
      />
      
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-sm font-medium text-white/70 mb-3">I'm dressing for:</h4>
        <RadioGroup 
          value={situation} 
          onValueChange={handleSituationChange}
          className="flex flex-wrap gap-2"
        >
          {['casual', 'work', 'formal', 'date', 'sport'].map((option) => (
            <div key={option} className="flex items-center space-x-1">
              <RadioGroupItem 
                value={option} 
                id={`situation-${option}`} 
                className="hidden"
              />
              <Label 
                htmlFor={`situation-${option}`}
                className={`px-4 py-2 text-sm rounded-full cursor-pointer capitalize transition-colors ${
                  situation === option 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default WeatherSection;
