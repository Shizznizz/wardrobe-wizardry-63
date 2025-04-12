
import { useState } from 'react';
import { Settings, X, Sliders, Calendar, MapPin, Palette, Tag, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import QuickFilters from './QuickFilters';

interface StyleContextDrawerProps {
  onWeatherChange?: (weather: { temperature: number; condition: string }) => void;
  onSituationChange?: (situation: string) => void;
}

const StyleContextDrawer = ({ onWeatherChange, onSituationChange }: StyleContextDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [location, setLocation] = useState({ city: 'San Francisco', country: 'USA' });
  const [weather, setWeather] = useState({ temperature: 18, condition: 'Partly Cloudy' });
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const isMobile = useIsMobile();
  
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };
  
  const toggleOwnedOnly = () => {
    setShowOwnedOnly(!showOwnedOnly);
  };
  
  const handleClose = () => {
    // Update parent components on close
    if (onWeatherChange) onWeatherChange(weather);
    if (onSituationChange && selectedEvent) onSituationChange(selectedEvent);
    setOpen(false);
  };
  
  const moodOptions = [
    { value: 'happy', label: 'Happy' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'creative', label: 'Creative' },
  ];
  
  const occasionOptions = [
    { value: 'casual', label: 'Casual Outing' }, 
    { value: 'formal', label: 'Formal Event' }, 
    { value: 'work', label: 'Work Meeting' }, 
    { value: 'date', label: 'Date Night' },
    { value: 'party', label: 'Party' },
    { value: 'outdoor', label: 'Outdoor Activity' },
  ];
  
  const timeOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'night', label: 'Night' },
  ];
  
  const weatherOptions = [
    { value: 'sunny', label: 'Sunny', temp: 25 },
    { value: 'cloudy', label: 'Cloudy', temp: 18 },
    { value: 'rainy', label: 'Rainy', temp: 15 },
    { value: 'snowy', label: 'Snowy', temp: 0 },
    { value: 'hot', label: 'Hot', temp: 30 },
    { value: 'cold', label: 'Cold', temp: 5 },
  ];
  
  const handleOccasionChange = (value: string) => {
    setSelectedEvent(value);
    if (onSituationChange) onSituationChange(
      occasionOptions.find(o => o.value === value)?.label || value
    );
  };
  
  const handleWeatherOptionChange = (value: string) => {
    const option = weatherOptions.find(w => w.value === value);
    if (option) {
      const newWeather = {
        temperature: option.temp,
        condition: option.label
      };
      setWeather(newWeather);
      if (onWeatherChange) onWeatherChange(newWeather);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Sliders className="h-4 w-4 mr-2" />
          Customize my outfit context
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="bg-slate-900 border-t border-white/10 text-white">
        <div className="mx-auto w-full max-w-3xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-400" />
              Style Context Settings
            </h3>
            
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          
          <Tabs defaultValue="occasion" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-slate-800/50">
              <TabsTrigger value="occasion" className="data-[state=active]:bg-purple-600/40">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Occasion</span>
                <span className="sm:hidden">Event</span>
              </TabsTrigger>
              <TabsTrigger value="weather" className="data-[state=active]:bg-blue-600/40">
                <Sun className="h-4 w-4 mr-2" />
                <span>Weather</span>
              </TabsTrigger>
              <TabsTrigger value="filters" className="data-[state=active]:bg-green-600/40">
                <Tag className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="occasion" className="rounded-md bg-slate-800/20 p-4 border border-white/10">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Occasion</label>
                  <Select value={selectedEvent} onValueChange={handleOccasionChange}>
                    <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/30">
                      {occasionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Your Mood</label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                      <SelectValue placeholder="How are you feeling?" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/30">
                      {moodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Time of Day</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/30">
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <label className="text-sm text-white/70 mb-2 block">Free-form description</label>
                  <Input 
                    placeholder="E.g. Meeting with clients, then dinner with friends" 
                    className="bg-slate-800/60 border-purple-500/30 text-white"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="weather" className="rounded-md bg-slate-800/20 p-4 border border-white/10">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Location</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={location.city}
                      onChange={(e) => setLocation({...location, city: e.target.value})}
                      placeholder="City" 
                      className="bg-slate-800/60 border-blue-500/30 text-white"
                    />
                    <Input 
                      value={location.country}
                      onChange={(e) => setLocation({...location, country: e.target.value})}
                      placeholder="Country" 
                      className="bg-slate-800/60 border-blue-500/30 text-white"
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    Currently showing recommendations for {location.city}, {location.country}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Weather Condition</label>
                  <Select onValueChange={handleWeatherOptionChange}>
                    <SelectTrigger className="bg-slate-800/60 border-blue-500/30 text-white">
                      <SelectValue placeholder={weather.condition} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-blue-500/30">
                      {weatherOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} ({option.temp}°C)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Temperature (°C)</label>
                  <Input 
                    type="number" 
                    value={weather.temperature}
                    onChange={(e) => {
                      const newWeather = {
                        ...weather,
                        temperature: parseInt(e.target.value) || 0
                      };
                      setWeather(newWeather);
                      if (onWeatherChange) onWeatherChange(newWeather);
                    }}
                    className="bg-slate-800/60 border-blue-500/30 text-white" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="filters" className="rounded-md bg-slate-800/20 p-4 border border-white/10">
              <ScrollArea className="h-[300px] pr-4">
                <QuickFilters 
                  onFilterChange={handleFilterChange}
                  toggleOwnedOnly={toggleOwnedOnly}
                  showOwnedOnly={showOwnedOnly}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 flex justify-end gap-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DrawerClose>
            
            <DrawerClose asChild>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={handleClose}
              >
                Apply Settings
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StyleContextDrawer;
