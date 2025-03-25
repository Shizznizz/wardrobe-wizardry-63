
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { WeatherInfo, Outfit, TimeOfDay, Activity } from '@/lib/types';
import { sampleOutfits } from '@/lib/wardrobeData';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import WeatherSelectionForm from '@/components/outfits/WeatherSelectionForm';
import OutfitContent from '@/components/outfits/OutfitContent';
import WeatherAndAdvisor from '@/components/outfits/WeatherAndAdvisor';

const Outfits = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [activity, setActivity] = useState<Activity>('casual');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const handleWeatherChange = (weatherData: WeatherInfo) => {
    setCurrentWeather(weatherData);
    setIsLoading(false);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      const randomOutfitIndex = Math.floor(Math.random() * sampleOutfits.length);
      setSelectedOutfit(sampleOutfits[randomOutfitIndex]);
      setIsRefreshing(false);
      toast.success("Your outfit has been refreshed!");
    }, 1000);
  };
  
  // Initial outfit selection on mount
  useEffect(() => {
    const loadInitialOutfit = () => {
      setIsLoading(true);
      setTimeout(() => {
        const randomOutfitIndex = Math.floor(Math.random() * sampleOutfits.length);
        setSelectedOutfit(sampleOutfits[randomOutfitIndex]);
        setIsLoading(false);
      }, 1500);
    };
    
    loadInitialOutfit();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Outfit Suggestions</h1>
        
        <div className="grid gap-6 md:grid-cols-12">
          {/* Outfits and Weather Section */}
          <div className="md:col-span-8 space-y-6">
            {/* Weather Selection Form */}
            <WeatherSelectionForm />
            
            {/* Weather and Outfit Suggestion */}
            <OutfitContent 
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              error={error}
              selectedOutfit={selectedOutfit}
              timeOfDay={timeOfDay}
              activity={activity}
              setTimeOfDay={setTimeOfDay}
              setActivity={setActivity}
              handleRefresh={handleRefresh}
            />
          </div>
          
          {/* Weather and Reasoning Section */}
          <WeatherAndAdvisor 
            currentWeather={currentWeather}
            selectedOutfit={selectedOutfit}
            timeOfDay={timeOfDay}
            activity={activity}
            city="New York"
            country="US"
            handleWeatherChange={handleWeatherChange}
          />
        </div>
      </main>
    </div>
  );
};

export default Outfits;
