import { useState, useEffect, useCallback, Suspense, lazy, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo, Outfit, ClothingItem } from '@/lib/types';
import { OutfitProvider, useOutfitContext } from '@/hooks/useOutfitContext';
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
import { Plus } from 'lucide-react';
import { Shirt } from '@/components/ui/icons';
import SmartActivitySuggestion from '@/components/outfits/mix-match/SmartActivitySuggestion';
import WeeklyStyleChallenge from '@/components/outfits/mix-match/WeeklyStyleChallenge';
import OutfitItemReplacement from '@/components/outfits/mix-match/OutfitItemReplacement';

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
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ first_name: string | null } | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [userClothingItems, setUserClothingItems] = useState<ClothingItem[]>([]);
  const [outfitTabKey, setOutfitTabKey] = useState(0); // Add this to force re-render
  const [isRefreshingOutfits, setIsRefreshingOutfits] = useState(false);
  const { setIsCreatingNewOutfit, isCreatingNewOutfit } = useOutfitContext();

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

  // Add a handler to replace specific outfit items
  const handleReplaceItem = useCallback((outfitId: string, oldItemId: string, newItemId: string) => {
    setOutfits(prevOutfits => 
      prevOutfits.map(outfit => {
        if (outfit.id === outfitId) {
          const updatedItems = outfit.items?.map(itemId => 
            itemId === oldItemId ? newItemId : itemId
          ) || [];
          return { ...outfit, items: updatedItems };
        }
        return outfit;
      })
    );
    toast.success("Item replaced successfully!");
  }, []);

  // Add handler for activity suggestions
  const handleActivitySuggestion = useCallback((activity: string) => {
    setOccasion(activity);
    setSituation(activity);
    // Scroll to recommendations after a short delay
    setTimeout(scrollToRecommendations, 300);
    toast.success(`Showing outfits for: ${activity}`);
  }, [scrollToRecommendations]);

  // Simplify to a single createOutfit handler
  const handleCreateOutfit = useCallback(() => {
    console.log("Creating a new outfit");
    // Clear selected outfit ID and object to ensure we're creating a new outfit
    setSelectedOutfitId(null);
    setSelectedOutfit(null); // Make sure to also clear the selected outfit object
    setIsCreatingNewOutfit(true); // Explicitly set to creation mode
    setIsBuilderOpen(true); // Ensure the builder modal opens
    toast.info("Creating a new outfit");
  }, [setIsCreatingNewOutfit, setSelectedOutfit, setSelectedOutfitId]);

  // Add handler for editing outfit
  const handleEditOutfit = useCallback((outfit: Outfit) => {
    setSelectedOutfitId(outfit.id);
    setIsCreatingNewOutfit(false);
    setIsBuilderOpen(true);
    toast.info(`Editing outfit: ${outfit.name}`);
  }, [setIsCreatingNewOutfit]);

  // Add handler for deleting outfit
  const handleDeleteOutfit = useCallback(async (outfitId: string) => {
    // Update local state immediately for responsive UI
    setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== outfitId));
    
    // Also remove from saved outfits in localStorage if present
    const localSavedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    const updatedSavedOutfits = localSavedOutfits.filter((outfit: Outfit) => outfit.id !== outfitId);
    localStorage.setItem('savedOutfits', JSON.stringify(updatedSavedOutfits));
    setSavedOutfits(updatedSavedOutfits);
    
    // No need to delete from Supabase here as that's now handled by OutfitTabSection
    // The database deletion logic is now in the confirmDeleteOutfit function in OutfitTabSection
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
            timesWorn: item.timesWorn || 0,
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
  const fetchOutfitsFromSupabase = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsRefreshingOutfits(true);
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Fetched outfits from Supabase:", data);
        const formattedOutfits = data.map(outfit => ({
          ...outfit,
          dateAdded: new Date(outfit.date_added),
          timesWorn: outfit.timesWorn || 0,
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
    } finally {
      setIsRefreshingOutfits(false);
    }
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
    try {
      // Add generated ID if none exists and ensure it's a valid UUID
      const outfitToSave = {
        ...outfit,
        id: outfit.id || crypto.randomUUID(),
      };
  
      // Check for outfit duplication before saving
      const isDuplicate = outfits.some(existing => existing.id === outfitToSave.id);
      if (isDuplicate) {
        console.log("Outfit already exists, updating instead of creating duplicate");
      }
  
      console.log("Saving outfit:", outfitToSave);
  
      // Save to Supabase if user is logged in
      if (user) {
        try {
          // Prepare outfit data for Supabase
          const outfitData = {
            id: outfitToSave.id,
            name: outfitToSave.name,
            user_id: user.id,
            items: outfitToSave.items,
            season: outfitToSave.season,
            occasion: outfitToSave.occasion,
            occasions: outfitToSave.occasions,
            favorite: outfitToSave.favorite,
            times_worn: outfitToSave.timesWorn || 0,
            date_added: new Date().toISOString()
          };
          
          // Check if outfit exists already
          const { data: existingOutfit } = await supabase
            .from('outfits')
            .select('id')
            .eq('id', outfitToSave.id)
            .maybeSingle();
          
          let result;
          if (existingOutfit) {
            console.log("Updating existing outfit in Supabase");
            result = await supabase
              .from('outfits')
              .update(outfitData)
              .eq('id', outfitToSave.id);
          } else {
            console.log("Inserting new outfit to Supabase");
            result = await supabase
              .from('outfits')
              .insert([outfitData]);
          }
            
          if (result.error) {
            console.error("Error saving outfit to Supabase:", result.error);
            toast.error("Failed to save outfit to database");
            return;
          }
          
          console.log("Outfit saved to Supabase successfully");
        } catch (err) {
          console.error("Exception saving to Supabase:", err);
          toast.error("Failed to save outfit to database");
          return;
        }
      }
      
      // Update local state
      if (isDuplicate) {
        // Update existing outfit
        setOutfits(prev => prev.map(o => o.id === outfitToSave.id ? outfitToSave : o));
      } else {
        // Add new outfit
        setOutfits(prev => {
          const updated = [...prev, outfitToSave];
          console.log("Updated outfits:", updated);
          return updated;
        });
        
        // Save to localStorage - first check if already exists
        const localSavedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
        const outfitExists = localSavedOutfits.some((o: Outfit) => o.id === outfitToSave.id);
        
        if (!outfitExists) {
          const updatedOutfits = [...localSavedOutfits, outfitToSave];
          localStorage.setItem('savedOutfits', JSON.stringify(updatedOutfits));
          setSavedOutfits(updatedOutfits);
        }
      }
      
      // Reset creation state
      setIsCreatingNewOutfit(false);
      
      // Close the builder modal
      setIsBuilderOpen(false);
      
      // Force tab section to re-render
      setOutfitTabKey(prev => prev + 1);
      
      toast.success(isDuplicate ? 'Outfit updated successfully!' : 'Outfit created successfully!');
      
      // Fetch the latest outfits from Supabase
      fetchOutfitsFromSupabase();
      
      // Scroll to the outfits section to show the newly added outfit
      setTimeout(() => {
        scrollToOutfitsSection();
      }, 500);
    } catch (error) {
      console.error("Error saving outfit:", error);
      toast.error("Failed to save outfit. Please try again.");
    }
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

  // Find the selected outfit using the selectedOutfitId
  const getSelectedOutfit = () => {
    if (!selectedOutfitId) return null;
    return outfits.find(outfit => outfit.id === selectedOutfitId) || null;
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
            />
          </div>

          {/* Weather & Context Section */}
          <motion.section
            ref={weatherSectionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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

          {/* Smart Activity Suggestion - NEW SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-6"
          >
            <SmartActivitySuggestion 
              weather={weather || undefined} 
              onSuggestionSelect={handleActivitySuggestion}
            />
          </motion.section>

          {/* Olivia's Recommendation Section */}
          <motion.section
            ref={oliviaRecommendationRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
          
          {/* Weekly Style Challenge - NEW SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-8"
          >
            <WeeklyStyleChallenge />
          </motion.section>
          
          {/* Create Outfit Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <CollapsibleSection
              title={<h3 className="text-xl font-semibold text-white">Create Your Own Outfit</h3>}
              defaultOpen={false}
            >
              <div className="p-6 bg-slate-900/60 rounded-lg border border-slate-700/30">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-medium text-white mb-3">Mix and match items from your wardrobe</h4>
                  <p className="text-slate-300 mb-6">
                    Select items from your collection to create a personalized outfit
                  </p>
                  
                  <Button
                    onClick={handleCreateOutfit}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 px-8 py-6 h-auto text-lg shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Outfit
                  </Button>
                </div>
                
                <Suspense fallback={<Skeleton className="w-full h-32 rounded-xl bg-slate-800" />}>
                  <MemoizedCreateOutfitSection 
                    clothingItems={userClothingItems}
                    isPremium={false}
                  />
                </Suspense>
              </div>
            </CollapsibleSection>
          </motion.section>
          
          {/* Context Adjustment Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
          
          {/* My Collection Section - Updated with edit and delete handlers */}
          <motion.section
            ref={outfitTabSectionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 scroll-mt-24"
          >
            <OutfitTabSection
              key={outfitTabKey} // Keep this to force re-render on updates
              outfits={outfits}
              clothingItems={userClothingItems}
              isRefreshing={isRefreshingOutfits}
              onRefresh={fetchOutfitsFromSupabase}
              onReplaceItem={handleReplaceItem}
              onEditOutfit={handleEditOutfit}
              onDeleteOutfit={handleDeleteOutfit}
            />
          </motion.section>
          
          {/* Trending Styles Section - Replacing Suggested Outfits Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-10"
          >
            <Suspense fallback={<Skeleton className="w-full h-32 rounded-xl bg-slate-800" />}>
              <MemoizedTrendingStylesSection />
            </Suspense>
          </motion.section>
          
          {/* Your Daily Style section - Update button to use handleCreateOutfit */}
          <motion.section 
            className="mt-12 mb-12 flex flex-col items-center text-center"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <span className="text-pink-400 mb-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400 mb-4">
                Your Daily Style,<br/>Curated by Olivia
              </h2>
              <p className="text-white/70 text-xl mb-8">
                Get AI-powered outfits based on your style, mood, and local weather.
              </p>
              
              <div className="mb-12">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90 px-8 py-6 h-auto text-lg shadow-lg"
                >
                  Let Olivia Style Me Today
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={scrollToOutfitsSection}
                  variant="outline"
                  size="lg"
                  className="border-pink-500/30 text-white hover:bg-white/10"
                >
                  <Shirt className="mr-2 h-4 w-4" />
                  See My Outfits
                </Button>
                
                <Button
                  onClick={handleCreateOutfit}
                  variant="outline"
                  size="lg"
                  className="border-violet-500/30 text-white hover:bg-white/10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Outfit
                </Button>
              </div>
            </div>
          </motion.section>
        </main>

        {/* OutfitBuilder Modal */}
        {isBuilderOpen && (
          <OutfitBuilder
            isOpen={isBuilderOpen}
            onClose={() => {
              setIsBuilderOpen(false);
              setIsCreatingNewOutfit(false);
            }}
            onSave={handleSaveOutfit}
            clothingItems={userClothingItems}
            initialOutfit={isCreatingNewOutfit ? null : getSelectedOutfit()}
          />
        )}
      </div>
    </OutfitProvider>
  );
};

export default MixAndMatch;
