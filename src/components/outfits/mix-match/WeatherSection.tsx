
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, Droplets, Thermometer, MapPin } from 'lucide-react';
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
  
  return (
    <div className="neo-blur border border-white/10 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium text-white mb-2">Your Weather</h3>
      
      <WeatherWidget 
        className="mb-4"
        onWeatherChange={onWeatherUpdate}
        city={city}
        country={country}
        showToasts={true}
      />
      
      <div className="space-y-3">
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
            Update
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
            onClick={handleDetectLocation}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Detect
          </Button>
        </div>
      </div>
      
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
                className={`px-3 py-1 text-xs rounded-full cursor-pointer capitalize transition-colors ${
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
