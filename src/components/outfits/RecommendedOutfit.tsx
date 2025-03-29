
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Coffee, Party, Umbrella, Sunset, Moon, TrousersIcon } from '@/components/ui/icons';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import LocationSelector from '@/components/weather/LocationSelector';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';

interface RecommendedOutfitProps {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  onRefreshOutfit: () => void;
}

const RecommendedOutfit = ({ outfit, clothingItems, onRefreshOutfit }: RecommendedOutfitProps) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [showRotatingView, setShowRotatingView] = useState(false);
  const [location, setLocation] = useState<{ city?: string; country?: string }>({});

  const handleWeatherChange = (weather: WeatherInfo) => {
    setCurrentWeather(weather);
  };

  const handleSelectOccasion = (occasion: string) => {
    setSelectedOccasion(occasion);
  };

  const handleRefreshOutfit = () => {
    setShowRotatingView(true);
    setTimeout(() => setShowRotatingView(false), 1000);
    onRefreshOutfit();
  };

  const handleLocationChange = (city: string, country: string) => {
    setLocation({ city, country });
  };

  return (
    <motion.section variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }} className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold mb-0 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Today's Recommended Outfit
        </h2>
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleRefreshOutfit}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${showRotatingView ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1">
          <LocationSelector 
            onLocationChange={handleLocationChange}
            initialCity={location.city}
            initialCountry={location.country}
          />
          
          <div className="mt-4">
            <WeatherWidget 
              onWeatherChange={handleWeatherChange} 
              city={location.city}
              country={location.country}
            />
          </div>
          
          <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Coffee className="mr-2 h-5 w-5 text-amber-400" />
              Occasion
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Casual', 'Work', 'Party', 'Date', 'Formal'].map(occasion => (
                <Button
                  key={occasion}
                  variant={selectedOccasion === occasion ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelectOccasion(occasion)}
                  className={selectedOccasion === occasion 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "border-white/20 text-white hover:bg-white/10"}
                >
                  {occasion === 'Party' && <Party className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Casual' && <TrousersIcon className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Formal' && <Sunset className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Work' && <Moon className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Date' && <Umbrella className="mr-1 h-3.5 w-3.5" />}
                  {occasion}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <OutfitSuggestion 
            outfit={outfit} 
            items={clothingItems}
            weather={currentWeather || undefined}
            activity={selectedOccasion?.toLowerCase() as any}
            onRefresh={handleRefreshOutfit}
            onLike={() => {}}
            onDislike={() => {}}
            onMakeWarmer={() => {}}
            onChangeTop={() => {}}
            onChangeBottom={() => {}}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default RecommendedOutfit;
