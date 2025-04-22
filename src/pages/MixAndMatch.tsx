
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';
import { OutfitProvider } from '@/hooks/useOutfitContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import WeatherSection from '@/components/outfits/mix-match/WeatherSection';
import OliviaRecommendationSection from '@/components/outfits/mix-match/OliviaRecommendationSection';
import CreateOutfitSection from '@/components/outfits/mix-match/CreateOutfitSection';
import ContextAdjustmentSection from '@/components/outfits/mix-match/ContextAdjustmentSection';
import OutfitCollectionSection from '@/components/outfits/mix-match/OutfitCollectionSection';
import SuggestedOutfitsSection from '@/components/outfits/mix-match/SuggestedOutfitsSection';

const MixAndMatch = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCompactView, setShowCompactView] = useState(false);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [situation, setSituation] = useState<string | null>('casual');
  const [season, setSeason] = useState<string>('spring');
  const [occasion, setOccasion] = useState<string>('casual');
  const [timeOfDay, setTimeOfDay] = useState<string>('morning');
  const [temperature, setTemperature] = useState<number>(18);
  const [weatherCondition, setWeatherCondition] = useState<string>('clear');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ first_name: string | null } | null>(null);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data);
          }
        });
    }
  }, [user?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedOutfitId && sampleOutfits.length > 0) {
      setSelectedOutfitId(sampleOutfits[0].id);
    }
  }, [selectedOutfitId]);

  const personalOutfits = sampleOutfits.filter(outfit => outfit.favorite);
  const popularOutfits = sampleOutfits.slice().sort(() => 0.5 - Math.random());

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
    const availableOutfits = sampleOutfits.filter(outfit => outfit.id !== selectedOutfitId);
    const randomIndex = Math.floor(Math.random() * availableOutfits.length);
    setSelectedOutfitId(availableOutfits[randomIndex].id);
  }, [selectedOutfitId]);

  return (
    <OutfitProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
        <Header />
        <main className="container mx-auto px-2 sm:px-4 py-6 pt-20 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 px-2"
          >
            <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-coral-400 text-balance">
              {profile?.first_name
                ? `Hi ${profile.first_name}, Olivia's got a perfect outfit for you today!`
                : 'Mix and Match Your Perfect Outfit'}
            </h1>
            <p className="text-base xs:text-lg md:text-xl text-white/70 max-w-3xl mx-auto text-balance">
              Let Olivia create a fresh outfit for you based on today's weather and your style.
            </p>
          </motion.div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end mb-4 sm:mb-6 gap-2">
            <WardrobeControls
              viewMode={viewMode}
              showCompactView={showCompactView}
              onViewModeChange={setViewMode}
              onCompactViewChange={setShowCompactView}
            />
          </div>
          {/* Responsive grid for Weather and Olivia Recommendation */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">
              <div className="w-full lg:max-w-full flex justify-center">
                <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
                  <WeatherSection 
                    onWeatherUpdate={handleWeatherUpdate}
                    onSituationChange={handleSituationChange}
                  />
                </div>
              </div>
              <div className="w-full lg:max-w-full flex justify-center">
                <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
                  <OliviaRecommendationSection
                    weather={weather}
                    situation={situation}
                  />
                </div>
              </div>
            </div>
          </motion.section>
          {/* Create Outfit Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <div className="w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <CreateOutfitSection 
                  clothingItems={sampleClothingItems}
                  isPremium={false}
                />
              </div>
            </div>
          </motion.section>
          {/* Context Adjustment Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <ContextAdjustmentSection
                  season={season}
                  occasion={occasion}
                  timeOfDay={timeOfDay}
                  temperature={temperature}
                  weatherCondition={weatherCondition}
                  onContextChange={handleContextChange}
                  onRefreshOutfit={handleRefreshOutfit}
                />
              </div>
            </div>
          </motion.section>
          {/* Outfit Collection Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-16"
          >
            <div className="w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <OutfitCollectionSection
                  outfits={sampleOutfits}
                  clothingItems={sampleClothingItems}
                />
              </div>
            </div>
          </motion.section>
          {/* Suggested Outfits Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <SuggestedOutfitsSection
                  outfits={popularOutfits.slice(0, 6)}
                  clothingItems={sampleClothingItems}
                  weather={{
                    temperature: temperature,
                    condition: weatherCondition,
                  }}
                />
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;

