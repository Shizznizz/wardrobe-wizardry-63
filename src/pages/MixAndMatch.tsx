
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import OptimizedWeatherSummary from '@/components/weather/OptimizedWeatherSummary';
import OutfitCollectionPreview from '@/components/outfits/OutfitCollectionPreview';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';
import { OutfitProvider } from '@/hooks/useOutfitContext';

// Lazy load non-critical components
const OliviaRecommendation = lazy(() => import('@/components/outfits/OliviaRecommendation'));
const StyleContextDrawer = lazy(() => import('@/components/outfits/StyleContextDrawer'));

const MixAndMatch = () => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  }, []);
  
  const handleSituationChange = useCallback((newSituation: string) => {
    setSituation(newSituation);
  }, []);

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
          
          {/* Weather Summary - Compact Version */}
          <div className="mb-4 flex justify-between items-center">
            <OptimizedWeatherSummary 
              onWeatherUpdate={handleWeatherUpdate}
              className="flex-1 max-w-md"
              compact
            />
            
            {/* Context Customization */}
            <Suspense fallback={<Skeleton className="h-10 w-36 rounded-md ml-2" />}>
              <StyleContextDrawer 
                onWeatherChange={handleWeatherUpdate}
                onSituationChange={handleSituationChange}
                compact={true}
              />
            </Suspense>
          </div>
          
          {/* Olivia's Recommendation */}
          <section className="mb-8">
            <Suspense fallback={
              <div className="p-8 bg-slate-900/70 border border-white/10 rounded-xl">
                <div className="flex flex-col gap-4 items-center">
                  <Skeleton className="h-8 w-64 rounded-md" />
                  <Skeleton className="h-64 w-full max-w-md rounded-md" />
                  <Skeleton className="h-8 w-full max-w-lg rounded-md" />
                </div>
              </div>
            }>
              <OliviaRecommendation weather={weather || undefined} situation={situation || undefined} />
            </Suspense>
          </section>
          
          {/* Personal Collection - Lazy load images */}
          <section className="mb-8">
            <OutfitCollectionPreview
              title="My Outfit Collection"
              description="Outfits you've created and saved"
              outfits={personalOutfits.length ? personalOutfits : sampleOutfits.slice(0, 4)}
              clothingItems={sampleClothingItems}
              viewAllLink="/outfits"
            />
          </section>
          
          {/* Popular Outfits - Lazy load images */}
          <section>
            <OutfitCollectionPreview
              title="Popular Today"
              description="Trending outfits loved by the community"
              outfits={popularOutfits.slice(0, 4)}
              clothingItems={sampleClothingItems}
            />
          </section>
        </main>
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;
