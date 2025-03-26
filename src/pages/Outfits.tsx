
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Sparkles, ArrowRight, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/Header';
import OutfitGrid from '@/components/OutfitGrid';
import OutfitBuilder from '@/components/OutfitBuilder';
import OutfitSelector from '@/components/OutfitSelector';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import { ClothingItem, Outfit, WeatherInfo } from '@/lib/types';
import { sampleOutfits, sampleClothingItems, sampleUserPreferences } from '@/lib/wardrobeData';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { TrousersIcon, Party, Umbrella, Sunset, Moon, Coffee } from '@/components/ui/icons'; 

const Outfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(sampleClothingItems);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showRotatingView, setShowRotatingView] = useState(false);
  
  // Weather-based background state
  const [weatherBackground, setWeatherBackground] = useState("from-slate-950 to-purple-950");
  
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
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const outfitTips = [
    {
      id: 1,
      title: "Color Harmony",
      content: "For this weather, try combining cool blues with warm accents for a balanced look that matches the day's mood."
    },
    {
      id: 2,
      title: "Layering Strategy",
      content: "The temperature will vary today. Layer a light cardigan over your outfit that you can easily remove as it warms up."
    },
    {
      id: 3,
      title: "Accessory Advice",
      content: "Complete your look with a statement piece that brightens your outfit - perfect for boosting your mood on this type of day."
    }
  ];

  useEffect(() => {
    // Update background based on weather
    if (currentWeather) {
      const condition = currentWeather.condition.toLowerCase();
      if (condition.includes('rain')) {
        setWeatherBackground("from-slate-900 to-blue-950");
      } else if (condition.includes('cloud')) {
        setWeatherBackground("from-slate-800 to-indigo-950");
      } else if (condition.includes('clear') || condition.includes('sun')) {
        setWeatherBackground("from-indigo-900 to-purple-900");
      } else if (condition.includes('snow')) {
        setWeatherBackground("from-slate-800 to-sky-950");
      }
    }
  }, [currentWeather]);

  const handleCreateOutfit = () => {
    setIsBuilderOpen(true);
    setSelectedOutfit(null);
  };

  const handleEditOutfit = (outfit: Outfit) => {
    setIsBuilderOpen(true);
    setSelectedOutfit(outfit);
  };

  const handleSaveOutfit = (newOutfit: Outfit) => {
    if (selectedOutfit) {
      setOutfits(outfits.map(outfit => outfit.id === selectedOutfit.id ? newOutfit : outfit));
    } else {
      setOutfits([...outfits, { ...newOutfit, id: String(Date.now()) }]);
    }
    setIsBuilderOpen(false);
    setSelectedOutfit(null);
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(outfits.filter(outfit => outfit.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
      )
    );
  };

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % outfitTips.length);
  };

  const handleAssistantAction = () => {
    setShowAssistant(false);
  };

  const handleWeatherChange = (weather: WeatherInfo) => {
    setCurrentWeather(weather);
  };

  const handleShowTips = () => {
    setShowAssistant(true);
  };

  const handleRefreshOutfit = () => {
    // Animation effect for refreshing
    setShowRotatingView(true);
    setTimeout(() => setShowRotatingView(false), 1000);
  };

  const handleSelectOccasion = (occasion: string) => {
    setSelectedOccasion(occasion);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${weatherBackground} text-white transition-colors duration-700`}>
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Your Perfect Outfits
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Discover AI-powered outfit combinations based on your style, occasion, and the weather.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 w-full sm:w-auto shadow-lg"
                    onClick={handleCreateOutfit}
                  >
                    <Plus className="mr-2 h-5 w-5" /> Create New Outfit
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-purple-400/30 text-white hover:bg-white/10 w-full sm:w-auto shadow-md backdrop-blur-sm"
                  >
                    <Filter className="mr-2 h-5 w-5" /> Filter Options
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <Card className="glass-dark border-white/10 overflow-hidden relative group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-purple-400/30">
                        <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center">
                          Style Suggestion
                          <Sparkles className="h-4 w-4 ml-2 text-yellow-300" />
                        </h3>
                        <p className="text-white/70">From Olivia Bloom</p>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={currentTipIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-white/90 italic mb-4"
                      >
                        "{outfitTips[currentTipIndex].content}"
                      </motion.p>
                    </AnimatePresence>
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleNextTip}
                        className="text-white/80 hover:text-white hover:bg-white/10"
                      >
                        Next tip
                      </Button>
                      {!showAssistant && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShowTips}
                          className="border-purple-400/30 text-white hover:bg-white/10"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Ask Olivia
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
      
          {/* Today's Recommended Outfit Section - Enhanced */}
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-0 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Today's Recommended Outfit
              </h2>
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleRefreshOutfit}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${showRotatingView ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="md:col-span-1">
                <WeatherWidget onWeatherChange={handleWeatherChange} />
                
                <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Coffee className="mr-2 h-5 w-5 text-amber-400" />
                    Occasion
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Casual', 'Work', 'Party', 'Date', 'Formal'].map(occasion => (
                      <Button
                        key={occasion}
                        variant={selectedOccasion === occasion ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectOccasion(occasion)}
                        className={selectedOccasion === occasion 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : "border-white/20 text-white hover:bg-white/10"}
                      >
                        {occasion === 'Party' && <Party className="mr-1 h-3.5 w-3.5" />}
                        {occasion === 'Casual' && <TrousersIcon className="mr-1 h-3.5 w-3.5" />}
                        {occasion === 'Formal' && <Sunset className="mr-1 h-3.5 w-3.5" />}
                        {occasion === 'Work' && <Moon className="mr-1 h-3.5 w-3.5" />}
                        {occasion === 'Date' && <Umbrella className="mr-1 h-3.5 w-3.5" />}
                        {occasion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <OutfitSuggestion 
                  outfit={sampleOutfits[0]} 
                  items={clothingItems}
                  weather={currentWeather || undefined}
                  activity={selectedOccasion?.toLowerCase() as any}
                  onRefresh={handleRefreshOutfit}
                  onLike={() => {}}
                  onDislike={() => {}}
                  onMakeWarmer={() => {}}
                  onChangeTop={() => {}}
                  onChangeBottom={() => {}}
                />
              </div>
            </div>
          </motion.section>
          
          {/* User's Outfit Collection */}
          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                My Outfit Collection
              </h2>
              <Button 
                variant="outline" 
                onClick={handleCreateOutfit}
                className="border-purple-400/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-md"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Outfit
              </Button>
            </div>
            <OutfitGrid 
              outfits={outfits} 
              onEdit={handleEditOutfit}
              onDelete={handleDeleteOutfit}
              onToggleFavorite={handleToggleFavorite}
              clothingItems={clothingItems}
            />
          </motion.section>
          
          {/* Outfit Builder Section */}
          <OutfitBuilder
            isOpen={isBuilderOpen}
            onClose={() => setIsBuilderOpen(false)}
            onSave={handleSaveOutfit}
            clothingItems={clothingItems}
            initialOutfit={selectedOutfit}
          />
        </motion.div>
      </main>
      
      {showAssistant && (
        <OliviaBloomAssistant
          message={outfitTips[currentTipIndex].content}
          type="tip"
          timing="medium"
          actionText="Got it!"
          onAction={handleAssistantAction}
          position="bottom-right"
        />
      )}
    </div>
  );
};

export default Outfits;
