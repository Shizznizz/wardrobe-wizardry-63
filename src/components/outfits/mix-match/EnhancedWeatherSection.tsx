import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw, Briefcase, Dumbbell, Sun, ChevronUp, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { WeatherInfo } from '@/lib/types';
import WeatherWidget from '@/components/WeatherWidget';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/data/countries';
import { getCitiesByCountry } from '@/services/LocationService';
import { useLocation } from '@/hooks/useLocation';
import StyleQuiz from './StyleQuiz';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';

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
    isSavingPreference,
    hasLocationPreference,
    clearLocation
  } = useLocation();
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [weatherKey, setWeatherKey] = useState(1); // Start with 1 to auto-load
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [activitySectionOpen, setActivitySectionOpen] = useState(true);
  const [shouldAutoLoad, setShouldAutoLoad] = useState(false);
  
  useEffect(() => {
    if (country) {
      const cities = getCitiesByCountry(country);
      setAvailableCities(cities);
    }
  }, [country]);
  
  // Check if we should auto-load weather based on saved preferences
  useEffect(() => {
    if (hasLocationPreference && country && city) {
      setShouldAutoLoad(true);
    }
  }, [hasLocationPreference, country, city]);
  
  // Handle quiz completion
  const handleQuizComplete = (answers: Record<string, string>) => {
    if (answers.activity) {
      onSituationChange(answers.activity.toLowerCase());
    }
  };

  // Handle weather refresh
  const handleRefreshWeather = () => {
    console.log("Weather refresh requested");
    setWeatherKey(prev => prev + 1);
    setShouldAutoLoad(true);
    toast.success('Refreshing weather data...');
  };

  // Handle location save
  const handleSaveLocation = async () => {
    if (country && city) {
      console.log(`Saving location preference: ${city}, ${country}`);
      const success = await saveLocationPreference();
      if (success) {
        handleRefreshWeather();
        setLocationOpen(false);
      }
    } else {
      toast.error('Please select both country and city');
    }
  };

  // Handle weather update from widget with improved debugging
  const handleLocalWeatherUpdate = (weather: WeatherInfo) => {
    console.log("Weather update received:", weather);
    setWeatherData(weather);
    onWeatherUpdate(weather);
    
    if (weather.temperature) {
      console.log(`Setting temperature to ${weather.temperature}`);
      onTemperatureChange(weather.temperature);
    }
    
    if (weather.condition) {
      console.log(`Setting condition to ${weather.condition.toLowerCase()}`);
      onWeatherConditionChange(weather.condition.toLowerCase());
    }
  };
  
  // Activity icons for the activity section
  const activityIcons = {
    work: <Briefcase className="h-4 w-4 mr-1" />,
    sport: <Dumbbell className="h-4 w-4 mr-1" />,
    casual: <Sun className="h-4 w-4 mr-1" />,
    formal: <Calendar className="h-4 w-4 mr-1" />,
    party: <Sun className="h-4 w-4 mr-1" />
  };
  
  // Handle clear location
  const handleClearLocation = () => {
    clearLocation();
    setShouldAutoLoad(false);
    setWeatherKey(prev => prev + 1);
    toast.info('Location cleared');
  };
  
  return (
    <div className="space-y-6">
      {/* Weather Section */}
      <Card className="neo-blur border border-white/20 rounded-xl overflow-hidden backdrop-blur-md shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Weather Widget Column */}
          <div className="p-4 md:p-0 md:col-span-1 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 md:pb-0">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Sun className="h-5 w-5 mr-2 text-yellow-400" />
                Today's Weather
              </h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleRefreshWeather}
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <Collapsible
              open={locationOpen}
              onOpenChange={setLocationOpen}
              className="px-4 pb-2"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs border-white/20 text-white/80 flex items-center justify-between bg-slate-700/50 mb-3"
                >
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {country && city ? `${city}, ${country}` : 'Set Location'}
                  </div>
                  {locationOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Select value={country} onValueChange={handleCountryChange}>
                      <SelectTrigger className="bg-slate-700/60 border-white/20 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20 max-h-[200px]">
                        {countries.map(c => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Select 
                      value={city} 
                      onValueChange={handleCityChange}
                      disabled={!country || availableCities.length === 0}
                    >
                      <SelectTrigger className="bg-slate-700/60 border-white/20 text-white">
                        <SelectValue placeholder={!country ? "Select country first" : "Select city"} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20 max-h-[200px]">
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
                    className="text-xs border-white/20 text-white/80 bg-slate-700/50 flex-1"
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
                    className="text-xs border-white/20 text-white/80 bg-slate-700/50 flex-1"
                  >
                    {isSavingPreference ? 'Saving...' : 'Save Preference'}
                  </Button>
                </div>
                
                {hasLocationPreference && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleClearLocation}
                    className="w-full text-xs text-white/60 hover:text-white/80 mt-1"
                  >
                    Clear Saved Location
                  </Button>
                )}
              </CollapsibleContent>
            </Collapsible>
            
            {/* Enhanced Weather Display */}
            <div className="flex-grow px-4 pb-4">
              <WeatherWidget
                key={weatherKey}
                onWeatherChange={handleLocalWeatherUpdate}
                city={city}
                country={country}
                showToasts={true}
                showError={false}
                autoLoad={shouldAutoLoad}
                className={locationOpen ? "mt-2" : ""}
              />
            </div>
          </div>
          
          {/* Activity Selection Section */}
          <div className="p-4 md:p-5 md:col-span-1 bg-gradient-to-b from-black/30 to-black/10">
            <Collapsible 
              open={activitySectionOpen}
              onOpenChange={setActivitySectionOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer mb-3">
                  <h3 className="text-lg font-medium text-white flex items-center">Select Your Activity for Today</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-white/10"
                  >
                    {activitySectionOpen ? (
                      <ChevronUp className="h-4 w-4 text-white/70" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/70" />
                    )}
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <StyleQuiz 
                  onComplete={handleQuizComplete} 
                  activityIcons={activityIcons}
                  gradientButtonStyle={true}
                  onSituationChange={onSituationChange}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedWeatherSection;
