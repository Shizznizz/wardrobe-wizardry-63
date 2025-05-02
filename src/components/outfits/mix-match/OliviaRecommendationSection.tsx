
import React from 'react';
import { motion } from 'framer-motion';
import { WeatherInfo } from '@/lib/types';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import DailyOutfitSection from './DailyOutfitSection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Thermometer, Edit, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OliviaRecommendationSectionProps {
  weather: WeatherInfo | null;
  situation: string | null;
}

const OliviaRecommendationSection = ({ weather, situation }: OliviaRecommendationSectionProps) => {
  // Find an outfit that matches the situation
  const getSituationOutfit = () => {
    if (!situation) return sampleOutfits[0];
    
    const matchingOutfits = sampleOutfits.filter(outfit => 
      outfit.tags?.some(tag => tag.toLowerCase().includes(situation.toLowerCase()))
    );
    
    return matchingOutfits.length > 0 ? matchingOutfits[0] : sampleOutfits[0];
  };

  const recommendedOutfit = getSituationOutfit();
  
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
  
  const handleSaveToWardrobe = () => {
    toast.success("Outfit saved to your wardrobe!");
  };
  
  const handleAddToCalendar = () => {
    toast.success("Outfit added to your calendar!");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <DailyOutfitSection 
        weather={weather || undefined} 
        currentOutfit={recommendedOutfit}
        clothingItems={sampleClothingItems}
        situation={situation || undefined}
      />
      
      {/* Olivia's Thoughts Section - Based on the image */}
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
            <p className="text-white/90 mb-6">
              This outfit is perfect for {situation || 'casual'} in {weather?.temperature || '16'}°C weather. 
              The colors complement each other and the style balances comfort with appropriate formality.
            </p>
            
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
                  <span>Breathable fabrics will keep you comfortable all day</span>
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
            onClick={handleSaveToWardrobe}
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
    </motion.div>
  );
};

export default OliviaRecommendationSection;
