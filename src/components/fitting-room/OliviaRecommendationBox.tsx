
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { WeatherInfo, Outfit } from '@/lib/types';
import { Sun, Cloud, CloudRain, Thermometer } from 'lucide-react';

interface OliviaRecommendationBoxProps {
  weather?: WeatherInfo;
  selectedOutfit?: Outfit | null;
}

const OliviaRecommendationBox = ({ weather, selectedOutfit }: OliviaRecommendationBoxProps) => {
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (weather) {
      const suggestions = [
        `Given the ${weather.condition.toLowerCase()} weather at ${weather.temperature}°C, I recommend something that combines style and comfort.`,
        `For today's ${weather.condition.toLowerCase()} conditions, let's try an outfit that suits the temperature perfectly.`,
        `I've picked something special that works well for ${weather.condition.toLowerCase()} weather.`
      ];
      setSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    }
  }, [weather]);

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-900/40 to-slate-900/40 border-purple-500/20">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 border-2 border-purple-500/20">
          <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
          <AvatarFallback>OB</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Olivia Suggests
          </h3>
          
          <div className="relative">
            <div className="absolute -left-5 top-2 w-3 h-3 bg-purple-900/40 rotate-45 border-l border-t border-purple-500/20"></div>
            <p className="text-sm text-white/90 bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
              {suggestion}
              {weather && (
                <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                  {weather.condition.toLowerCase().includes('sun') && <Sun className="w-3 h-3" />}
                  {weather.condition.toLowerCase().includes('cloud') && <Cloud className="w-3 h-3" />}
                  {weather.condition.toLowerCase().includes('rain') && <CloudRain className="w-3 h-3" />}
                  <Thermometer className="w-3 h-3" />
                  <span>{weather.temperature}°C</span>
                </div>
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OliviaRecommendationBox;
