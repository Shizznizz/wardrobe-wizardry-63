
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CloudSun, Wind, Droplet, Sparkles, ChevronLeft, ChevronRight, Eye, Save, ShoppingBag } from 'lucide-react';
import { WeatherInfo, ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

interface PersonalizedPicksSectionProps {
  weather: WeatherInfo | null;
  onTryOutfit: (outfit: any) => void;
  onSaveOutfit: () => void;
  onShopOutfit: () => void;
  isPremiumUser: boolean;
}

const PersonalizedPicksSection = ({
  weather,
  onTryOutfit,
  onSaveOutfit,
  onShopOutfit,
  isPremiumUser
}: PersonalizedPicksSectionProps) => {
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);

  const personalizedOutfits = [
    {
      id: 'outfit-1',
      name: 'Cozy Layered Look',
      description: 'Perfect for today\'s weather - comfortable yet put-together',
      tags: ['Casual Chic', 'Layered', 'Weather-Perfect'],
      image: '/lovable-uploads/f4be744c-31b5-4099-93e8-67f51af83dae.png',
      items: ['Pink Crop Top', 'High-Waisted Skirt', 'Light Cardigan'],
      reasoning: 'Based on the current temperature and your style preferences for comfortable elegance.'
    },
    {
      id: 'outfit-2',
      name: 'Effortless Elegance',
      description: 'Sophisticated look with minimal effort',
      tags: ['Elegant', 'Minimalist', 'Versatile'],
      image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png',
      items: ['Pink Blouse', 'White Trousers', 'Statement Accessories'],
      reasoning: 'This combination reflects your trendy eclectic style while staying weather-appropriate.'
    }
  ];

  const currentOutfit = personalizedOutfits[currentOutfitIndex];

  const nextOutfit = () => {
    setCurrentOutfitIndex((prev) => (prev + 1) % personalizedOutfits.length);
  };

  const prevOutfit = () => {
    setCurrentOutfitIndex((prev) => (prev - 1 + personalizedOutfits.length) % personalizedOutfits.length);
  };

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Personalized Picks</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            AI-curated outfits based on today's weather, your style profile, and current trends
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="font-medium text-white mb-4 flex items-center">
                  <CloudSun className="h-5 w-5 text-blue-400 mr-2" />
                  Today's Weather
                </h3>
                {weather && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-3xl font-bold text-white">
                          {weather.temperature}°C
                        </div>
                        <Badge variant="outline" className="bg-white/10 border-white/20">
                          {weather.condition}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm text-white/70">
                        <div className="flex items-center">
                          <Wind className="h-4 w-4 mr-2 text-blue-400" />
                          Wind: {weather.windSpeed || "Light"} km/h
                        </div>
                        <div className="flex items-center">
                          <Droplet className="h-4 w-4 mr-2 text-blue-400" />
                          Humidity: {weather.humidity || "60"}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Outfit Card */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30 backdrop-blur-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" />
                      <AvatarFallback>OB</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white">Olivia's Pick for You</h3>
                      <p className="text-white/60 text-sm">Perfect for today's vibe</p>
                    </div>
                  </div>
                  
                  {personalizedOutfits.length > 1 && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={prevOutfit}
                        className="text-white/70 hover:text-white h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-white/60 text-sm">
                        {currentOutfitIndex + 1} of {personalizedOutfits.length}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={nextOutfit}
                        className="text-white/70 hover:text-white h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10">
                    <img 
                      src={currentOutfit.image}
                      alt={currentOutfit.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">{currentOutfit.name}</h4>
                      <p className="text-white/80 text-sm mb-3">{currentOutfit.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentOutfit.tags.map((tag, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="bg-purple-500/20 border-purple-500/30 text-purple-200 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-start">
                        <Sparkles className="h-4 w-4 text-purple-400 mt-1 mr-2 flex-shrink-0" />
                        <p className="text-white/80 text-sm">{currentOutfit.reasoning}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                        onClick={() => onTryOutfit(currentOutfit)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Try It On
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline"
                          className="border-white/20 hover:bg-white/10 text-white"
                          onClick={onSaveOutfit}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="border-white/20 hover:bg-white/10 text-white"
                          onClick={onShopOutfit}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Shop All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default PersonalizedPicksSection;
