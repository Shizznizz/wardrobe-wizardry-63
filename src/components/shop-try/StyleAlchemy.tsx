import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Cloud, CloudDrizzle, CloudFog, CloudRain, CloudSnow, Sparkles, Sun, SunDim, Wind, Droplet } from 'lucide-react';
import { toast } from 'sonner';
import { ClothingItem, WeatherInfo } from '@/lib/types';
import { fetchWeatherData as fetchWeatherAPI } from '@/services/WeatherService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [userWardrobe, setUserWardrobe] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ city: string; country: string } | null>(customLocation);
  
  // Outfit recommendation based on weather
  const [outfitRecommendation, setOutfitRecommendation] = useState({
    id: 'weather-outfit-1',
    name: 'Spring Casual Chic',
    imageUrl: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png',
    tags: ['Spring', 'Casual Chic', 'Versatile']
  });

  // Style note from Olivia based on weather
  const [styleNote, setStyleNote] = useState('');

  useEffect(() => {
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchWeatherInfo();
    }
  }, [userLocation]);

  const fetchUserLocation = async () => {
    if (customLocation) {
      setUserLocation(customLocation);
      return;
    }

    try {
      if (isAuthenticated && user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('preferred_city, preferred_country')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.preferred_city && data.preferred_country) {
          setUserLocation({
            city: data.preferred_city,
            country: data.preferred_country
          });
        } else {
          // Default location if user hasn't set one
          setUserLocation({
            city: 'New York',
            country: 'USA'
          });
        }
      } else {
        // Default location for non-authenticated users
        setUserLocation({
          city: 'New York',
          country: 'USA'
        });
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
      setUserLocation({
        city: 'New York',
        country: 'USA'
      });
    }
  };

  const fetchWeatherInfo = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      if (userLocation.city && userLocation.country) {
        const weather = await fetchWeatherAPI(userLocation.city, userLocation.country);
        setWeatherInfo(weather);
        
        // Generate outfit recommendation based on weather
        generateOutfitRecommendation(weather);
        
        // Generate style note based on weather
        generateStyleNote(weather);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Could not fetch weather data. Using default recommendations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefreshWeather = () => {
    setRefreshing(true);
    fetchWeatherInfo();
  };

  const generateOutfitRecommendation = (weather: WeatherInfo) => {
    // Simple logic to choose outfit based on weather
    let outfit = {
      id: 'weather-outfit-1',
      name: 'Spring Casual Chic',
      imageUrl: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png',
      tags: ['Spring', 'Casual Chic', 'Versatile']
    };
    
    const temp = weather.temperature || 20;
    const condition = weather.condition?.toLowerCase() || '';
    
    if (temp < 10) {
      outfit = {
        id: 'weather-outfit-cold',
        name: 'Cozy Winter Layers',
        imageUrl: '/lovable-uploads/f816da94-4177-47eb-bc82-48ae6be6e8f9.png',
        tags: ['Winter', 'Cozy', 'Layered']
      };
    } else if (temp >= 10 && temp < 20) {
      outfit = {
        id: 'weather-outfit-mild',
        name: 'Spring Casual Chic',
        imageUrl: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png',
        tags: ['Spring', 'Casual Chic', 'Versatile']
      };
    } else {
      outfit = {
        id: 'weather-outfit-warm',
        name: 'Summer Breeze Look',
        imageUrl: '/lovable-uploads/5e9a3938-d858-47e4-942e-e6f047b9e309.png', 
        tags: ['Summer', 'Light', 'Breezy']
      };
    }
    
    // Adjust for rain
    if (condition.includes('rain') || condition.includes('drizzle')) {
      outfit = {
        id: 'weather-outfit-rain',
        name: 'Rainy Day Chic',
        imageUrl: '/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png',
        tags: ['Rain-ready', 'Practical', 'Stylish']
      };
    }
    
    setOutfitRecommendation(outfit);
  };

  const generateStyleNote = (weather: WeatherInfo) => {
    const temp = weather.temperature || 20;
    const condition = weather.condition?.toLowerCase() || '';
    const city = weather.city || userLocation?.city || 'your city';
    
    let note = '';
    
    if (temp < 10) {
      note = `It's quite chilly at ${temp}°C in ${city} today with ${condition} conditions! I recommend layering up with a cozy sweater and adding a stylish jacket. This outfit will keep you warm while looking put-together for any occasion.`;
    } else if (temp >= 10 && temp < 20) {
      note = `A lovely mild day ahead in ${city} at ${temp}°C with ${condition} skies! This transitional weather is perfect for versatile layers - the outfit I've picked offers both style and comfort as the temperature shifts throughout your day.`;
    } else {
      note = `It's a beautiful warm day in ${city} at ${temp}°C with ${condition} conditions! This light, breezy outfit will keep you comfortable while looking effortlessly stylish. Perfect for staying cool while looking hot!`;
    }
    
    if (condition.includes('rain')) {
      note = `Looks like rain in ${city} today at ${temp}°C! Don't worry - I've selected a practical yet stylish outfit that will keep you dry without compromising on your fashion game. The umbrella is optional, but the compliments are guaranteed!`;
    }
    
    setStyleNote(note);
  };

  const getWeatherIcon = () => {
    if (!weatherInfo || !weatherInfo.condition) return <Sun className="h-8 w-8" />;
    
    const condition = weatherInfo.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="h-8 w-8" />;
    if (condition.includes('cloud') && condition.includes('part')) return <SunDim className="h-8 w-8" />;
    if (condition.includes('cloud')) return <Cloud className="h-8 w-8" />;
    if (condition.includes('rain') && condition.includes('light')) return <CloudDrizzle className="h-8 w-8" />;
    if (condition.includes('rain')) return <CloudRain className="h-8 w-8" />;
    if (condition.includes('fog') || condition.includes('mist')) return <CloudFog className="h-8 w-8" />;
    if (condition.includes('snow')) return <CloudSnow className="h-8 w-8" />;
    return <Sun className="h-8 w-8" />;
  };

  const handleOpenWardrobeModal = async () => {
    if (!isPremiumUser && !isAuthenticated) {
      toast.error('Please log in to access this feature', {
        description: 'Create an account or log in to combine with your wardrobe'
      });
      return;
    }
    
    await fetchUserWardrobe();
    setShowWardrobeModal(true);
  };

  const fetchUserWardrobe = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id)
        .limit(20);
      
      if (error) throw error;
      
      const items: ClothingItem[] = data?.map(item => {
        const itemData = item.item_data as ClothingItem;
        return {
          ...itemData,
          id: itemData.id || item.id
        };
      }) || [];
      
      setUserWardrobe(items);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
      toast.error('Could not fetch your wardrobe items');
    }
  };

  const handleSaveOutfit = async () => {
    if (!user) {
      toast.error('Please log in to save outfits');
      return;
    }
    
    if (selectedItems.length === 0) {
      toast.warning('Select at least one item from your wardrobe');
      return;
    }
    
    try {
      // Create a new outfit with the selected items
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          name: `${outfitRecommendation.name} with my wardrobe`,
          items: [...selectedItems, outfitRecommendation.id],
          user_id: user.id,
          tags: outfitRecommendation.tags,
          occasion: 'casual',
          favorite: true
        });
      
      if (error) throw error;
      
      toast.success('Outfit saved to your collection!');
      setShowWardrobeModal(false);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast.error('Could not save your outfit');
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Create temperature display based on location
  const formatTemperature = () => {
    if (!weatherInfo || weatherInfo.temperature === undefined) return '';
    
    // Use Fahrenheit for US, Celsius for everywhere else
    if (userLocation?.country === 'USA' || userLocation?.country === 'United States') {
      const tempF = Math.round((weatherInfo.temperature * 9/5) + 32);
      return `${tempF}°F`;
    } else {
      return `${Math.round(weatherInfo.temperature)}°C`;
    }
  };

  if (loading) {
    return (
      <section className="py-16 relative" id="style-alchemy">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-slate-950/30 to-slate-950/50 pointer-events-none"></div>
        <Container>
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          </div>
        </Container>
      </section>
    );
  }

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
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-purple-300 hover:text-white hover:bg-purple-800/50"
                  onClick={handleRefreshWeather}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh weather</span>
                </Button>
                <div className="text-purple-300">
                  {getWeatherIcon()}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold">{formatTemperature()}</div>
              <div className="text-white/70">{weatherInfo?.condition}</div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-white/80">
                {weatherInfo?.city || userLocation?.city}, {weatherInfo?.country || userLocation?.country}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60 flex items-center gap-1.5">
                  <Droplet className="h-4 w-4 text-blue-400" />
                  Humidity
                </div>
                <div className="text-lg font-medium">{weatherInfo?.humidity || 45}%</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60 flex items-center gap-1.5">
                  <Wind className="h-4 w-4 text-blue-400" />
                  Wind
                </div>
                <div className="text-lg font-medium">{weatherInfo?.windSpeed || 8} km/h</div>
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
              <Avatar className="h-10 w-10 rounded-full shrink-0 mr-3">
                <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                <AvatarFallback className="bg-gradient-to-tr from-purple-500 to-pink-500">OB</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold mb-2">Olivia's Style Note</h3>
                <p className="text-white/80">
                  {styleNote}
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
                  {outfitRecommendation.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      className="bg-purple-900/50 text-purple-200 border-purple-500/30 hover:bg-purple-800/60"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  onClick={handleOpenWardrobeModal} 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Combine this with my wardrobe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
      
      {/* Wardrobe Modal */}
      <Dialog open={showWardrobeModal} onOpenChange={setShowWardrobeModal}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900 to-purple-900/80 border border-white/10 text-white">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Combine with Your Wardrobe</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Olivia's Recommendation</h3>
                <div className="aspect-square rounded-lg overflow-hidden border border-purple-400/20">
                  <img 
                    src={outfitRecommendation.imageUrl}
                    alt={outfitRecommendation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-white/80 text-sm">{outfitRecommendation.name}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Your Compatible Items</h3>
                {userWardrobe.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {userWardrobe.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center bg-white/5 rounded-lg p-2 border border-white/10"
                      >
                        <Checkbox 
                          id={`item-${item.id}`}
                          className="mr-3 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleItemSelect(item.id)}
                        />
                        <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                          <img 
                            src={item.imageUrl || item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-white/60">{item.type}, {item.color}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/70 text-center">
                      No items found in your wardrobe
                    </p>
                    <Button 
                      variant="link" 
                      className="text-purple-400 hover:text-purple-300"
                      onClick={() => {
                        setShowWardrobeModal(false);
                        // Navigate to wardrobe page
                      }}
                    >
                      Add items to your wardrobe
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              onClick={handleSaveOutfit}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
              disabled={selectedItems.length === 0}
            >
              Save Complete Outfit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default StyleAlchemy;
