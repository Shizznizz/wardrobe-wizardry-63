import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { Button } from '@/components/ui/button';
import { WeatherInfo, Outfit } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

const Outfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [suggestedOutfit, setSuggestedOutfit] = useState<Outfit>(sampleOutfits[0]);
  
  const handleWeatherChange = (weatherData: WeatherInfo) => {
    setWeather(weatherData);
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
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-3xl font-bold">Today's Suggestion</h2>
              <WeatherWidget
                className="w-full max-w-[220px]" 
                onWeatherChange={handleWeatherChange}
              />
            </div>
            
            <OutfitSuggestion
              outfit={suggestedOutfit}
              items={sampleClothingItems}
              weather={weather || undefined}
              onWear={handleWearOutfit}
              onRefresh={handleRegenerateOutfit}
              onLike={handleLikeOutfit}
              onDislike={handleDislikeOutfit}
            />
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleRegenerateOutfit}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Generate Another Suggestion</span>
              </Button>
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
