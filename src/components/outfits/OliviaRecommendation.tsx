
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Thermometer, Edit, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';

interface OliviaRecommendationProps {
  weather?: WeatherInfo;
  situation?: string;
}

const OliviaRecommendation = ({ weather, situation }: OliviaRecommendationProps) => {
  const [oliviaThoughtsExpanded, setOliviaThoughtsExpanded] = useState(true);
  const [outfit, setOutfit] = useState<Outfit | null>(sampleOutfits[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Sample tags for the outfit
  const generatedTags = ["Spring", "Casual", "Work", "Versatile"];
  
  const handleLike = () => {
    toast.success("You liked this outfit! We'll remember your preference.", {
      description: "Your feedback helps Olivia make better recommendations"
    });
  };
  
  const handleDislike = () => {
    toast.success("Thanks for your feedback!", {
      description: "Olivia will suggest something different next time"
    });
    
    handleRefresh();
  };
  
  const handleMakeWarmer = () => {
    toast.success("Making your outfit warmer...");
    handleRefresh();
  };
  
  const handleChangeTop = () => {
    toast.success("Finding alternative top options...");
    handleRefresh();
  };
  
  const handleSaveToWardrobe = () => {
    toast.success("Outfit saved to your wardrobe!", {
      description: "You can access it anytime from your collection"
    });
  };
  
  const handleAddToCalendar = () => {
    toast.success("Outfit added to your calendar!", {
      description: "It's scheduled for tomorrow"
    });
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate getting a new outfit recommendation
      const randomIndex = Math.floor(Math.random() * sampleOutfits.length);
      setOutfit(sampleOutfits[randomIndex]);
      setIsRefreshing(false);
    }, 800);
  };
  
  if (!outfit) {
    return (
      <div className="bg-slate-900/70 border border-white/10 rounded-xl p-6 text-center">
        <Avatar className="mx-auto h-12 w-12 mb-4">
          <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-medium text-white mb-2">No recommendation yet</h3>
        <p className="text-white/70 mb-4">
          Olivia doesn't have a recommendation right now – tell her your mood or the event and she'll pick one for you.
        </p>
        <Button onClick={() => setOutfit(sampleOutfits[0])} className="bg-gradient-to-r from-purple-600 to-pink-600">
          Get a recommendation
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/70 border border-white/10 rounded-xl overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          {situation ? `Perfect for ${situation}` : "Olivia's Recommendation"}
        </h3>
        
        <OutfitSuggestion 
          outfit={outfit} 
          items={sampleClothingItems}
          weather={weather}
          activity={situation?.toLowerCase()}
        />
        
        {generatedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
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
                {situation ? 
                  `This outfit is perfect for ${situation} in ${weather?.temperature ? `${weather.temperature}°C weather` : 'current weather conditions'}. The colors complement each other and the style balances comfort with appropriate formality.` 
                  : 
                  `I've selected this outfit based on your style preferences and the current weather. The combination offers versatility while ensuring comfort throughout the day.`
                }
                {weather?.condition?.toLowerCase().includes('rain') && ` I've included weather-appropriate items to keep you dry in the rain.`}
                {weather?.temperature && weather.temperature < 10 && ` The layering will help you stay warm in these cooler temperatures.`}
              </p>
              
              <div className="mt-3 pl-8 pt-3 border-t border-purple-500/20">
                <h5 className="text-xs font-medium text-purple-300 mb-1">Why This Works:</h5>
                <ul className="text-xs text-white/80 list-disc pl-4 space-y-1">
                  <li>The color palette is cohesive and flattering</li>
                  <li>These pieces can easily transition between different settings</li>
                  <li>The silhouette is on-trend but has timeless appeal</li>
                  {weather?.temperature && weather.temperature < 15 ? 
                    <li>Layering pieces allow you to adjust to temperature changes</li> :
                    <li>Breathable fabrics will keep you comfortable all day</li>
                  }
                </ul>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
      
      <div className="border-t border-white/10 bg-slate-800/50 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLike}
            className="border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">I Like This</span>
            <span className="sm:hidden">Like</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDislike}
            className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Not For Me</span>
            <span className="sm:hidden">Dislike</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMakeWarmer}
            className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
          >
            <Thermometer className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Make Warmer</span>
            <span className="sm:hidden">Warmer</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleChangeTop}
            className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
          >
            <Edit className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Change Top</span>
            <span className="sm:hidden">Top</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveToWardrobe}
            className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          >
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Save to Wardrobe</span>
            <span className="sm:hidden">Save</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddToCalendar}
            className="border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add to Calendar</span>
            <span className="sm:hidden">Calendar</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OliviaRecommendation;
