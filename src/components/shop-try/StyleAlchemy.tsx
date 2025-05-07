
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Cloud, CloudDrizzle, CloudFog, CloudRain, CloudSnow, Sparkles, Sun, SunDim } from 'lucide-react';
import { toast } from 'sonner';

interface StyleAlchemyProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  customLocation: { city: string; country: string } | null;
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
  // Mock weather data - would come from Supabase or API in a real implementation
  const weatherData = {
    location: customLocation?.city || 'New York',
    country: customLocation?.country || 'USA',
    temperature: '68°F',
    condition: 'Partly Cloudy',
    humidity: '45%',
    wind: '8 mph'
  };
  
  const getWeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="h-8 w-8" />;
    if (condition.includes('cloud') && condition.includes('part')) return <SunDim className="h-8 w-8" />;
    if (condition.includes('cloud')) return <Cloud className="h-8 w-8" />;
    if (condition.includes('rain') && condition.includes('light')) return <CloudDrizzle className="h-8 w-8" />;
    if (condition.includes('rain')) return <CloudRain className="h-8 w-8" />;
    if (condition.includes('fog') || condition.includes('mist')) return <CloudFog className="h-8 w-8" />;
    if (condition.includes('snow')) return <CloudSnow className="h-8 w-8" />;
    return <Sun className="h-8 w-8" />;
  };
  
  // Mock outfit recommendation
  const outfitRecommendation = {
    id: 'weather-outfit-1',
    name: 'Spring Casual Chic',
    imageUrl: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png'
  };

  return (
    <section className="py-16 relative" id="style-alchemy">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-slate-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Style Alchemy</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Weather-based style recommendations personalized just for you
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Weather Card */}
          <motion.div 
            className="md:col-span-4 bg-gradient-to-br from-purple-900/30 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Today's Weather</h3>
              <div className="text-purple-300">
                {getWeatherIcon()}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold">{weatherData.temperature}</div>
              <div className="text-white/70">{weatherData.condition}</div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-white/80">{weatherData.location}, {weatherData.country}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60">Humidity</div>
                <div className="text-lg font-medium">{weatherData.humidity}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60">Wind</div>
                <div className="text-lg font-medium">{weatherData.wind}</div>
              </div>
            </div>
          </motion.div>
          
          {/* Style Note and Perfect Match */}
          <motion.div 
            className="md:col-span-8 bg-gradient-to-br from-purple-900/20 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mr-3 shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Olivia's Style Note</h3>
                <p className="text-white/80">
                  For today's {weatherData.condition.toLowerCase()} weather at {weatherData.temperature}, I recommend a versatile 
                  layered look that keeps you comfortable throughout the day. This outfit balances style with practicality!
                </p>
              </div>
            </div>
            
            <div className="flex flex-grow flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <div className="aspect-square rounded-xl overflow-hidden border border-purple-400/20 shadow-lg shadow-purple-500/10">
                  <img 
                    src={outfitRecommendation.imageUrl} 
                    alt={outfitRecommendation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-1">Perfect Match</h4>
                  <p className="text-white/70">This {outfitRecommendation.name} outfit is ideal for today's forecast.</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-900/50 text-purple-200 rounded-full px-3 py-1 text-sm">Spring</span>
                  <span className="bg-purple-900/50 text-purple-200 rounded-full px-3 py-1 text-sm">Casual Chic</span>
                  <span className="bg-purple-900/50 text-purple-200 rounded-full px-3 py-1 text-sm">Versatile</span>
                </div>
                
                <Button 
                  onClick={onCombineWithWardrobe} 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Combine this with my wardrobe
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
