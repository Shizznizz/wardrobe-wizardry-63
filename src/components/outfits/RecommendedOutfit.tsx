
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ThumbsUp, ThumbsDown, Edit, Thermometer, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Coffee, Party, Umbrella, Sunset, Moon, TrousersIcon } from '@/components/ui/icons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import EnhancedLocationSelector from '@/components/weather/EnhancedLocationSelector';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AddToCalendarButton from './AddToCalendarButton';
import { OutfitLog } from './OutfitLogItem';
import { Badge } from '@/components/ui/badge';

interface RecommendedOutfitProps {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  onRefreshOutfit: () => void;
  onOutfitAddedToCalendar?: (log: OutfitLog) => void;
  onFeedbackAction?: (feedbackType: string, outfit: Outfit) => void;
}

const RecommendedOutfit = ({ 
  outfit, 
  clothingItems, 
  onRefreshOutfit,
  onOutfitAddedToCalendar,
  onFeedbackAction
}: RecommendedOutfitProps) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [showRotatingView, setShowRotatingView] = useState(false);
  const [location, setLocation] = useState<{ city?: string; country?: string }>({});
  const { savedLocation, isLoading } = useLocationStorage();
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const { user } = useAuth();
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const locationUpdatedOnceRef = useRef(false);
  const [oliviaThoughtsExpanded, setOliviaThoughtsExpanded] = useState(true);

  useEffect(() => {
    if (savedLocation && !isLoading && !locationUpdatedOnceRef.current) {
      setLocation({
        country: savedLocation.country,
        city: savedLocation.city
      });
      locationUpdatedOnceRef.current = true;
    }
  }, [savedLocation, isLoading]);

  useEffect(() => {
    if (currentWeather && outfit) {
      const tags: string[] = [];
      
      if (currentWeather.temperature < 5) tags.push("Cold");
      else if (currentWeather.temperature < 15) tags.push("Cool");
      else if (currentWeather.temperature < 25) tags.push("Mild");
      else tags.push("Warm");
      
      if (currentWeather.condition.toLowerCase().includes('rain')) tags.push("Rainy");
      if (currentWeather.condition.toLowerCase().includes('snow')) tags.push("Snowy");
      if (currentWeather.condition.toLowerCase().includes('cloud')) tags.push("Cloudy");
      if (currentWeather.condition.toLowerCase().includes('sun')) tags.push("Sunny");
      
      if (outfit.seasons.includes('winter')) tags.push("Layered");
      if (outfit.seasons.includes('summer')) tags.push("Light");
      if (outfit.occasions.includes('formal')) tags.push("Elegant");
      if (outfit.occasions.includes('casual')) tags.push("Casual");
      
      if (selectedOccasion === 'Party') tags.push("Weekend");
      if (selectedOccasion === 'Work') tags.push("Professional");
      if (selectedOccasion === 'Date') tags.push("Stylish");
      
      setGeneratedTags([...new Set(tags)]);
    }
  }, [currentWeather, outfit, selectedOccasion]);

  const handleWeatherChange = (weather: WeatherInfo) => {
    setCurrentWeather(weather);
  };

  const handleSelectOccasion = (occasion: string) => {
    setSelectedOccasion(occasion);
    toast.success(`Occasion set to: ${occasion}`, {
      duration: 3000
    });
    
    setTimeout(() => {
      handleRefreshOutfit();
    }, 300);
    
    if (onFeedbackAction) {
      onFeedbackAction('occasion-change', {
        ...outfit,
        occasions: [occasion]
      });
    }
  };

  const handleRefreshOutfit = () => {
    setShowRotatingView(true);
    setTimeout(() => setShowRotatingView(false), 1000);
    onRefreshOutfit();
    
    toast.success("Finding the perfect outfit for you...", {
      duration: 3000
    });
  };

  const handleLocationChange = (city: string, country: string) => {
    setLocation({ city, country });
  };

  const handleLikeOutfit = async () => {
    setIsSubmittingFeedback(true);
    try {
      if (user) {
        await supabase
          .from('outfit_feedback')
          .insert({
            user_id: user.id,
            outfit_id: outfit.id,
            feedback: 'like',
            weather_condition: currentWeather?.condition,
            temperature: currentWeather?.temperature,
            occasion: selectedOccasion
          });
      }
      
      toast.success("Thanks for your feedback!", {
        duration: 2000
      });
      
      if (onFeedbackAction) {
        onFeedbackAction('like', outfit);
      }
      
      const element = document.getElementById(`outfit-${outfit.id}`);
      if (element) {
        element.classList.add('bg-green-500/10');
        setTimeout(() => {
          element.classList.remove('bg-green-500/10');
        }, 500);
      }
    } catch (error) {
      console.error('Error saving outfit feedback:', error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleDislikeOutfit = async () => {
    setIsSubmittingFeedback(true);
    try {
      if (user) {
        await supabase
          .from('outfit_feedback')
          .insert({
            user_id: user.id,
            outfit_id: outfit.id,
            feedback: 'dislike',
            weather_condition: currentWeather?.condition,
            temperature: currentWeather?.temperature,
            occasion: selectedOccasion
          });
      }
      
      toast.success("Thanks for your feedback!", {
        duration: 2000
      });
      
      if (onFeedbackAction) {
        onFeedbackAction('dislike', outfit);
      }
      
      setTimeout(() => {
        onRefreshOutfit();
      }, 800);
    } catch (error) {
      console.error('Error saving outfit feedback:', error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleMakeWarmer = () => {
    toast.success("Making your outfit warmer...");
    
    if (onFeedbackAction) {
      onFeedbackAction('warmer', outfit);
    }
    
    setTimeout(() => {
      onRefreshOutfit();
    }, 500);
  };
  
  const handleChangeTop = () => {
    toast.success("Finding alternative top options...");
    
    if (onFeedbackAction) {
      onFeedbackAction('change-top', outfit);
    }
    
    setTimeout(() => {
      onRefreshOutfit();
    }, 500);
  };

  const handleOutfitAddedToCalendar = (log: OutfitLog) => {
    if (onOutfitAddedToCalendar) {
      onOutfitAddedToCalendar(log);
    }
  };

  const handleSaveToWardrobe = () => {
    toast.success(`${outfit.name} has been saved to your wardrobe`, {
      description: "You can access it anytime from your wardrobe collection."
    });
  };

  return (
    <motion.section variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }} className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold mb-0 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Today's Recommended Outfit
        </h2>
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleRefreshOutfit}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${showRotatingView ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {currentWeather && location.city && (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-md px-3 py-2 flex items-center text-sm text-white/80">
          <MapPin className="h-4 w-4 mr-1 text-purple-400" />
          <span>
            Picked for you based on {currentWeather.temperature}°C, {currentWeather.condition.toLowerCase()} in {location.city}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1">
          <EnhancedLocationSelector 
            onLocationChange={handleLocationChange}
            initialCity={location.city}
            initialCountry={location.country}
            showToasts={false}
          />
          
          <div className="mt-4">
            <WeatherWidget 
              onWeatherChange={handleWeatherChange} 
              city={location.city}
              country={location.country}
              savePreferences={false}
              showToasts={false}
            />
          </div>
          
          <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Coffee className="mr-2 h-5 w-5 text-amber-400" />
              Occasion
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Casual', 'Work', 'Party', 'Date', 'Formal'].map(occasion => (
                <Button
                  key={occasion}
                  variant={selectedOccasion === occasion ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelectOccasion(occasion)}
                  className={selectedOccasion === occasion 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "border-white/20 text-white hover:bg-white/10"}
                >
                  {occasion === 'Party' && <Party className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Casual' && <TrousersIcon className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Formal' && <Sunset className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Work' && <Moon className="mr-1 h-3.5 w-3.5" />}
                  {occasion === 'Date' && <Umbrella className="mr-1 h-3.5 w-3.5" />}
                  {occasion}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <AddToCalendarButton
              outfit={outfit}
              variant="default"
              fullWidth={true}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              onSuccess={handleOutfitAddedToCalendar}
            />
            
            <Button 
              variant="outline" 
              className="w-full border-green-500/30 hover:bg-green-500/10 text-green-300"
              onClick={handleSaveToWardrobe}
            >
              Save to My Wardrobe
            </Button>
          </div>
        </div>
        
        <div id={`outfit-${outfit.id}`} className="md:col-span-2 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all duration-300">
          <OutfitSuggestion 
            outfit={outfit} 
            items={clothingItems}
            weather={currentWeather || undefined}
            activity={selectedOccasion?.toLowerCase()}
            onRefresh={handleRefreshOutfit}
            onLike={handleLikeOutfit}
            onDislike={handleDislikeOutfit}
            onMakeWarmer={handleMakeWarmer}
            onChangeTop={handleChangeTop}
          />
          
          {generatedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 mb-2">
              {generatedTags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-purple-500/10 border-purple-500/20 text-purple-200 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <Collapsible open={oliviaThoughtsExpanded} onOpenChange={setOliviaThoughtsExpanded} className="mt-4">
            <div className="p-4 bg-purple-900/30 border border-purple-500/20 rounded-lg shadow-md relative">
              <div className="absolute top-0 left-4 w-3 h-3 -mt-1.5 transform rotate-45 bg-purple-900/30 border-l border-t border-purple-500/20"></div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2 border border-purple-400/30">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                  </Avatar>
                  <h4 className="text-sm font-medium text-purple-300">Olivia's Thoughts</h4>
                </div>
                
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10">
                    {oliviaThoughtsExpanded ? '-' : '+'}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <p className="text-sm text-white/80 pl-8">
                  {selectedOccasion ? 
                    `This outfit is perfect for a ${selectedOccasion.toLowerCase()} setting in ${currentWeather?.temperature ? `${currentWeather.temperature}°C weather` : 'current weather conditions'}. The colors complement each other and the style balances comfort with appropriate formality. ` 
                    : 
                    `I've selected this outfit based on your style preferences and the current weather. The combination offers versatility while ensuring comfort throughout the day.`
                  }
                  {currentWeather?.condition?.toLowerCase().includes('rain') && ` I've included weather-appropriate items to keep you dry in the rain.`}
                  {currentWeather?.temperature && currentWeather.temperature < 10 && ` The layering will help you stay warm in these cooler temperatures.`}
                </p>
                
                <div className="mt-3 pl-8 pt-3 border-t border-purple-500/20">
                  <h5 className="text-xs font-medium text-purple-300 mb-1">Why This Works:</h5>
                  <ul className="text-xs text-white/80 list-disc pl-4 space-y-1">
                    <li>The color palette is cohesive and flattering for your complexion</li>
                    <li>These pieces can easily transition between different settings</li>
                    <li>The silhouette is on-trend but has timeless appeal</li>
                    {currentWeather?.temperature && currentWeather.temperature < 15 ? 
                      <li>Layering pieces allow you to adjust to temperature changes</li> :
                      <li>Breathable fabrics will keep you comfortable all day</li>
                    }
                  </ul>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLikeOutfit}
              disabled={isSubmittingFeedback}
              className="border-green-500/30 hover:bg-green-500/10 text-green-300"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              I Like This
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDislikeOutfit}
              disabled={isSubmittingFeedback}
              className="border-red-500/30 hover:bg-red-500/10 text-red-300"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Not For Me
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMakeWarmer}
              className="border-amber-500/30 hover:bg-amber-500/10 text-amber-300"
            >
              <Thermometer className="h-4 w-4 mr-2" />
              Make It Warmer
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleChangeTop}
              className="border-blue-500/30 hover:bg-blue-500/10 text-blue-300"
            >
              <Edit className="h-4 w-4 mr-2" />
              Change Top
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default RecommendedOutfit;
