
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import our existing recommendation component
import OliviaRecommendation from '@/components/outfits/OliviaRecommendation';

interface OliviaRecommendationSectionProps {
  weather: WeatherInfo | null;
  situation?: string | null;
}

const OliviaRecommendationSection = ({ weather, situation }: OliviaRecommendationSectionProps) => {
  const [isThoughtsOpen, setIsThoughtsOpen] = useState(true);
  
  // Format the situation text for display
  const formattedSituation = situation 
    ? situation.charAt(0).toUpperCase() + situation.slice(1) 
    : 'casual';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Daily Outfit from Olivia
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-purple-400/30 px-3 py-1.5"
              >
                Style Recommendation
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900/95 border-purple-500/20 text-white">
              <p>Picked for you based on today's weather {weather?.city ? `in ${weather.city}` : 'in your area'} and your preferences.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Card className={cn(
        "border border-white/20 shadow-lg",
        "bg-gradient-to-r from-slate-900/80 to-slate-800/70 backdrop-blur-md overflow-hidden"
      )}>
        <CardContent className="p-0">
          <div className="p-5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center mb-1">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              Perfect for {formattedSituation}
            </h3>
          </div>
          
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Collapsible
                open={isThoughtsOpen}
                onOpenChange={setIsThoughtsOpen}
              >
                <div className="flex items-center justify-between p-4 bg-slate-800/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-amber-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Olivia's Thoughts</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            {isThoughtsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <div className="p-4 pt-0 bg-slate-800/50">
                    <div className="pl-11">
                      <p className="text-white/80 text-sm leading-relaxed mt-2">
                        Today's {weather?.temperature ? `${weather.temperature}°C` : ''} 
                        {weather?.condition ? ` ${weather.condition}` : ''} weather 
                        {situation ? ` and your ${situation} activities` : ''} call for an outfit that balances 
                        {weather?.temperature && weather.temperature > 25 ? ' comfort and breathability' : 
                        weather?.temperature && weather.temperature < 10 ? ' warmth and protection' : 
                        ' style and functionality'}. 
                        I've selected pieces that will keep you 
                        {weather?.temperature && weather.temperature > 25 ? ' cool and fresh' : 
                        weather?.temperature && weather.temperature < 10 ? ' warm and cozy' : 
                        ' comfortable and stylish'} 
                        throughout the day.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <div className="px-5 pt-3 pb-5">
                <OliviaRecommendation 
                  weather={weather || undefined} 
                  situation={situation || undefined}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default OliviaRecommendationSection;
