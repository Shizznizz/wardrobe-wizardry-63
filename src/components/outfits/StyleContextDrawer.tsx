
import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, ChevronRight, MapPin, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useOutfitContext } from '@/hooks/useOutfitContext';

interface StyleContextDrawerProps {
  onWeatherChange?: (weatherData: { temperature: number; condition: string }) => void;
  onSituationChange?: (situation: string) => void;
  compact?: boolean;
}

const StyleContextDrawer = memo(({ 
  onWeatherChange, 
  onSituationChange,
  compact = false
}: StyleContextDrawerProps) => {
  const [open, setOpen] = useState(false);
  
  // Sample situations
  const situations = [
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'casual', label: 'Casual', icon: '👕' },
    { id: 'date', label: 'Date Night', icon: '💖' },
    { id: 'formal', label: 'Formal Event', icon: '👔' },
    { id: 'workout', label: 'Workout', icon: '🏋️' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'beach', label: 'Beach Day', icon: '🏖️' }
  ];
  
  // Weather options
  const weatherOptions = [
    { id: 'sunny', label: 'Sunny', icon: '☀️', temperature: 28, condition: 'Clear Sky' },
    { id: 'cloudy', label: 'Cloudy', icon: '☁️', temperature: 22, condition: 'Partly Cloudy' },
    { id: 'rainy', label: 'Rainy', icon: '🌧️', temperature: 18, condition: 'Light Rain' },
    { id: 'snowy', label: 'Snowy', icon: '❄️', temperature: 0, condition: 'Snow' },
    { id: 'hot', label: 'Hot', icon: '🔥', temperature: 34, condition: 'Hot' },
    { id: 'cold', label: 'Cold', icon: '🧊', temperature: 5, condition: 'Cold' }
  ];
  
  const handleSituationSelect = (situation: string) => {
    if (onSituationChange) {
      onSituationChange(situation);
    }
    
    // Don't close drawer on mobile so user can still adjust other settings
    if (window.innerWidth > 768) {
      setOpen(false);
    }
  };
  
  const handleWeatherSelect = (weather: { temperature: number; condition: string }) => {
    if (onWeatherChange) {
      onWeatherChange(weather);
    }
  };

  const buttonClass = compact 
    ? "h-10 px-2 text-sm" 
    : "h-12 px-4";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "border-white/10 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-white group",
            buttonClass
          )}
        >
          <Settings className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
          {compact ? "Style Context" : "Customize Style Context"}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="bg-slate-900 border-white/10 text-white w-full max-w-md p-0 overflow-y-auto">
        <SheetHeader className="p-4 bg-slate-800 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-400" />
              Style Context
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)} 
              className="h-8 w-8 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-white/70 mt-1">
            Customize your outfit recommendations based on your context
          </p>
        </SheetHeader>
        
        <div className="p-4">
          <Tabs defaultValue="situation" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="situation" className="data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-200">
                <Tag className="h-4 w-4 mr-2" />
                Occasion
              </TabsTrigger>
              <TabsTrigger value="weather" className="data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-200">
                <MapPin className="h-4 w-4 mr-2" />
                Weather
              </TabsTrigger>
              <TabsTrigger value="date" className="data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-200">
                <Calendar className="h-4 w-4 mr-2" />
                When
              </TabsTrigger>
            </TabsList>
            
            {/* Situation Tab */}
            <TabsContent value="situation" className="mt-4">
              <h3 className="text-sm font-medium mb-3">What are your plans?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {situations.map((situation) => (
                  <motion.button
                    key={situation.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSituationSelect(situation.label)}
                    className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded-lg border border-white/10 text-left transition-colors"
                  >
                    <div className="text-2xl mb-2">{situation.icon}</div>
                    <div className="text-sm font-medium">{situation.label}</div>
                  </motion.button>
                ))}
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Additional context</h3>
                
                <div className="flex items-start space-x-2">
                  <Checkbox id="indoors" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="indoors"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Staying indoors
                    </label>
                    <p className="text-xs text-muted-foreground text-white/60">
                      Focus on indoor-appropriate styles
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox id="comfort" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="comfort"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Prioritize comfort
                    </label>
                    <p className="text-xs text-muted-foreground text-white/60">
                      Choose more comfortable options
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Weather Tab */}
            <TabsContent value="weather" className="mt-4">
              <h3 className="text-sm font-medium mb-3">Override weather conditions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {weatherOptions.map((weather) => (
                  <motion.button
                    key={weather.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleWeatherSelect(weather)}
                    className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded-lg border border-white/10 text-left transition-colors"
                  >
                    <div className="text-2xl mb-2">{weather.icon}</div>
                    <div className="text-sm font-medium">{weather.label}</div>
                    <div className="text-xs text-white/60">{weather.temperature}° C</div>
                  </motion.button>
                ))}
              </div>
            </TabsContent>
            
            {/* Date Tab */}
            <TabsContent value="date" className="mt-4">
              <h3 className="text-sm font-medium mb-3">When will you wear this outfit?</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline"
                  className="justify-start border-white/10 hover:bg-slate-700 hover:text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Today
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start border-white/10 hover:bg-slate-700 hover:text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Tomorrow
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start border-white/10 hover:bg-slate-700 hover:text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  This weekend
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start border-white/10 hover:bg-slate-700 hover:text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Pick a date...
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
});

StyleContextDrawer.displayName = 'StyleContextDrawer';

export default StyleContextDrawer;
