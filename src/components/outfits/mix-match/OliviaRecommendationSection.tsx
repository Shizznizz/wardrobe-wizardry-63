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
  const [outfitGenerationAttempts, setOutfitGenerationAttempts] = useState(0);

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
      item.season?.includes(season) || item.season?.includes('all')
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
      
      // Check all available types in this category
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
          
          // Break only after finding this specific type
          // We continue looping to potentially find other category items
        }
      }
    }
    
    // Check if we have both top and bottom, which are essential
    // If not, try generating the outfit again with different selections (max 3 attempts)
    if (!selectedEssentials.top || !selectedEssentials.bottom) {
      if (outfitGenerationAttempts < 3) {
        setOutfitGenerationAttempts(prev => prev + 1);
        generateOutfitRecommendation(clothingItems, currentWeather, currentSituation);
        return;
      } else {
        // After 3 attempts, use fallback outfit
        console.warn('Missing essential items in wardrobe after multiple attempts, using fallback outfit');
        const fallbackOutfit = getSituationOutfit(currentSituation);
        setRecommendedOutfit(fallbackOutfit);
        setOutfitGenerationAttempts(0);
        return;
      }
    }
    
    // Reset attempt counter
    setOutfitGenerationAttempts(0);
    
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
    
    // Create outfit object if we have the essential items
    const seasonValue = season as ClothingSeason;
    const newOutfit: Outfit = {
      id: `olivia-recommendation-${Date.now()}`,
      name: `${currentSituation || 'Casual'} ${season.charAt(0).toUpperCase() + season.slice(1)} Outfit`,
      items: selectedItems.map(item => item.id),
      season: [seasonValue],
      occasions: [occasionToMatch],
      occasion: occasionToMatch,
      favorite: false,
      personality_tags: [occasionToMatch, season, 'Olivia recommendation'],
      dateAdded: new Date(),
      timesWorn: 0,
      seasons: [seasonValue]
    };
    
    setRecommendedOutfit(newOutfit);
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
    if (!recommendedOutfit) return;
    
    toast.success("You liked this outfit! We'll remember your preference.");
    
    // Store the preference in database if user is logged in
    if (user?.id) {
      supabase.from('outfit_feedback').insert({
        user_id: user.id,
        outfit_id: recommendedOutfit.id,
        feedback_type: 'like',
        weather_context: weather ? JSON.stringify({
          temperature: weather.temperature,
          condition: weather.condition
        }) : null,
        situation: situation
      }).then(({ error }) => {
        if (error) console.error('Error saving feedback:', error);
      });
    }
  };
  
  const handleDislike = () => {
    if (!recommendedOutfit) return;
    
    toast.success("Thanks for your feedback!");
    
    // Store the negative feedback and try to generate a new outfit
    if (user?.id) {
      supabase.from('outfit_feedback').insert({
        user_id: user.id,
        outfit_id: recommendedOutfit.id,
        feedback_type: 'dislike',
        weather_context: weather ? JSON.stringify({
          temperature: weather.temperature,
          condition: weather.condition
        }) : null,
        situation: situation
      }).then(({ error }) => {
        if (error) console.error('Error saving feedback:', error);
        
        // Generate a new outfit recommendation after disliking
        generateOutfitRecommendation(userClothingItems, weather, situation);
      });
    } else {
      // Even without user, generate a new outfit
      generateOutfitRecommendation(userClothingItems, weather, situation);
    }
  };
  
  const handleMakeWarmer = () => {
    toast.success("Finding warmer alternatives for this outfit...");
    
    // Logic to adjust for warmer outfit
    // Get current temp and add additional layers
    const layeringTypes = ['jacket', 'sweater', 'coat', 'cardigan'];
    
    // Find warmer items in user's wardrobe
    const warmerItems = userClothingItems.filter(item => 
      layeringTypes.includes(item.type.toLowerCase()) && 
      (item.season?.includes('winter') || item.season?.includes('autumn'))
    );
    
    if (warmerItems.length > 0 && recommendedOutfit) {
      // Select a random warmer item
      const randomWarmerItem = warmerItems[Math.floor(Math.random() * warmerItems.length)];
      
      // Add to current outfit if not already included
      if (!recommendedOutfit.items.includes(randomWarmerItem.id)) {
        const updatedOutfit = {
          ...recommendedOutfit,
          items: [...recommendedOutfit.items, randomWarmerItem.id],
          name: `${recommendedOutfit.name} (Warmer)`
        };
        
        setRecommendedOutfit(updatedOutfit);
        toast.success(`Added ${randomWarmerItem.name} for extra warmth!`);
      } else {
        // If item already in outfit, just regenerate
        generateOutfitRecommendation(userClothingItems, weather, situation);
      }
    } else {
      // If no warmer items, regenerate with winter preference
      const modifiedWeather = weather ? {
        ...weather,
        temperature: Math.max((weather.temperature || 20) - 10, 0) // Make temperature colder
      } : null;
      
      generateOutfitRecommendation(userClothingItems, modifiedWeather, situation);
    }
  };
  
  const handleChangeTop = () => {
    toast.success("Exploring different top options for you...");
    
    if (!recommendedOutfit) return;
    
    // Find top item IDs in the current outfit
    const topTypes = ['top', 'shirt', 'blouse', 't-shirt', 'sweater', 'jacket', 'hoodie', 'coat', 'blazer', 'cardigan'];
    const currentItems = userClothingItems.filter(item => recommendedOutfit.items.includes(item.id));
    const currentTopIds = currentItems
      .filter(item => topTypes.includes(item.type.toLowerCase()))
      .map(item => item.id);
    
    // Filter for alternative tops from user's wardrobe
    const alternativeTops = userClothingItems.filter(item => 
      topTypes.includes(item.type.toLowerCase()) && 
      !currentTopIds.includes(item.id)
    );
    
    if (alternativeTops.length > 0) {
      // Select a random alternative top
      const newTop = alternativeTops[Math.floor(Math.random() * alternativeTops.length)];
      
      // Replace current top with new one
      const updatedItems = recommendedOutfit.items.filter(id => 
        !currentTopIds.includes(id)
      );
      
      const updatedOutfit = {
        ...recommendedOutfit,
        items: [...updatedItems, newTop.id],
        name: recommendedOutfit.name
      };
      
      setRecommendedOutfit(updatedOutfit);
      toast.success(`Swapped in ${newTop.name}!`);
    } else {
      // If no alternative tops, notify user
      toast.info("No alternative tops available in your wardrobe");
    }
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
                personality_tags: recommendedOutfit.personality_tags,
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
    if (!recommendedOutfit) {
      toast.error("No outfit to schedule");
      return;
    }
    
    // Just a toast for now - future enhancement would be to open a calendar modal
    toast.success("Outfit added to your calendar!");
    
    // If user is authenticated, save to outfit logs
    if (user?.id) {
      // Get tomorrow's date for scheduling
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      supabase.from('outfit_logs').insert({
        user_id: user.id,
        date: tomorrow.toISOString(),
        outfit_id: recommendedOutfit.id,
        activity: situation || 'casual',
        weather_condition: weather?.condition || null,
        temperature: weather?.temperature ? String(weather.temperature) : null,
        time_of_day: 'morning',
        ai_suggested: true
      }).then(({ error }) => {
        if (error) console.error('Error scheduling outfit:', error);
      });
    }
  };

  const hasUserClothing = userClothingItems && userClothingItems.length > 0;
  const outfitItems = hasUserClothing && recommendedOutfit ? 
    userClothingItems.filter(item => recommendedOutfit.items.includes(item.id)) : 
    [];
  
  // Generate tips based on weather and situation
  const getWeatherTip = () => {
    if (!weather) return "Dress appropriately for today's weather!";
    
    const { temperature, condition } = weather;
    const conditionLower = condition?.toLowerCase() || '';
    
    if (temperature < 5) return "Layer up! It's freezing outside today.";
    if (temperature < 10) return "Don't forget a warm jacket in this cold weather.";
    if (temperature < 15 && conditionLower.includes('rain')) return "Bring a waterproof outer layer for the chilly rain.";
    if (temperature < 15) return "A light jacket or sweater would be perfect for today's cool weather.";
    if (temperature < 22 && conditionLower.includes('rain')) return "Grab a light raincoat for the mild, rainy conditions.";
    if (temperature < 22) return "The mild temperature today calls for light layers you can adjust throughout the day.";
    if (temperature < 28 && conditionLower.includes('sun')) return "It's sunny and warm! Light, breathable fabrics are your friend today.";
    if (temperature < 28) return "Opt for breathable fabrics in this warm weather.";
    return "It's very hot today! Choose lightweight, loose-fitting clothes and stay hydrated.";
  };
  
  const getActivityTip = () => {
    if (!situation) return "Your outfit should match your planned activities for the day!";
    
    const situationLower = situation.toLowerCase();
    
    if (situationLower.includes('work')) return "Professional doesn't have to mean boring! Add a personal touch with accessories.";
    if (situationLower.includes('formal')) return "For formal events, the fit of your clothing is just as important as the style.";
    if (situationLower.includes('casual')) return "Keep it casual but intentional - even relaxed looks can be stylish!";
    if (situationLower.includes('sport') || situationLower.includes('gym')) return "Choose performance fabrics that wick moisture and allow freedom of movement.";
    if (situationLower.includes('date')) return "Confidence is your best accessory. Wear something that makes you feel amazing!";
    if (situationLower.includes('party')) return "Have fun with your look! This is a great time to experiment with a bolder style.";
    
    return "Dress for the occasion while staying true to your personal style.";
  };
  
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
                    I've created this complete outfit using pieces from your wardrobe that work perfectly for {situation || 'casual'} in {weather?.temperature || '16'}°C {weather?.condition?.toLowerCase() || ''} weather. 
                    Each item complements the others, and the color palette is harmonious. This ensemble provides both style and appropriate coverage for the occasion.
                  </p>
                ) : (
                  <p className="text-white/90 mb-6">
                    This outfit is perfect for {situation || 'casual'} in {weather?.temperature || '16'}°C weather.
                    Add more items to your wardrobe for more personalized recommendations!
                  </p>
                )}
                
                {hasUserClothing && outfitItems.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white/90 font-medium mb-3">Selected Pieces:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {outfitItems.map(item => (
                        <div key={item.id} className="bg-white/5 rounded-md p-2 flex flex-col items-center">
                          {item.imageUrl ? (
                            <div className="h-24 w-24 overflow-hidden rounded-md mb-2">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-24 w-24 bg-slate-800/50 rounded-md flex items-center justify-center mb-2">
                              <span className="text-white/40 text-xs">No image</span>
                            </div>
                          )}
                          <span className="text-xs text-white/80 text-center line-clamp-1">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>{getWeatherTip()}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>{getActivityTip()}</span>
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
