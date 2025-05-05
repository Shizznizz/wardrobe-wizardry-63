import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ShoppingBag, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Outfit, WeatherInfo, ClothingItem } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { sampleOutfits } from '@/lib/wardrobeData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import OutfitImageGrid from '@/components/outfits/OutfitImageGrid';

interface OliviaRecommendationSectionProps {
  weather: WeatherInfo | null;
  situation: string | null;
}

const OliviaRecommendationSection = ({ weather, situation }: OliviaRecommendationSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [generatedOutfit, setGeneratedOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userClothingItems, setUserClothingItems] = useState<ClothingItem[]>([]);
  
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
          
          // After fetching clothing items, generate an outfit
          generateOutfitRecommendation(formattedItems);
        } else {
          // If no user clothing items found, display a toast message
          toast.info("Add some clothes to your wardrobe to get personalized recommendations!");
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user clothing items:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserClothingItems();
  }, [user?.id, weather, situation]);
  
  // Generate outfit recommendation based on user's clothing items
  const generateOutfitRecommendation = useCallback((items: ClothingItem[]) => {
    setIsLoading(true);
    
    // Ensure we have items to work with
    if (!items || items.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Filter clothes by weather condition if available
      let filteredItems = [...items];
      
      if (weather) {
        const temperature = weather.temperature || 20;
        
        // Filter for appropriate seasons based on temperature
        if (temperature < 10) {
          // Cold weather - winter clothes
          filteredItems = filteredItems.filter(item => 
            item.season && (item.season.includes('winter') || item.season.includes('all'))
          );
        } else if (temperature < 20) {
          // Mild weather - spring/fall clothes
          filteredItems = filteredItems.filter(item => 
            item.season && (
              item.season.includes('spring') || 
              item.season.includes('autumn') || 
              item.season.includes('all')
            )
          );
        } else {
          // Warm weather - summer clothes
          filteredItems = filteredItems.filter(item => 
            item.season && (item.season.includes('summer') || item.season.includes('all'))
          );
        }
      }
      
      // Filter by situation/occasion if available
      if (situation && situation !== 'all') {
        filteredItems = filteredItems.filter(item => 
          item.occasions && (
            item.occasions.includes(situation as any) || 
            item.occasions.includes('casual')
          )
        );
      }
      
      // If we don't have enough items after filtering, use all items
      if (filteredItems.length < 3) {
        filteredItems = items;
      }
      
      // Categorize clothing items
      const tops = filteredItems.filter(item => 
        ['shirt', 't-shirt', 'blouse', 'sweater', 'hoodie', 'top'].includes(item.type)
      );
      
      const bottoms = filteredItems.filter(item => 
        ['pants', 'jeans', 'shorts', 'skirt', 'leggings'].includes(item.type)
      );
      
      const dresses = filteredItems.filter(item => 
        ['dress', 'jumpsuit'].includes(item.type)
      );
      
      const outerwear = filteredItems.filter(item => 
        ['jacket', 'coat', 'blazer', 'cardigan'].includes(item.type)
      );
      
      const shoes = filteredItems.filter(item => 
        ['shoes', 'sneakers', 'boots', 'sandals', 'heels'].includes(item.type)
      );
      
      const accessories = filteredItems.filter(item => 
        ['hat', 'scarf', 'gloves', 'belt', 'bag', 'jewelry', 'sunglasses'].includes(item.type)
      );
      
      // Create outfit items array
      let outfitItems: string[] = [];
      
      // Strategy: Either pick a dress OR pick top + bottom
      if (dresses.length > 0 && Math.random() > 0.5) {
        // Add a dress
        const randomDress = dresses[Math.floor(Math.random() * dresses.length)];
        outfitItems.push(randomDress.id);
      } else {
        // Add a top if available
        if (tops.length > 0) {
          const randomTop = tops[Math.floor(Math.random() * tops.length)];
          outfitItems.push(randomTop.id);
        }
        
        // Add a bottom if available
        if (bottoms.length > 0) {
          const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
          outfitItems.push(randomBottom.id);
        }
      }
      
      // Conditionally add outerwear based on temperature
      if (outerwear.length > 0 && weather && weather.temperature && weather.temperature < 20) {
        const randomOuterwear = outerwear[Math.floor(Math.random() * outerwear.length)];
        outfitItems.push(randomOuterwear.id);
      }
      
      // Add shoes if available
      if (shoes.length > 0) {
        const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];
        outfitItems.push(randomShoes.id);
      }
      
      // Add 1-2 accessories if available
      if (accessories.length > 0) {
        const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)];
        outfitItems.push(randomAccessory.id);
        
        // Add another accessory 50% of the time
        if (accessories.length > 1 && Math.random() > 0.5) {
          let remainingAccessories = accessories.filter(a => a.id !== randomAccessory.id);
          const secondAccessory = remainingAccessories[Math.floor(Math.random() * remainingAccessories.length)];
          outfitItems.push(secondAccessory.id);
        }
      }
      
      // If we couldn't build a proper outfit, try a fallback approach
      if (outfitItems.length < 2) {
        // Just pick 2-4 random items from the entire wardrobe
        const randomItems = [...filteredItems]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(4, filteredItems.length));
        
        outfitItems = randomItems.map(item => item.id);
      }
      
      // Create the outfit object
      const outfit: Outfit = {
        id: `olivia-recommendation-${Date.now()}`,
        name: generateOutfitName(situation, weather),
        items: outfitItems,
        season: weather ? 
          (weather.temperature < 10 ? ['winter'] : 
           weather.temperature < 20 ? ['spring', 'autumn'] : 
           ['summer']) : 
          ['all'],
        seasons: weather ? 
          (weather.temperature < 10 ? ['winter'] : 
           weather.temperature < 20 ? ['spring', 'autumn'] : 
           ['summer']) : 
          ['all'],
        occasion: situation || 'casual',
        occasions: [situation || 'casual'],
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
      };
      
      setGeneratedOutfit(outfit);
    } catch (error) {
      console.error('Error generating outfit recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [weather, situation]);
  
  // Generate outfit name based on situation and weather
  const generateOutfitName = (situation: string | null, weather: WeatherInfo | null): string => {
    const situationNames = {
      casual: ['Everyday Casual', 'Relaxed Look', 'Laid-Back Style'],
      formal: ['Elegant Ensemble', 'Sophisticated Look', 'Formal Finesse'],
      business: ['Professional Polish', 'Office Chic', 'Business Ready'],
      party: ['Party Perfect', 'Night Out Glam', 'Celebration Style'],
      date: ['Date Night Special', 'Romantic Ensemble', 'Perfect Date Look'],
      travel: ['Travel Ready', 'Journey Style', 'On-the-Go Look']
    };
    
    const weatherNames = {
      clear: ['Sunny Day', 'Clear Skies', 'Bright Weather'],
      cloudy: ['Cloudy Day', 'Overcast', 'Grey Skies'],
      rain: ['Rainy Day', 'Drizzle Ready', 'Shower Proof'],
      snow: ['Snow Day', 'Winter Wonderland', 'Frosty Look'],
      windy: ['Breezy Day', 'Wind-Resistant', 'Breeze Ready']
    };
    
    const situationOptions = situationNames[situation as keyof typeof situationNames] || ['Versatile Look'];
    const weatherOptions = weather?.condition ? 
      weatherNames[weather.condition as keyof typeof weatherNames] || ['All-Weather'] : 
      ['Seasonal Style'];
    
    const situationPart = situationOptions[Math.floor(Math.random() * situationOptions.length)];
    const weatherPart = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    
    return `Olivia's ${situationPart} for ${weatherPart}`;
  };
  
  // UI handlers
  const handleTryOnOutfit = () => {
    if (!generatedOutfit) return;
    
    // Save to localStorage for fitting room to use
    localStorage.setItem('previewOutfit', JSON.stringify(generatedOutfit));
    toast.success("Taking you to the Fitting Room to try on this look!");
    navigate('/fitting-room');
  };
  
  const handleSaveOutfit = () => {
    if (!generatedOutfit) return;
    
    // Save to localStorage
    const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    savedOutfits.push(generatedOutfit);
    localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
    
    // Save to Supabase if user is logged in
    if (user?.id) {
      // Check if outfit already exists
      supabase
        .from('outfits')
        .select('id')
        .eq('id', generatedOutfit.id)
        .then(({ data, error }) => {
          if (error) console.error('Error checking outfit:', error);
          
          // Only insert if it doesn't exist already
          if (!data || data.length === 0) {
            supabase
              .from('outfits')
              .insert({
                id: generatedOutfit.id,
                name: generatedOutfit.name,
                user_id: user.id,
                items: generatedOutfit.items,
                season: generatedOutfit.season,
                seasons: generatedOutfit.seasons,
                occasion: generatedOutfit.occasion,
                occasions: generatedOutfit.occasions,
                favorite: generatedOutfit.favorite,
                times_worn: 0,
                date_added: new Date().toISOString()
              })
              .then(({ error }) => {
                if (error) console.error('Error saving outfit:', error);
              });
          }
        });
    }
    
    toast.success("Outfit saved to your collection!");
  };
  
  const handleShopSimilarLook = () => {
    toast.success("Taking you to shop for similar styles!");
    navigate('/shop-and-try');
  };

  const handleAddToCalendar = () => {
    toast.success("Opening calendar to schedule this outfit!");
    navigate('/style-planner');
  };
  
  // Get clothing item details to display in the grid
  const getOutfitItems = (): ClothingItem[] => {
    if (!generatedOutfit || !generatedOutfit.items) return [];
    
    return generatedOutfit.items
      .map(itemId => userClothingItems.find(item => item.id === itemId))
      .filter(item => item !== undefined) as ClothingItem[];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Your Daily Outfit from Olivia
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-purple-400/30 px-3 py-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-300" />
                Style Recommendation
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
              <p>Picked for you based on today's weather in {weather?.city || 'your area'} and your preferences.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 bg-white/10" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-28 aspect-square bg-white/10" />
            <Skeleton className="h-28 aspect-square bg-white/10" />
            <Skeleton className="h-28 aspect-square bg-white/10" />
          </div>
          <Skeleton className="h-10 w-full bg-white/10" />
        </div>
      ) : userClothingItems.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-6 text-center space-y-4 border border-white/10">
          <h3 className="text-xl font-medium text-white">Add Your Wardrobe Items First</h3>
          <p className="text-white/70">
            Olivia needs your clothing items to create personalized outfit recommendations.
          </p>
          <Button 
            onClick={() => navigate('/my-wardrobe')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-900/20"
          >
            Go to My Wardrobe
          </Button>
        </div>
      ) : generatedOutfit ? (
        <div className="space-y-6">
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-medium text-white mb-4">{generatedOutfit.name}</h3>
            
            <div className="mb-6">
              <OutfitImageGrid 
                itemIds={generatedOutfit.items} 
                clothingItems={userClothingItems}
                className="rounded-lg overflow-hidden"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {generatedOutfit.seasons?.map(season => (
                <span key={season} className="px-2.5 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200">
                  {season}
                </span>
              ))}
              {generatedOutfit.occasions?.map(occasion => (
                <span key={occasion} className="px-2.5 py-1 text-xs rounded-full bg-blue-500/20 text-blue-200">
                  {occasion}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-900/20"
                onClick={handleTryOnOutfit}
              >
                Try on Outfit
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-400/30 text-white hover:bg-white/10"
                onClick={handleSaveOutfit}
              >
                <Save className="mr-2 h-5 w-5" /> Save to Collection
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-400/30 text-white hover:bg-white/10"
                onClick={handleShopSimilarLook}
              >
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Similar
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                className="border-green-400/30 text-white hover:bg-white/10"
                onClick={handleAddToCalendar}
              >
                <Calendar className="mr-2 h-5 w-5" /> Add to Calendar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-6 text-center space-y-4 border border-white/10">
          <h3 className="text-xl font-medium text-white">No Suitable Outfit Found</h3>
          <p className="text-white/70">
            Try adding more clothing items to your wardrobe for better outfit recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default OliviaRecommendationSection;
