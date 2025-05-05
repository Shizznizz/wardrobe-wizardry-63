import { useState, useEffect, useCallback, Suspense, lazy, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo, Outfit, ClothingItem } from '@/lib/types';
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
import EnhancedPageHeader from '@/components/outfits/mix-match/EnhancedPageHeader';
import OutfitBuilder from '@/components/OutfitBuilder';
import { toast } from 'sonner';

// Lazily loaded components
const OliviaRecommendationSection = lazy(() => import('@/components/outfits/mix-match/OliviaRecommendationSection'));
const CreateOutfitSection = lazy(() => import('@/components/outfits/mix-match/CreateOutfitSection'));
const TrendingStylesSection = lazy(() => import('@/components/outfits/mix-match/TrendingStylesSection'));

// Use memo to prevent unnecessary re-renders
const MemoizedEnhancedWeatherSection = memo(EnhancedWeatherSection);
const MemoizedOliviaRecommendationSection = memo(OliviaRecommendationSection);
const MemoizedCreateOutfitSection = memo(CreateOutfitSection);
const MemoizedTrendingStylesSection = memo(TrendingStylesSection);

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
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [userClothingItems, setUserClothingItems] = useState<ClothingItem[]>([]);

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

  // Fetch user's clothing items from Supabase
  useEffect(() => {
    const fetchUserClothingItems = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedItems: ClothingItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            color: item.color,
            material: item.material || '',
            season: item.season || ['all'],
            occasions: item.occasions || ['casual'],
            favorite: item.favorite || false,
            imageUrl: item.image_url,
            image: item.image_url,
            timesWorn: item.times_worn || 0,
            dateAdded: new Date(item.date_added)
          }));
          
          setUserClothingItems(formattedItems);
        } else {
          // If the user has no clothing items yet, use sample data
          setUserClothingItems(sampleClothingItems);
        }
      } catch (error) {
        console.error('Error fetching user clothing items:', error);
        // Fallback to sample data on error
        setUserClothingItems(sampleClothingItems);
      }
    };
    
    fetchUserClothingItems();
  }, [user?.id]);

  // Fetch saved outfits from localStorage and deduplicate them
  useEffect(() => {
    const loadOutfitsFromLocalStorage = () => {
      const localSavedOutfits = localStorage.getItem('savedOutfits');
      if (localSavedOutfits) {
        try {
          const parsedOutfits = JSON.parse(localSavedOutfits);
          
          // Use a Map for deduplication based on ID
          const uniqueOutfitMap = new Map<string, Outfit>();
          parsedOutfits.forEach((outfit: Outfit) => {
            uniqueOutfitMap.set(outfit.id, outfit);
          });
          
          const uniqueOutfits = Array.from(uniqueOutfitMap.values());
          
          // Save deduplicated outfits back to localStorage
          if (uniqueOutfits.length !== parsedOutfits.length) {
            localStorage.setItem('savedOutfits', JSON.stringify(uniqueOutfits));
          }
          
          setSavedOutfits(uniqueOutfits);
          
          // Create initial outfits state by combining sample outfits and saved outfits
          const existingIds = new Set(sampleOutfits.map(outfit => outfit.id));
          
          const uniqueSavedOutfits = uniqueOutfits.filter((outfit: Outfit) => !existingIds.has(outfit.id));
          
          setOutfits([...sampleOutfits, ...uniqueSavedOutfits]);
        } catch (error) {
          console.error('Error parsing saved outfits:', error);
        }
      } else {
        // Set initial outfits to sample outfits if no saved outfits
        setOutfits(sampleOutfits);
      }
    };
    
    loadOutfitsFromLocalStorage();
  }, []);

  // Fetch outfits from Supabase if user is logged in
  useEffect(() => {
    const fetchOutfitsFromSupabase = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedOutfits = data.map(outfit => ({
            ...outfit,
            dateAdded: new Date(outfit.date_added),
            timesWorn: outfit.times_worn,
            // Make sure the items array exists
            items: outfit.items || []
          }));
          
          // Get existing outfit IDs from both sample outfits and local saved outfits
          const existingOutfitIds = new Set([...outfits.map(outfit => outfit.id)]);
          
          // Filter out outfits that are already in the state
          const uniqueDbOutfits = formattedOutfits.filter(
            (outfit: Outfit) => !existingOutfitIds.has(outfit.id)
          );
          
          if (uniqueDbOutfits.length > 0) {
            // Merge unique outfits from database with existing outfits
            setOutfits(prev => [...prev, ...uniqueDbOutfits]);
          }
        }
      } catch (error) {
        console.error('Error fetching outfits from Supabase:', error);
      }
    };
    
    fetchOutfitsFromSupabase();
  }, [user?.id, outfits]);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Initialize selected outfit
  useEffect(() => {
    if (!selectedOutfitId && outfits.length > 0) {
      setSelectedOutfitId(outfits[0].id);
    }
  }, [selectedOutfitId, outfits]);

  const personalOutfits = outfits.filter(outfit => outfit.favorite);
  const popularOutfits = outfits.slice().sort(() => 0.5 - Math.random());

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
    const availableOutfits = outfits.filter(outfit => outfit.id !== selectedOutfitId);
    const randomIndex = Math.floor(Math.random() * availableOutfits.length);
    setSelectedOutfitId(availableOutfits[randomIndex].id);
  }, [selectedOutfitId, outfits]);

  // Save outfit to collection
  const handleSaveOutfit = async (outfit: Outfit) => {
    // Add generated ID if none exists
    const outfitToSave = {
      ...outfit,
      id: outfit.id || `outfit-${Date.now()}`,
    };

    // Check for outfit duplication before saving
    const isDuplicate = outfits.some(existing => existing.id === outfitToSave.id);
    if (isDuplicate) {
      toast.error('This outfit already exists in your collection.');
      return;
    }

    // Update local state
    setOutfits(prev => [...prev, outfitToSave]);
    
    // Save to localStorage - first check if already exists
    const localSavedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    const outfitExists = localSavedOutfits.some((o: Outfit) => o.id === outfitToSave.id);
    
    if (!outfitExists) {
      const updatedOutfits = [...localSavedOutfits, outfitToSave];
      localStorage.setItem('savedOutfits', JSON.stringify(updatedOutfits));
      setSavedOutfits(updatedOutfits);
    }
    
    // Save to Supabase if user is logged in
    if (user?.id) {
      try {
        // Check if outfit exists in Supabase first
        const { data: existingData } = await supabase
          .from('outfits')
          .select('id')
          .eq('id', outfitToSave.id)
          .eq('user_id', user.id);
          
        if (!existingData || existingData.length === 0) {
          // Insert only if not exists
          await supabase
            .from('outfits')
            .insert({
              id: outfitToSave.id,
              name: outfitToSave.name,
              user_id: user.id,
              items: outfitToSave.items,
              season: outfitToSave.season,
              occasion: outfitToSave.occasion,
              occasions: outfitToSave.occasions,
              favorite: outfitToSave.favorite,
              tags: outfitToSave.tags,
              times_worn: 0,
              date_added: new Date().toISOString()
            });
        }
      } catch (error) {
        console.error('Error saving outfit to Supabase:', error);
        // Continue with local saving even if database save fails
      }
    }
    
    toast.success('Outfit created successfully!');
  };

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
          {/* Replace PageHeader with EnhancedPageHeader */}
          <EnhancedPageHeader
            userName={profile?.first_name}
            onScrollToWeather={scrollToWeatherSection}
          />

          <div className="mt-8 flex justify-center">
            <MixMatchActions 
              onScrollToOutfits={scrollToOutfitsSection}
              onCreateOutfit={handleCreateOutfit}
            />
          </div>

          {/* Weather & Context Section */}
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
                  clothingItems={userClothingItems}
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
              outfits={outfits}
              clothingItems={userClothingItems}
            />
          </motion.section>
          
          {/* Trending Styles Section - Replacing Suggested Outfits Section */}
          <motion.section
            {...fadeUp}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-10"
          >
            <Suspense fallback={<Skeleton className="w-full h-32 rounded-xl bg-slate-800" />}>
              <MemoizedTrendingStylesSection />
            </Suspense>
          </motion.section>
        </main>

        {/* OutfitBuilder Modal */}
        {isBuilderOpen && (
          <OutfitBuilder
            isOpen={isBuilderOpen}
            onClose={() => setIsBuilderOpen(false)}
            onSave={handleSaveOutfit}
            clothingItems={userClothingItems}
          />
        )}
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;
