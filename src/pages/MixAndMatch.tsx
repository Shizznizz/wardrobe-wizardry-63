
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';
import { OutfitProvider } from '@/hooks/useOutfitContext';
import { Skeleton } from '@/components/ui/skeleton';

// Import main section components
import CreateOutfitSection from '@/components/outfits/mix-match/CreateOutfitSection';
import OutfitRecommendationSection from '@/components/outfits/mix-match/OutfitRecommendationSection';
import ContextAdjustmentSection from '@/components/outfits/mix-match/ContextAdjustmentSection';
import OutfitCollectionSection from '@/components/outfits/mix-match/OutfitCollectionSection';
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
  
  // Find the currently selected outfit, default to the first one
  const currentOutfit = selectedOutfitId 
    ? sampleOutfits.find(outfit => outfit.id === selectedOutfitId) 
    : sampleOutfits[0];
  
  // Modified to ensure temperature and condition are defined
  const handleWeatherUpdate = useCallback((weatherData: { temperature: number; condition: string }) => {
    // Use provided data with mandatory properties for the callback parameter
    const temp = weatherData.temperature || 0; // Default to 0 if undefined
    const condition = weatherData.condition || 'clear'; // Default if undefined
    
    // Create a new WeatherInfo object with all required properties
    const newWeather: WeatherInfo = {
      temperature: temp,
      condition: condition,
      icon: condition.toLowerCase().includes('cloud') ? 'cloud' :
            condition.toLowerCase().includes('rain') ? 'rain' :
            condition.toLowerCase().includes('snow') ? 'snow' :
            'sun',
      city: 'San Francisco',
      country: 'USA'
    };
    
    setWeather(newWeather);
    setTemperature(temp);
    setWeatherCondition(condition.toLowerCase());
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

  // Create a valid weather object for components that require non-optional properties
  const safeWeather = weather ? {
    temperature: weather.temperature ?? 0,
    condition: weather.condition ?? 'clear',
    icon: weather.icon,
    city: weather.city,
    country: weather.country
  } : {
    temperature: 0,
    condition: 'clear',
    icon: 'sun',
    city: 'Unknown',
    country: 'Unknown'
  };

  return (
    <OutfitProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-6 pt-20 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
              Style Mixer
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Discover your perfect outfit with Olivia's AI-powered styling
            </p>
          </motion.div>
          
          {/* 1️⃣ Section: "Create Your Own Outfit" - First section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-12"
            id="create-outfit-section"
          >
            <CreateOutfitSection 
              clothingItems={sampleClothingItems} 
              isPremium={false}
            />
          </motion.section>
          
          {/* 2️⃣ Section: "Today's Outfit Pick by Olivia" */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <OutfitRecommendationSection 
              weather={safeWeather} 
              situation={situation}
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
