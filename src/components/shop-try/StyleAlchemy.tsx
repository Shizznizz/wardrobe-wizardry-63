
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, Thermometer, Eye, Shirt } from 'lucide-react';
import WeatherWidget from '@/components/WeatherWidget';
import OptimizedImage from '@/components/ui/optimized-image';
import { WeatherInfo } from '@/lib/types';

interface StyleAlchemyProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  customLocation?: { city: string; country: string } | null;
  onShowStyleOptions: () => void;
  isPremiumUser: boolean;
  onCombineWithWardrobe: () => void;
}

const StyleAlchemy = ({ 
  userPhoto, 
  isUsingOliviaImage, 
  customLocation, 
  onShowStyleOptions, 
  isPremiumUser,
  onCombineWithWardrobe 
}: StyleAlchemyProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleWeatherChange = (weather: WeatherInfo) => {
    // Handle weather data if needed - for now we just receive it
    console.log('Weather updated:', weather);
  };

  return (
    <section className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-purple-950/20 to-slate-950/30 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Personalized Look Today</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Start with the perfect foundation based on your location and style preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Weather Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">
                    {customLocation ? `${customLocation.city}, ${customLocation.country}` : 'Your Location'}
                  </span>
                </div>
                <span className="text-white/60 text-sm">{formatTime(currentTime)}</span>
              </div>
              
              <WeatherWidget 
                className="bg-transparent border-none p-0"
                city={customLocation?.city}
                country={customLocation?.country}
                showToasts={false}
                onWeatherChange={handleWeatherChange}
              />
            </div>
          </motion.div>

          {/* Olivia's AI Style Note */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/30 flex-shrink-0">
                    <OptimizedImage 
                      src="/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png" 
                      alt="Olivia AI Assistant" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">Olivia's Style Note</h3>
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 border-none text-xs">
                        AI Powered
                      </Badge>
                    </div>
                    <div className="space-y-3 text-white/80">
                      <p className="text-sm leading-relaxed">
                        Perfect weather for layering! I suggest starting with a lightweight base and adding a 
                        structured piece for dimension. 
                      </p>
                      <div className="flex items-center gap-2 text-xs text-purple-300">
                        <Eye className="h-3 w-3" />
                        <span>Based on your style preferences and current weather</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={onCombineWithWardrobe}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white border-none"
                  size="sm"
                >
                  <Shirt className="h-4 w-4 mr-2" />
                  Combine with my wardrobe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default StyleAlchemy;
