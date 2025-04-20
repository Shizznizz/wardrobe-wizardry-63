import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';
import { OutfitProvider } from '@/hooks/useOutfitContext';

// Import main section components
import WeatherSection from '@/components/outfits/mix-match/WeatherSection';
import OliviaRecommendationSection from '@/components/outfits/mix-match/OliviaRecommendationSection';
import CreateOutfitSection from '@/components/outfits/mix-match/CreateOutfitSection';
import OutfitCollectionSection from '@/components/outfits/mix-match/OutfitCollectionSection';
import ContextAdjustmentSection from '@/components/outfits/mix-match/ContextAdjustmentSection';
import SuggestedOutfitsSection from '@/components/outfits/mix-match/SuggestedOutfitsSection';

const MixAndMatch = () => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [situation, setSituation] = useState<string | null>('casual');
  const [season, setSeason] = useState<string>('spring');
  const [occasion, setOccasion] = useState<string>('casual');
  const [timeOfDay, setTimeOfDay] = useState<string>('morning');
  const [temperature, setTemperature] = useState<number>(18);
  const [weatherCondition, setWeatherCondition] = useState<string>('clear');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  
  // Memoize outfit collections to prevent unnecessary recalculations
  const personalOutfits = sampleOutfits.filter(outfit => outfit.favorite);
  const popularOutfits = sampleOutfits.slice().sort(() => 0.5 - Math.random());
  
  // Handler for weather updates from the weather widget
  const handleWeatherUpdate = useCallback((weatherData: WeatherInfo) => {
    setWeather(weatherData);
    if (weatherData.temperature) {
      setTemperature(weatherData.temperature);
    }
    if (weatherData.condition) {
      setWeatherCondition(weatherData.condition.toLowerCase());
    }
  }, []);
  
  const handleSituationChange = useCallback((newSituation: string) => {
    setSituation(newSituation);
    setOccasion(newSituation);
  }, []);

  const handleContextChange = useCallback((contextKey: string, value: string | number) => {
    switch(contextKey) {
      case 'season':
        setSeason(value as string);
        break;
      case 'occasion':
        setOccasion(value as string);
        setSituation(value as string);
        break;
      case 'timeOfDay':
        setTimeOfDay(value as string);
        break;
      case 'temperature':
        setTemperature(value as number);
        break;
      case 'weatherCondition':
        setWeatherCondition(value as string);
        break;
      default:
        break;
    }
  }, []);

  const handleRefreshOutfit = useCallback(() => {
    // Randomly select a new outfit
    const availableOutfits = sampleOutfits.filter(outfit => outfit.id !== selectedOutfitId);
    const randomIndex = Math.floor(Math.random() * availableOutfits.length);
    setSelectedOutfitId(availableOutfits[randomIndex].id);
  }, [selectedOutfitId]);

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize with a random outfit
  useEffect(() => {
    if (!selectedOutfitId && sampleOutfits.length > 0) {
      setSelectedOutfitId(sampleOutfits[0].id);
    }
  }, [selectedOutfitId]);

  return (
    <OutfitProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-6 pt-20 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-coral-400">
              Mix and Match Your Perfect Outfit
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              Let Olivia help you mix and match your wardrobe to create the perfect outfit for any occasion
            </p>
          </motion.div>
          
          {/* Weather & Olivia's Recommendation - Top priority */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-[350px,1fr] gap-6">
              <WeatherSection 
                onWeatherUpdate={handleWeatherUpdate} 
                onSituationChange={handleSituationChange}
              />
              <OliviaRecommendationSection 
                weather={weather} 
                situation={situation}
              />
            </div>
          </motion.section>
          
          {/* 2️⃣ Section: "Create Your Own Outfit" */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <CreateOutfitSection 
              clothingItems={sampleClothingItems} 
              isPremium={false}
            />
          </motion.section>
          
          {/* 3️⃣ Section: "Adjust Context" */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <ContextAdjustmentSection 
              season={season}
              occasion={occasion}
              timeOfDay={timeOfDay}
              temperature={temperature}
              weatherCondition={weatherCondition}
              onContextChange={handleContextChange}
              onRefreshOutfit={handleRefreshOutfit}
            />
          </motion.section>
          
          {/* 4️⃣ Section: "My Outfit Collection" */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-16"
          >
            <OutfitCollectionSection 
              outfits={sampleOutfits}
              clothingItems={sampleClothingItems}
            />
          </motion.section>
          
          {/* 5️⃣ Section: "Suggested For You" */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <SuggestedOutfitsSection 
              outfits={popularOutfits.slice(0, 6)}
              clothingItems={sampleClothingItems}
              weather={{
                temperature: temperature,
                condition: weatherCondition
              }}
            />
          </motion.section>
        </main>
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;
