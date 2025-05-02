
import { useState, useEffect, useCallback, Suspense, lazy, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';
import { OutfitProvider } from '@/hooks/useOutfitContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import MixMatchActions from '@/components/outfits/mix-match/MixMatchActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import CollapsibleSection from '@/components/outfits/mix-match/CollapsibleSection';
import OutfitTabSection from '@/components/outfits/mix-match/OutfitTabSection';
import ContextAdjustmentSection from '@/components/outfits/mix-match/ContextAdjustmentSection';
import EnhancedWeatherSection from '@/components/outfits/mix-match/EnhancedWeatherSection';
import PageHeader from '@/components/shared/PageHeader';
import { OutfitBuilder } from '@/components/OutfitBuilder';

// Lazily loaded components
const OliviaRecommendationSection = lazy(() => import('@/components/outfits/mix-match/OliviaRecommendationSection'));
const CreateOutfitSection = lazy(() => import('@/components/outfits/mix-match/CreateOutfitSection'));
const SuggestedOutfitsSection = lazy(() => import('@/components/outfits/mix-match/SuggestedOutfitsSection'));

// Use memo to prevent unnecessary re-renders
const MemoizedEnhancedWeatherSection = memo(EnhancedWeatherSection);
const MemoizedOliviaRecommendationSection = memo(OliviaRecommendationSection);
const MemoizedCreateOutfitSection = memo(CreateOutfitSection);
const MemoizedSuggestedOutfitsSection = memo(SuggestedOutfitsSection);

const MixAndMatch = () => {
  // References for scroll behavior
  const weatherSectionRef = useRef<HTMLDivElement>(null);
  const outfitTabSectionRef = useRef<HTMLDivElement>(null);
  const oliviaRecommendationRef = useRef<HTMLDivElement>(null);
  
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
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Scroll to weather section
  const scrollToWeatherSection = useCallback(() => {
    if (weatherSectionRef.current) {
      weatherSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Scroll to outfits tab section
  const scrollToOutfitsSection = useCallback(() => {
    if (outfitTabSectionRef.current) {
      outfitTabSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Scroll to Olivia's recommendations
  const scrollToRecommendations = useCallback(() => {
    if (oliviaRecommendationRef.current) {
      oliviaRecommendationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handle create outfit
  const handleCreateOutfit = useCallback(() => {
    setIsBuilderOpen(true);
  }, []);

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
    // Auto-scroll to recommendations after a short delay to allow UI to update
    setTimeout(scrollToRecommendations, 300);
  }, [scrollToRecommendations]);

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
          {/* Updated PageHeader with new image */}
          <PageHeader
            title="Your Daily Style, Curated by Olivia"
            subtitle="Get outfits tailored to your vibe, activity, and the weather."
            showAvatar={false}
            imageVariant="portrait"
            imagePosition="right"
            showSparkles={true}
          >
            {profile?.first_name && (
              <p className="text-white/80">
                Hi {profile.first_name}, let me style you today!
              </p>
            )}
            <div className="mt-4">
              <Button 
                variant="hero-primary"
                size="lg"
                onClick={scrollToWeatherSection}
                className="text-base md:text-lg px-8 py-6 h-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-95 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300"
              >
                Let Olivia Style Me Today
              </Button>
            </div>
          </PageHeader>

          <div className="mt-8 flex justify-center">
            <MixMatchActions 
              onScrollToOutfits={scrollToOutfitsSection}
              onCreateOutfit={handleCreateOutfit}
            />
          </div>

          {/* Weather & Context Section - added ref for scrolling */}
          <motion.section
            ref={weatherSectionRef}
            {...fadeUp}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 pt-6 scroll-mt-24"
          >
            <MemoizedEnhancedWeatherSection 
              onWeatherUpdate={handleWeatherUpdate}
              onSituationChange={handleSituationChange}
              onTemperatureChange={handleTemperatureChange}
              onWeatherConditionChange={handleWeatherConditionChange}
              temperature={temperature}
              weatherCondition={weatherCondition}
            />
          </motion.section>

          {/* Olivia's Recommendation Section */}
          <motion.section
            ref={oliviaRecommendationRef}
            {...fadeUp}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 scroll-mt-24"
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
            ref={outfitTabSectionRef}
            {...fadeUp}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 scroll-mt-24"
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

        {/* OutfitBuilder Modal */}
        {isBuilderOpen && (
          <OutfitBuilder
            isOpen={isBuilderOpen}
            onClose={() => setIsBuilderOpen(false)}
            onSave={() => {
              setIsBuilderOpen(false);
            }}
            clothingItems={sampleClothingItems}
          />
        )}
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;
