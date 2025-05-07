
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CloudSun, Wind, Droplet, Thermometer, RefreshCw, Sparkles, Check, Save } from 'lucide-react';
import { toast } from 'sonner';
import OliviaDailyRecommendation from './OliviaDailyRecommendation';
import WeatherBasedTips from './WeatherBasedTips';
import { supabase } from '@/integrations/supabase/client';
import { WeatherInfo, ClothingItem } from '@/lib/types';
import { fetchWeatherData } from '@/services/WeatherService';

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
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [compatibleItems, setCompatibleItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [recommendedOutfit, setRecommendedOutfit] = useState<ClothingItem | null>(null);
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  
  // Fetch weather data based on user's location
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!customLocation) {
          // If no custom location is provided, try to get user preferences from Supabase
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { data: preferences } = await supabase
              .from('user_preferences')
              .select('preferred_city, preferred_country')
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (preferences?.preferred_city && preferences?.preferred_country) {
              const weatherData = await fetchWeatherData(
                preferences.preferred_city,
                preferences.preferred_country
              );
              setWeather(weatherData);
              
              // Set temperature unit based on country 
              // US uses Fahrenheit, most other countries use Celsius
              setUseFahrenheit(preferences.preferred_country === 'US');
            } else {
              // Use browser's geolocation as fallback
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  // This is just a mock implementation
                  // In a real app, you would reverse geocode the coordinates
                  const mockCity = "New York";
                  const mockCountry = "US";
                  const weatherData = await fetchWeatherData(mockCity, mockCountry);
                  setWeather(weatherData);
                  setUseFahrenheit(true);
                },
                () => {
                  // Default fallback if geolocation fails
                  const defaultWeather = {
                    temperature: 22,
                    feelsLike: 23,
                    condition: 'Sunny',
                    icon: 'sun',
                    city: 'Default City',
                    country: 'Default Country',
                    humidity: 65,
                    windSpeed: 12
                  };
                  setWeather(defaultWeather);
                  setUseFahrenheit(false);
                }
              );
            }
          } else {
            // Not logged in, use custom location or default
            if (customLocation) {
              const weatherData = await fetchWeatherData(
                customLocation.city,
                customLocation.country
              );
              setWeather(weatherData);
              setUseFahrenheit(customLocation.country === 'US');
            } else {
              // Final fallback
              const defaultWeather = {
                temperature: 22,
                feelsLike: 23,
                condition: 'Sunny',
                icon: 'sun',
                city: 'New York',
                country: 'US',
                humidity: 65,
                windSpeed: 12
              };
              setWeather(defaultWeather);
              setUseFahrenheit(true);
            }
          }
        } else {
          // Use provided custom location
          const weatherData = await fetchWeatherData(
            customLocation.city,
            customLocation.country
          );
          setWeather(weatherData);
          setUseFahrenheit(customLocation.country === 'US');
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Could not load weather data');
        toast.error('Unable to fetch weather data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [customLocation]);
  
  // Generate a recommended outfit based on weather
  useEffect(() => {
    if (weather) {
      // In a real app, this would fetch from a recommendation engine
      const mockRecommendedItem: ClothingItem = {
        id: 'weather-rec-1',
        name: weather.temperature < 15 ? 'Cozy Oversized Sweater' : 'Lightweight Cotton Blouse',
        type: 'top',
        color: weather.temperature < 15 ? 'cream' : 'light blue',
        season: weather.temperature < 15 ? ['autumn', 'winter'] : ['spring', 'summer'],
        image: '',
        imageUrl: weather.temperature < 15 
          ? '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png'
          : '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png',
        price: weather.temperature < 15 ? 89.99 : 39.99,
        tags: weather.temperature < 15 
          ? ['Cozy', 'Versatile', 'Layering piece'] 
          : ['Light', 'Breathable', 'Office-casual']
      };
      
      setRecommendedOutfit(mockRecommendedItem);
    }
  }, [weather]);
  
  // Simulate fetching compatible items from user's wardrobe
  const fetchCompatibleItems = async () => {
    try {
      // In a real app, this would fetch from Supabase based on user ID
      const mockCompatibleItems: ClothingItem[] = [
        {
          id: 'wardrobe-1',
          name: 'High-Waisted Blue Jeans',
          type: 'pants',
          color: 'blue',
          season: ['all'],
          image: '',
          imageUrl: '/lovable-uploads/7bf89910-ba2c-43e0-a523-899d90c3022e.png',
          price: 59.99,
          tags: ['Versatile', 'Everyday', 'Casual']
        },
        {
          id: 'wardrobe-2',
          name: 'White Sneakers',
          type: 'shoes',
          color: 'white',
          season: ['spring', 'summer', 'autumn'],
          image: '',
          imageUrl: '/lovable-uploads/5e3e82e2-f35c-4198-88ce-8caeaf4de5fd.png', // This is a placeholder, replace with actual image
          price: 79.99,
          tags: ['Casual', 'Comfortable', 'Minimalist']
        },
        {
          id: 'wardrobe-3',
          name: 'Gold Hoop Earrings',
          type: 'accessory',
          color: 'gold',
          season: ['all'],
          image: '',
          imageUrl: '/lovable-uploads/a6a88af4-70c8-4361-9dc3-5bd921018bae.png', // This is a placeholder, replace with actual image
          price: 29.99,
          tags: ['Classic', 'Elegant', 'Everyday']
        }
      ];
      
      setCompatibleItems(mockCompatibleItems);
      
    } catch (error) {
      console.error('Error fetching compatible items:', error);
      toast.error('Could not load your wardrobe items');
    }
  };
  
  const handleOpenWardrobeModal = () => {
    if (!isPremiumUser) {
      onCombineWithWardrobe();
      return;
    }
    
    fetchCompatibleItems();
    setShowWardrobeModal(true);
  };
  
  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const handleSaveOutfit = async () => {
    try {
      // In a real app, save to Supabase here
      
      toast.success('Outfit saved to your wardrobe!');
      setShowWardrobeModal(false);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast.error('Could not save your outfit');
    }
  };
  
  const handleRefreshWeather = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (customLocation) {
        const freshWeather = await fetchWeatherData(customLocation.city, customLocation.country);
        setWeather(freshWeather);
        toast.success('Weather updated!');
      } else {
        toast.error('Please set your location first');
      }
    } catch (error) {
      console.error('Error refreshing weather:', error);
      toast.error('Could not update weather data');
    } finally {
      setLoading(false);
    }
  };
  
  const formatTemperature = (tempInC: number): string => {
    if (useFahrenheit) {
      // Convert Celsius to Fahrenheit
      const tempInF = Math.round((tempInC * 9/5) + 32);
      return `${tempInF}°F`;
    }
    return `${Math.round(tempInC)}°C`;
  };

  // Skip this section if no user photo is uploaded yet
  if (!userPhoto) return null;

  return (
    <section className="py-16 relative">
      <Container>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Style Alchemy</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Smart recommendations based on today's weather and your style
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Weather Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden mb-4 h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white flex items-center">
                    <CloudSun className="h-5 w-5 text-blue-400 mr-2" />
                    Today's Weather
                  </h3>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                    onClick={handleRefreshWeather}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3 text-center">
                    <p className="text-red-300 text-sm">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshWeather}
                      className="mt-2 text-xs border-red-400/30 text-red-300"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Try Again
                    </Button>
                  </div>
                ) : weather && (
                  <>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-white">
                          {formatTemperature(weather.temperature)}
                        </div>
                        <Badge variant="outline" className="bg-white/10 border-white/20">
                          {weather.condition}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-white/70 mb-1">
                        Feels like {formatTemperature(weather.feelsLike || weather.temperature - 1)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
                        <div className="flex items-center">
                          <Wind className="h-4 w-4 mr-1.5 text-blue-400" />
                          Wind: {weather.windSpeed || "Light"} km/h
                        </div>
                        <div className="flex items-center">
                          <Droplet className="h-4 w-4 mr-1.5 text-blue-400" />
                          Humidity: {weather.humidity || "60"}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-white/60 mb-2">
                      <Thermometer className="h-4 w-4 mr-1.5 text-purple-400" />
                      <span>
                        {weather.city}, {weather.country}
                      </span>
                    </div>
                    
                    {/* Weather-based tips */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg p-3">
                      <p className="text-sm text-white/80">
                        {weather.temperature < 10
                          ? "It's cold outside! Time for layering with warm, cozy pieces."
                          : weather.temperature < 20
                          ? "Cool weather today. Consider light layers that you can adjust as needed."
                          : "Warm weather ahead! Opt for breathable fabrics and lighter colors."}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Olivia's Style Card */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-purple-900/30 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-white">Olivia's Style Note</h3>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-purple-400 animate-spin"></div>
                  </div>
                ) : recommendedOutfit ? (
                  <div className="space-y-4">
                    <p className="text-white/90 text-sm leading-relaxed">
                      {weather && `"For today's ${weather.condition.toLowerCase()} weather at ${formatTemperature(weather.temperature)}, I've picked out the perfect outfit that combines style and comfort! This ${recommendedOutfit.name.toLowerCase()} is an ideal choice that will keep you looking fabulous while staying comfortable in these conditions."`}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                        <img 
                          src={recommendedOutfit.imageUrl}
                          alt={recommendedOutfit.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <Badge variant="outline" className="bg-purple-500/30 border-purple-400/30 text-white mb-1">
                            Perfect Match
                          </Badge>
                          <h4 className="text-white font-medium">
                            {recommendedOutfit.name}
                          </h4>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="text-lg font-semibold text-white mb-2">${recommendedOutfit.price}</div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {recommendedOutfit.tags?.map((tag, index) => (
                              <Badge 
                                key={index}
                                variant="outline" 
                                className="bg-purple-500/20 border-purple-500/30 text-purple-200"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className="text-white/70 text-sm">
                            This piece is perfect for today's weather! I've selected it based on the temperature and conditions to keep you comfortable while looking stylish.
                          </p>
                        </div>
                        
                        <Button
                          className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 w-full group"
                          onClick={handleOpenWardrobeModal}
                        >
                          <Sparkles className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                          Combine with my wardrobe
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-white/70">No recommendations available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Wardrobe Modal */}
        <Dialog open={showWardrobeModal} onOpenChange={setShowWardrobeModal}>
          <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-gradient-primary">
                Create Your Complete Look
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Recommended Item */}
              <div className="md:col-span-1">
                <h4 className="text-sm font-medium text-white/70 mb-2">Olivia's Recommendation</h4>
                {recommendedOutfit && (
                  <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <div className="aspect-square relative">
                      <img 
                        src={recommendedOutfit.imageUrl}
                        alt={recommendedOutfit.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-white">{recommendedOutfit.name}</h5>
                      <p className="text-white/60 text-xs">${recommendedOutfit.price}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Compatible Items */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white/70">Compatible Items from Your Wardrobe</h4>
                  <span className="text-xs text-white/50">{selectedItems.length} selected</span>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                  {compatibleItems.map(item => (
                    <div 
                      key={item.id}
                      className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-center gap-3"
                    >
                      <Checkbox 
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleToggleItem(item.id)}
                        className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      
                      <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <label 
                          htmlFor={`item-${item.id}`}
                          className="font-medium text-white cursor-pointer"
                        >
                          {item.name}
                        </label>
                        <div className="text-xs text-white/60 flex flex-wrap gap-1 mt-1">
                          {item.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-white/10 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                  onClick={handleSaveOutfit}
                  disabled={selectedItems.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Complete Outfit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Container>
    </section>
  );
};

export default StyleAlchemy;
