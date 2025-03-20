
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherInfo, Outfit } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { RefreshCw, Camera } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Outfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [suggestedOutfit, setSuggestedOutfit] = useState<Outfit>(sampleOutfits[0]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    // Set initial loading state
    setIsWeatherLoading(true);
  }, []);
  
  const handleWeatherChange = (weatherData: WeatherInfo) => {
    setWeather(weatherData);
    setIsWeatherLoading(false);
    console.log("Weather data received:", weatherData);
  };
  
  const handleWearOutfit = (outfitId: string) => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === outfitId 
          ? { 
              ...outfit, 
              timesWorn: outfit.timesWorn + 1,
              lastWorn: new Date()
            } 
          : outfit
      )
    );
  };
  
  const handleRegenerateOutfit = () => {
    const currentIndex = outfits.findIndex(o => o.id === suggestedOutfit.id);
    const nextIndex = (currentIndex + 1) % outfits.length;
    setSuggestedOutfit(outfits[nextIndex]);
    
    toast.success('Generated a new outfit suggestion', {
      description: 'Based on the current weather and your preferences.'
    });
  };
  
  const handleLikeOutfit = () => {
    toast.success('We\'ll suggest more outfits like this!');
  };
  
  const handleDislikeOutfit = () => {
    toast.success('We\'ll suggest fewer outfits like this.');
    handleRegenerateOutfit();
  };
  
  const handleToggleFavorite = (outfitId: string) => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === outfitId 
          ? { ...outfit, favorite: !outfit.favorite } 
          : outfit
      )
    );
    
    const outfit = outfits.find(outfit => outfit.id === outfitId);
    if (outfit) {
      const action = !outfit.favorite ? 'added to' : 'removed from';
      toast.success(`"${outfit.name}" outfit ${action} favorites`);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      toast.success(`Weather location updated to ${location}`, {
        description: 'Your outfit recommendations will be based on this location'
      });
      // In a real app, we would fetch weather for this location
      setIsWeatherLoading(true);
      // Simulate weather data fetch delay
      setTimeout(() => {
        setIsWeatherLoading(false);
      }, 1000);
    }
  };
  
  const getWeatherRecommendation = () => {
    if (!weather) return "";
    
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    
    if (temp < 10) return "It's quite cold today, so layer up with warm clothing.";
    if (temp < 15 && temp >= 10) return "It's cool today, consider a light jacket or sweater.";
    if (temp < 25 && temp >= 15) {
      if (condition.includes('rain')) return "Mild temperatures with rain expected, don't forget a waterproof layer.";
      return "Pleasant temperatures today, perfect for a light outfit.";
    }
    if (temp >= 25) {
      if (condition.includes('rain')) return "Warm but rainy - light clothes but keep an umbrella handy.";
      return "It's warm today, opt for light, breathable fabrics.";
    }
    
    return "Choose an outfit appropriate for the current weather conditions.";
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header weather={weather || undefined} />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Let us help you start the day as good as possible</h1>
              <p className="text-lg text-muted-foreground mb-6">
                And that is by choosing the right outfit for today's weather!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 items-start mb-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Today's Weather</h2>
                
                <form onSubmit={handleLocationSubmit} className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={handleLocationChange}
                    className="max-w-[260px]"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Update
                  </Button>
                </form>
                
                <WeatherWidget
                  className="w-full" 
                  onWeatherChange={handleWeatherChange}
                />
                
                {!isWeatherLoading && weather && (
                  <div className="bg-accent/20 p-4 rounded-lg border">
                    <p className="font-medium">{getWeatherRecommendation()}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Today's Suggestion</h2>
                {isWeatherLoading ? (
                  <div className="border rounded-lg p-6 bg-white shadow-soft">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      <Skeleton className="aspect-square rounded-md" />
                      <Skeleton className="aspect-square rounded-md" />
                      <Skeleton className="aspect-square rounded-md hidden sm:block" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                ) : (
                  <OutfitSuggestion
                    outfit={suggestedOutfit}
                    items={sampleClothingItems}
                    weather={weather || undefined}
                    onWear={handleWearOutfit}
                    onRefresh={handleRegenerateOutfit}
                    onLike={handleLikeOutfit}
                    onDislike={handleDislikeOutfit}
                  />
                )}
                
                <div className="flex gap-4 justify-between mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleRegenerateOutfit}
                    className="flex items-center space-x-2"
                    disabled={isWeatherLoading}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Generate Another</span>
                  </Button>
                  
                  <Button
                    variant="default"
                    className="flex items-center space-x-2"
                    disabled={isWeatherLoading}
                    asChild
                  >
                    <Link to="/try-on">
                      <Camera className="h-4 w-4" />
                      <span>Try It On</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl font-bold">My Outfits</h2>
            
            {outfits.length === 0 ? (
              <div className="flex flex-col items-center justify-center border rounded-lg p-10 space-y-4 bg-gray-50">
                <p className="text-muted-foreground text-center">
                  You haven't created any outfits yet.
                </p>
                <Button>Create Your First Outfit</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outfits.map(outfit => (
                  <div key={outfit.id} className="border rounded-lg overflow-hidden bg-white shadow-soft hover:shadow-hover transition-all">
                    <div className="p-4">
                      <h3 className="text-xl font-medium">{outfit.name}</h3>
                      <div className="flex mt-1 space-x-2">
                        {outfit.seasons.map(season => (
                          <span key={season} className="text-xs py-0.5 px-2 bg-secondary rounded-full capitalize">
                            {season}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {outfit.items.slice(0, 3).map(itemId => {
                          const item = sampleClothingItems.find(i => i.id === itemId);
                          return item ? (
                            <div key={item.id} className="aspect-square rounded-md overflow-hidden border">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          Worn {outfit.timesWorn} times
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleFavorite(outfit.id)}
                          className={outfit.favorite ? "text-red-500" : ""}
                        >
                          {outfit.favorite ? "Favorited" : "Add to Favorites"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default Outfits;
