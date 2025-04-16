
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Star, Lightbulb, SquareArrowOutUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Outfit } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StyleOfTheDayProps {
  outfit?: Outfit | null;
  onPreview: (outfit: Outfit) => void;
}

const StyleOfTheDay = ({ outfit, onPreview }: StyleOfTheDayProps) => {
  // If no outfit is provided, use a placeholder
  const defaultOutfit: Outfit = {
    id: 'style-of-the-day',
    name: 'Summer Breeze',
    items: [],
    season: ['summer'],
    occasion: 'casual',
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date(),
  };
  
  const styleOutfit = outfit || defaultOutfit;
  const safeSeasons = Array.isArray(styleOutfit.season) ? styleOutfit.season : [];
  const safeOccasions = styleOutfit.occasion ? [styleOutfit.occasion] : [];
  
  const handlePreviewClick = () => {
    onPreview(styleOutfit);
  };
  
  const styleTips = [
    "Pair with gold accessories for extra flair",
    "Try adding a light scarf for evening transitions",
    "Works perfectly with both sneakers and sandals",
    "Add a pop of color with a bright bag",
    "Layer with a denim jacket for cooler evenings"
  ];
  
  const randomTip = styleTips[Math.floor(Math.random() * styleTips.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-blue-200 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
          Style of the Day
        </h2>
        <Badge 
          variant="outline" 
          className="bg-white/5 border-white/20 px-2 py-1 flex items-center gap-1"
        >
          <TrendingUp className="h-3.5 w-3.5 text-pink-400" />
          <span className="text-white/80">Trending</span>
        </Badge>
      </div>
      
      <Card className={cn(
        "overflow-hidden border-0 shadow-xl",
        "bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-pink-900/20"
      )}>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0">
            <div className="relative col-span-1 lg:col-span-5 aspect-[3/4] md:aspect-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 z-0"></div>
              <img 
                src="/lovable-uploads/413b249c-e4b5-48cd-a468-d23b2a23eca2.png" 
                alt={styleOutfit.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-purple-500/70 text-white border-none">
                  <Award className="h-3.5 w-3.5 mr-1.5" />
                  Olivia's Choice
                </Badge>
              </div>
            </div>
            
            <div className="col-span-1 lg:col-span-7 p-6 md:p-8 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">{styleOutfit.name}</h3>
                <p className="text-white/70 mb-6">{"A perfectly curated outfit selected by Olivia for today's trends and weather."}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {safeSeasons.map(season => (
                    <Badge key={season} className="bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border-none">
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </Badge>
                  ))}
                  
                  {safeOccasions.map(occasion => (
                    <Badge key={occasion} variant="outline" className="bg-slate-900/50 border-white/20 text-white/90">
                      {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                    </Badge>
                  ))}
                </div>
                
                <div className="mb-6">
                  <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
                    <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/90 text-sm font-medium mb-1">Olivia's Tip</p>
                      <p className="text-white/70 text-sm">{randomTip}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handlePreviewClick}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
              >
                <SquareArrowOutUpRight className="h-4 w-4 mr-2" />
                Try This Outfit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StyleOfTheDay;
