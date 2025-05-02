import { useState, useEffect, useCallback, Suspense, lazy, memo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';
import { OutfitProvider } from '@/hooks/useOutfitContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import WardrobeControls from '@/components/wardrobe/WardrobeControls';
import ContextAdjustmentSection from '@/components/outfits/mix-match/ContextAdjustmentSection';
import MixMatchActions from '@/components/outfits/mix-match/MixMatchActions';
import { Skeleton } from '@/components/ui/skeleton';
import CollapsibleSection from '@/components/outfits/mix-match/CollapsibleSection';
import OutfitTabSection from '@/components/outfits/mix-match/OutfitTabSection';

// Lazily loaded components
const EnhancedWeatherSection = lazy(() => import('@/components/outfits/mix-match/EnhancedWeatherSection'));
const OliviaRecommendationSection = lazy(() => import('@/components/outfits/mix-match/OliviaRecommendationSection'));
const CreateOutfitSection = lazy(() => import('@/components/outfits/mix-match/CreateOutfitSection'));
const SuggestedOutfitsSection = lazy(() => import('@/components/outfits/mix-match/SuggestedOutfitsSection'));

// Use memo to prevent unnecessary re-renders
const MemoizedEnhancedWeatherSection = memo(EnhancedWeatherSection);
const MemoizedOliviaRecommendationSection = memo(OliviaRecommendationSection);
const MemoizedCreateOutfitSection = memo(CreateOutfitSection);
const MemoizedSuggestedOutfitsSection = memo(SuggestedOutfitsSection);

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

  // Fetch user profile
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

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Initialize selected outfit
  useEffect(() => {
    if (!selectedOutfitId && sampleOutfits.length > 0) {
      setSelectedOutfitId(sampleOutfits[0].id);
    }
  }, [selectedOutfitId]);

  const personalOutfits = sampleOutfits.filter(outfit => outfit.favorite);
  const popularOutfits = sampleOutfits.slice().sort(() => 0.5 - Math.random());

  const handleWeatherUpdate = useCallback((weatherData: WeatherInfo) => {
    setWeather(weatherData);
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
      default:
        break;
    }
  }, []);

  const handleRefreshOutfit = useCallback(() => {
    const availableOutfits = sampleOutfits.filter(outfit => outfit.id !== selectedOutfitId);
    const randomIndex = Math.floor(Math.random() * availableOutfits.length);
    setSelectedOutfitId(availableOutfits[randomIndex].id);
  }, [selectedOutfitId]);

  // Use memoized handlers for temperature and weather condition
  const handleTemperatureChange = useCallback((temp: number) => {
    setTemperature(temp);
  }, []);

  const handleWeatherConditionChange = useCallback((condition: string) => {
    setWeatherCondition(condition);
  }, []);

  // Animation variants
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7 }
  };

  return (
    <OutfitProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
        <Header />
        <main className="container mx-auto px-2 sm:px-4 py-6 pt-20 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10 pt-4 px-2"
          >
            <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-coral-400 text-balance">
              {profile?.first_name
                ? `Hi ${profile.first_name}, Olivia's got a perfect outfit for you today!`
                : 'Unlock Your Perfect Style Combinations'}
            </h1>
            <p className="text-base xs:text-lg md:text-xl text-white/70 max-w-3xl mx-auto text-balance mb-6">
              Let Olivia design your perfect outfit, tailored to today's weather and your unique style.
            </p>
            
            <div className="flex flex-col items-center space-y-5">
              <div className="flex justify-center w-full">
                <WardrobeControls
                  viewMode={viewMode}
                  showCompactView={showCompactView}
                  onViewModeChange={setViewMode}
                  onCompactViewChange={setShowCompactView}
                />
              </div>
              
              <MixMatchActions />
            </div>
          </motion.div>

          {/* Unified Weather & Context Section */}
          <motion.section
            {...fadeUp}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <Suspense fallback={<Skeleton className="w-full h-64 rounded-xl bg-slate-800" />}>
              <MemoizedEnhancedWeatherSection 
                onWeatherUpdate={handleWeatherUpdate}
                onSituationChange={handleSituationChange}
                onTemperatureChange={handleTemperatureChange}
                onWeatherConditionChange={handleWeatherConditionChange}
                temperature={temperature}
                weatherCondition={weatherCondition}
              />
            </Suspense>
          </motion.section>

          {/* Olivia's Recommendation Section */}
          <motion.section
            {...fadeUp}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <Suspense fallback={<Skeleton className="w-full h-64 rounded-xl bg-slate-800" />}>
              <MemoizedOliviaRecommendationSection 
                weather={weather}
                situation={situation}
              />
            </Suspense>
          </motion.section>
          
          {/* Create Outfit Section */}
          <motion.section
            {...fadeUp}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <CollapsibleSection
              title={<h3 className="text-xl font-semibold text-white">Create Your Own Outfit</h3>}
              defaultOpen={false}
            >
              <Suspense fallback={<Skeleton className="w-full h-32 rounded-xl bg-slate-800" />}>
                <MemoizedCreateOutfitSection 
                  clothingItems={sampleClothingItems}
                  isPremium={false}
                />
              </Suspense>
            </CollapsibleSection>
          </motion.section>
          
          {/* Context Adjustment Section */}
          <motion.section
            {...fadeUp}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <CollapsibleSection
              title={<h3 className="text-xl font-semibold text-white">Fine-Tune Style Context</h3>}
              defaultOpen={false}
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
            </CollapsibleSection>
          </motion.section>
          
          {/* My Collection Section */}
          <motion.section
            {...fadeUp}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <OutfitTabSection
              outfits={sampleOutfits}
              clothingItems={sampleClothingItems}
            />
          </motion.section>
          
          {/* Suggested Outfits Section */}
          <motion.section
            {...fadeUp}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-10"
          >
            <Suspense fallback={<Skeleton className="w-full h-32 rounded-xl bg-slate-800" />}>
              <MemoizedSuggestedOutfitsSection
                outfits={popularOutfits.slice(0, 6)}
                clothingItems={sampleClothingItems}
                weather={{
                  temperature: temperature,
                  condition: weatherCondition,
                }}
              />
            </Suspense>
          </motion.section>
        </main>
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;
