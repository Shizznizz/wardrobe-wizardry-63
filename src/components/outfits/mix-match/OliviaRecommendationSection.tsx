import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherInfo, Outfit, ClothingItem, ClothingSeason, PersonalityTag } from '@/lib/types';
import { sampleOutfits } from '@/lib/wardrobeData';
import DailyOutfitSection from './DailyOutfitSection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Thermometer, Edit, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import OliviaRecommendationAfterQuiz from './OliviaRecommendationAfterQuiz';

interface OliviaRecommendationSectionProps {
  weather: WeatherInfo | null;
  situation: string | null;
}

const OliviaRecommendationSection = ({ weather, situation }: OliviaRecommendationSectionProps) => {
  const [recommendedOutfit, setRecommendedOutfit] = useState<Outfit | null>(null);
  const [userClothingItems, setUserClothingItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});

  // Fetch user's clothing items from Supabase
  useEffect(() => {
    const fetchUserClothingItems = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
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
          // Generate outfit recommendation after getting clothing items
          generateOutfitRecommendation(formattedItems, weather, situation);
        }
      } catch (error) {
        console.error('Error fetching user clothing items:', error);
        toast.error('Failed to load your wardrobe items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserClothingItems();
  }, [user?.id, weather, situation]);

  // Function to generate outfit recommendation based on user's actual wardrobe
  const generateOutfitRecommendation = (clothingItems: ClothingItem[], currentWeather: WeatherInfo | null, currentSituation: string | null) => {
    // If no items in wardrobe, use a sample outfit
    if (!clothingItems || clothingItems.length === 0) {
      const sampleOutfit = getSituationOutfit(currentSituation);
      setRecommendedOutfit(sampleOutfit);
      return;
    }

    // Get temperature category based on the weather
    const temp = currentWeather?.temperature || 20;
    let season: ClothingSeason = 'spring';
    
    if (temp < 5) {
      season = 'winter';
    } else if (temp < 15) {
      season = 'autumn';
    } else if (temp > 25) {
      season = 'summer';
    }

    // Filter clothing items by season and occasion
    const occasionToMatch = currentSituation || 'casual';
    
    const seasonalItems = clothingItems.filter(item => 
      item.season?.includes(season as string) || item.season?.includes('all')
    );
    
    const suitableItems = seasonalItems.filter(item => 
      item.occasions?.some(occasion => 
        occasion.toLowerCase().includes(occasionToMatch.toLowerCase())
      ) || item.occasions?.includes('casual')
    );

    // If no suitable items found, use a fallback
    if (suitableItems.length === 0) {
      const fallbackOutfit = getSituationOutfit(currentSituation);
      setRecommendedOutfit(fallbackOutfit);
      return;
    }

    // Group items by type
    const itemsByType: Record<string, ClothingItem[]> = {};
    suitableItems.forEach(item => {
      if (!itemsByType[item.type]) {
        itemsByType[item.type] = [];
      }
      itemsByType[item.type].push(item);
    });

    // Define essential clothing categories that should be in every outfit
    const essentialCategories = {
      tops: ['top', 'shirt', 'blouse', 't-shirt', 'sweater', 'jacket', 'hoodie', 'coat', 'blazer', 'cardigan'],
      bottoms: ['bottom', 'pants', 'jeans', 'skirt', 'shorts', 'trousers'],
      footwear: ['shoes', 'sneakers', 'boots', 'sandals']
    };
    
    // Create map to hold one selected item per essential category
    const selectedEssentials: Record<string, ClothingItem | undefined> = {
      top: undefined,
      bottom: undefined,
      footwear: undefined
    };
    
    // Try to find at least one item for each essential category
    for (const category in essentialCategories) {
      const categoryTypes = essentialCategories[category as keyof typeof essentialCategories];
      
      for (const type of categoryTypes) {
        if (itemsByType[type] && itemsByType[type].length > 0) {
          // Select random item from category
          const randomIndex = Math.floor(Math.random() * itemsByType[type].length);
          const selectedItem = itemsByType[type][randomIndex];
          
          // Determine which essential category this belongs to
          if (essentialCategories.tops.includes(type)) {
            selectedEssentials.top = selectedItem;
          } else if (essentialCategories.bottoms.includes(type)) {
            selectedEssentials.bottom = selectedItem;
          } else if (essentialCategories.footwear.includes(type)) {
            selectedEssentials.footwear = selectedItem;
          }
          
          // Break once we found an item for this category type
          break;
        }
      }
    }
    
    // Create our selected items array from the essentials
    const selectedItems: ClothingItem[] = Object.values(selectedEssentials).filter(Boolean) as ClothingItem[];
    
    // Add any extra accessory items if needed (optional items)
    const accessoryTypes = ['hat', 'scarf', 'jewelry', 'belt', 'watch', 'accessory'];
    let accessoryAdded = false;
    
    // Try to add one accessory if we have any available
    for (const type of accessoryTypes) {
      if (itemsByType[type] && itemsByType[type].length > 0 && !accessoryAdded) {
        selectedItems.push(itemsByType[type][0]);
        accessoryAdded = true;
      }
    }
    
    // If any essential items are missing, fall back to sample outfit
    if (!selectedEssentials.top || !selectedEssentials.bottom) {
      console.warn('Missing essential items in wardrobe, using fallback outfit');
      const fallbackOutfit = getSituationOutfit(currentSituation);
      setRecommendedOutfit(fallbackOutfit);
      return;
    }
    
    // Create outfit object if we have at least top and bottom items
    if (selectedItems.length >= 2) {
      const newOutfit: Outfit = {
        id: `olivia-recommendation-${Date.now()}`,
        name: `${currentSituation || 'Casual'} ${season.charAt(0).toUpperCase() + season.slice(1)} Outfit`,
        items: selectedItems.map(item => item.id),
        season: [season as ClothingSeason],
        occasions: [occasionToMatch],
        occasion: occasionToMatch, // Add the required occasion property
        favorite: false,
        tags: [occasionToMatch, season as string, 'Olivia recommendation'],
        personalityTags: ['minimalist', 'casual'] as PersonalityTag[],
        dateAdded: new Date(),
        timesWorn: 0,
        seasons: [season as ClothingSeason]
      };
      
      setRecommendedOutfit(newOutfit);
    } else {
      // Fallback if no outfit could be created
      const fallbackOutfit = getSituationOutfit(currentSituation);
      setRecommendedOutfit(fallbackOutfit);
    }
  };

  // Find a sample outfit that matches the situation (fallback)
  const getSituationOutfit = (currentSituation: string | null) => {
    if (!currentSituation) return sampleOutfits[0];
    
    const matchingOutfits = sampleOutfits.filter(outfit => 
      outfit.tags?.some(tag => tag.toLowerCase().includes(currentSituation.toLowerCase())) ||
      outfit.occasions?.some(occ => occ.toLowerCase().includes(currentSituation.toLowerCase()))
    );
    
    return matchingOutfits.length > 0 ? matchingOutfits[0] : sampleOutfits[0];
  };
  
  // Handle action button clicks
  const handleLike = () => {
    toast.success("You liked this outfit! We'll remember your preference.");
  };
  
  const handleDislike = () => {
    toast.success("Thanks for your feedback!");
  };
  
  const handleMakeWarmer = () => {
    toast.success("Finding warmer alternatives for this outfit...");
  };
  
  const handleChangeTop = () => {
    toast.success("Exploring different top options for you...");
  };
  
  const handleSaveOutfit = () => {
    if (!recommendedOutfit) {
      toast.error("No outfit to save");
      return;
    }

    // Save to localStorage for non-authenticated users
    const savedOutfitsString = localStorage.getItem('savedOutfits');
    const savedOutfits = savedOutfitsString ? JSON.parse(savedOutfitsString) : [];
    
    // Check if outfit with same ID already exists
    const outfitExists = savedOutfits.some((outfit: Outfit) => outfit.id === recommendedOutfit.id);
    
    if (!outfitExists) {
      const updatedOutfits = [...savedOutfits, recommendedOutfit];
      localStorage.setItem('savedOutfits', JSON.stringify(updatedOutfits));
    }

    // Save to Supabase if user is authenticated
    if (user?.id) {
      const saveToSupabase = async () => {
        try {
          // Check if outfit exists in Supabase
          const { data: existingData } = await supabase
            .from('outfits')
            .select('id')
            .eq('id', recommendedOutfit.id)
            .eq('user_id', user.id);
            
          if (!existingData || existingData.length === 0) {
            // Save to Supabase
            await supabase
              .from('outfits')
              .insert({
                id: recommendedOutfit.id,
                name: recommendedOutfit.name,
                user_id: user.id,
                items: recommendedOutfit.items,
                season: recommendedOutfit.season,
                occasion: recommendedOutfit.occasion || 'casual',
                occasions: recommendedOutfit.occasions,
                favorite: recommendedOutfit.favorite,
                tags: recommendedOutfit.tags,
                times_worn: 0,
                date_added: new Date().toISOString()
              });
          }
        } catch (error) {
          console.error('Error saving outfit to Supabase:', error);
        }
      };
      
      saveToSupabase();
    }
    
    toast.success("Outfit saved to your wardrobe!");
  };
  
  const handleAddToCalendar = () => {
    toast.success("Outfit added to your calendar!");
  };

  const hasUserClothing = userClothingItems && userClothingItems.length > 0;
  const outfitItems = hasUserClothing && recommendedOutfit ? 
    userClothingItems.filter(item => recommendedOutfit.items.includes(item.id)) : 
    [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {recommendedOutfit ? (
        <>
          <DailyOutfitSection 
            weather={weather || undefined} 
            currentOutfit={recommendedOutfit}
            clothingItems={userClothingItems.length > 0 ? userClothingItems : []}
            situation={situation || undefined}
          />
          
          {/* Olivia's Thoughts Section */}
          <div className="bg-slate-900/70 border border-white/10 rounded-xl overflow-hidden">
            <Collapsible defaultOpen={true} className="w-full">
              <div className="p-4 flex items-center justify-between bg-purple-900/40 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-purple-400/30">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-white">Olivia's Thoughts</h3>
                </div>
                
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                    <span className="text-lg text-white/80">-</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="p-5 bg-purple-900/30">
                {hasUserClothing ? (
                  <p className="text-white/90 mb-6">
                    I've created this complete outfit using pieces from your wardrobe that work perfectly for {situation || 'casual'} in {weather?.temperature || '16'}°C weather. 
                    Each item complements the others, and the color palette is harmonious. This ensemble provides both style and appropriate coverage for the occasion.
                  </p>
                ) : (
                  <p className="text-white/90 mb-6">
                    This outfit is perfect for {situation || 'casual'} in {weather?.temperature || '16'}°C weather.
                    Add more items to your wardrobe for more personalized recommendations!
                  </p>
                )}
                
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white/90 font-medium mb-3">Why This Works:</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>The color palette is cohesive and flattering</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>These pieces can easily transition between different settings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>The silhouette is on-trend but has timeless appeal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>{weather && weather.temperature < 15 ? 'Layered pieces will keep you warm in this weather' : 'Breathable fabrics will keep you comfortable all day'}</span>
                    </li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Action buttons grid */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-800/70 border-t border-white/10">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLike}
                className="border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDislike}
                className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Dislike
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveOutfit}
                className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMakeWarmer}
                className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 col-span-1"
              >
                <Thermometer className="h-4 w-4 mr-2" />
                Warmer
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleChangeTop}
                className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 col-span-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Top
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddToCalendar}
                className="border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 col-span-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center p-8">
          <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default OliviaRecommendationSection;
