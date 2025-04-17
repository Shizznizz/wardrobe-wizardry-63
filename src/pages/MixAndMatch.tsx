
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';
import { OutfitProvider } from '@/hooks/useOutfitContext';
import { useOlivia } from '@/contexts/OliviaContext';

// Import refactored components
import WeatherSection from '@/components/outfits/mix-match/WeatherSection';
import OutfitRecommendationSection from '@/components/outfits/mix-match/OutfitRecommendationSection';
import CollectionsSection from '@/components/outfits/mix-match/CollectionsSection';

const MixAndMatch = () => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // We can now use the Olivia context
  const { setWeatherTemp, setWeatherCondition, setHasUploadedWardrobe } = useOlivia();
  
  // Memoize outfit collections to prevent unnecessary recalculations
  const personalOutfits = sampleOutfits.filter(outfit => outfit.favorite);
  const popularOutfits = sampleOutfits.slice().sort(() => 0.5 - Math.random());
  
  const handleWeatherUpdate = useCallback((weatherData: { temperature: number; condition: string }) => {
    setWeather({
      temperature: weatherData.temperature,
      condition: weatherData.condition,
      icon: weatherData.condition.toLowerCase().includes('cloud') ? 'cloud' :
            weatherData.condition.toLowerCase().includes('rain') ? 'rain' :
            weatherData.condition.toLowerCase().includes('snow') ? 'snow' :
            'sun',
      city: 'San Francisco',
      country: 'USA'
    });
    
    // Update Olivia context with weather data
    setWeatherTemp(weatherData.temperature);
    setWeatherCondition(weatherData.condition);
  }, [setWeatherTemp, setWeatherCondition]);
  
  const handleSituationChange = useCallback((newSituation: string) => {
    setSituation(newSituation);
  }, []);

  // Set wardrobe status for Olivia
  useEffect(() => {
    setHasUploadedWardrobe(true); // Assuming the user has a wardrobe in this page
  }, [setHasUploadedWardrobe]);

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <OutfitProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
              Style Mixer
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Tell Olivia about your plans, and she'll craft the perfect outfit suggestion for your day.
            </p>
          </motion.div>
          
          {/* Weather and Context Section */}
          <WeatherSection
            onWeatherUpdate={handleWeatherUpdate}
            onSituationChange={handleSituationChange}
          />
          
          {/* Olivia's Recommendation */}
          <OutfitRecommendationSection
            weather={weather || undefined}
            situation={situation || undefined}
          />
          
          {/* Collections Section */}
          <CollectionsSection
            personalOutfits={personalOutfits}
            popularOutfits={popularOutfits}
            sampleOutfits={sampleOutfits}
            clothingItems={sampleClothingItems}
          />
        </main>
        
        {/* We've removed the showroom dialogs with Olivia popups here */}
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;
