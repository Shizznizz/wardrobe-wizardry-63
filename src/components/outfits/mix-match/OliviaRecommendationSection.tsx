
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Import our existing recommendation component
import OliviaRecommendation from '@/components/outfits/OliviaRecommendation';

interface OliviaRecommendationSectionProps {
  weather: WeatherInfo | null;
  situation?: string | null;
}

const OliviaRecommendationSection = ({ weather, situation }: OliviaRecommendationSectionProps) => {
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
      
      <div className={cn(
        "grid grid-cols-1 gap-8 p-4 rounded-lg",
        "bg-gradient-to-r from-slate-900/70 to-slate-800/60 backdrop-blur-md border border-white/10"
      )}>
        {weather && (
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-amber-300" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-2">Olivia's Thoughts</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Today's {weather.temperature ? `${weather.temperature}°C` : ''} 
                {weather.condition ? ` ${weather.condition}` : ''} weather 
                {situation ? ` and your ${situation} activities` : ''} call for an outfit that balances 
                {weather.temperature && weather.temperature > 25 ? ' comfort and breathability' : 
                 weather.temperature && weather.temperature < 10 ? ' warmth and protection' : 
                 ' style and functionality'}. 
                I've selected pieces that will keep you 
                {weather.temperature && weather.temperature > 25 ? ' cool and fresh' : 
                 weather.temperature && weather.temperature < 10 ? ' warm and cozy' : 
                 ' comfortable and stylish'} 
                throughout the day.
              </p>
            </div>
          </div>
        )}
        
        <OliviaRecommendation 
          weather={weather || undefined} 
          situation={situation || undefined}
        />
      </div>
    </div>
  );
};

export default OliviaRecommendationSection;
