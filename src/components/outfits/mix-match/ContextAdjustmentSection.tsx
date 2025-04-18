
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, SunMedium, CloudSun, Cloud, CloudRain, Snowflake, Sun, Moon, Briefcase, Heart, PartyPopper, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ContextOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ContextAdjustmentSectionProps {
  season: string;
  occasion: string;
  timeOfDay: string;
  temperature: number;
  weatherCondition: string;
  onContextChange: (key: string, value: string | number) => void;
  onRefreshOutfit: () => void;
}

const ContextAdjustmentSection = ({
  season,
  occasion,
  timeOfDay,
  temperature,
  weatherCondition,
  onContextChange,
  onRefreshOutfit
}: ContextAdjustmentSectionProps) => {
  const [refreshing, setRefreshing] = useState(false);
  
  const seasons: ContextOption[] = [
    { value: 'spring', label: 'Spring', icon: <SunMedium className="h-4 w-4 text-green-300" /> },
    { value: 'summer', label: 'Summer', icon: <Sun className="h-4 w-4 text-yellow-300" /> },
    { value: 'autumn', label: 'Fall', icon: <CloudSun className="h-4 w-4 text-amber-300" /> },
    { value: 'winter', label: 'Winter', icon: <Snowflake className="h-4 w-4 text-blue-300" /> },
  ];
  
  const occasions: ContextOption[] = [
    { value: 'casual', label: 'Casual', icon: <Shirt className="h-4 w-4 text-blue-300" /> },
    { value: 'work', label: 'Work', icon: <Briefcase className="h-4 w-4 text-purple-300" /> },
    { value: 'date', label: 'Date', icon: <Heart className="h-4 w-4 text-pink-300" /> },
    { value: 'party', label: 'Party', icon: <PartyPopper className="h-4 w-4 text-amber-300" /> },
  ];
  
  const times: ContextOption[] = [
    { value: 'morning', label: 'Morning', icon: <SunMedium className="h-4 w-4 text-yellow-300" /> },
    { value: 'afternoon', label: 'Afternoon', icon: <Sun className="h-4 w-4 text-amber-300" /> },
    { value: 'evening', label: 'Evening', icon: <Moon className="h-4 w-4 text-indigo-300" /> },
  ];
  
  const weathers: ContextOption[] = [
    { value: 'clear', label: 'Clear', icon: <Sun className="h-4 w-4 text-yellow-300" /> },
    { value: 'cloudy', label: 'Cloudy', icon: <Cloud className="h-4 w-4 text-gray-300" /> },
    { value: 'rain', label: 'Rain', icon: <CloudRain className="h-4 w-4 text-blue-300" /> },
    { value: 'snow', label: 'Snow', icon: <Snowflake className="h-4 w-4 text-blue-200" /> },
  ];
  
  const handleRefresh = () => {
    setRefreshing(true);
    onRefreshOutfit();
    
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };
  
  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-white/10 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Adjust Context</h2>
        <Button 
          size="sm"
          variant="outline"
          className={cn(
            "border-white/20 text-white hover:bg-white/10 transition-all",
            refreshing && "animate-spin"
          )}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Outfit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Season Selection */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-2">Season</h3>
          <div className="flex flex-wrap gap-2">
            {seasons.map(s => (
              <Button
                key={s.value}
                size="sm"
                variant={season === s.value ? "default" : "outline"}
                className={cn(
                  season === s.value 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-transparent border-white/20 hover:bg-white/10 text-white/90",
                  "flex-1"
                )}
                onClick={() => onContextChange('season', s.value)}
              >
                {s.icon} 
                <span className="ml-1">{s.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Occasion Selection */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-2">Occasion</h3>
          <div className="flex flex-wrap gap-2">
            {occasions.map(o => (
              <Button
                key={o.value}
                size="sm"
                variant={occasion === o.value ? "default" : "outline"}
                className={cn(
                  occasion === o.value 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-transparent border-white/20 hover:bg-white/10 text-white/90",
                  "flex-1"
                )}
                onClick={() => onContextChange('occasion', o.value)}
              >
                {o.icon} 
                <span className="ml-1">{o.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Time of Day Selection */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-2">Time of Day</h3>
          <div className="flex flex-wrap gap-2">
            {times.map(t => (
              <Button
                key={t.value}
                size="sm"
                variant={timeOfDay === t.value ? "default" : "outline"}
                className={cn(
                  timeOfDay === t.value 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-transparent border-white/20 hover:bg-white/10 text-white/90",
                  "flex-1"
                )}
                onClick={() => onContextChange('timeOfDay', t.value)}
              >
                {t.icon} 
                <span className="ml-1">{t.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Temperature Slider */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-2">Temperature: {temperature}°C</h3>
          <div className="px-2">
            <Slider 
              min={-10}
              max={40}
              step={1}
              defaultValue={[temperature]}
              value={[temperature]}
              onValueChange={(value) => onContextChange('temperature', value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Cold</span>
              <span>Warm</span>
              <span>Hot</span>
            </div>
          </div>
        </div>
        
        {/* Weather Condition */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-2">Weather</h3>
          <div className="flex flex-wrap gap-2">
            {weathers.map(w => (
              <Button
                key={w.value}
                size="sm"
                variant={weatherCondition === w.value ? "default" : "outline"}
                className={cn(
                  weatherCondition === w.value 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-transparent border-white/20 hover:bg-white/10 text-white/90",
                  "flex-1"
                )}
                onClick={() => onContextChange('weatherCondition', w.value)}
              >
                {w.icon} 
                <span className="ml-1">{w.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextAdjustmentSection;
