
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/Header';
import OutfitGrid from '@/components/OutfitGrid';
import OutfitBuilder from '@/components/OutfitBuilder';
import OutfitSelector from '@/components/OutfitSelector';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import { ClothingItem, Outfit } from '@/lib/types';
import { sampleOutfits, sampleClothingItems, sampleUserPreferences } from '@/lib/wardrobeData';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';

const Outfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(sampleClothingItems);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showAssistant, setShowAssistant] = useState(true);
  
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

  const handleAssistantAction = () => {
    setShowAssistant(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
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
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" /> Create New Outfit
                </Button>
                <Button size="lg" variant="outline" className="border-purple-400/30 text-white hover:bg-white/10">
                  <Filter className="mr-2 h-4 w-4" /> Filter Options
                </Button>
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
                <Card className="glass-dark border-white/10 overflow-hidden">
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
                    <p className="text-white/90 italic">
                      "Let your outfit reflect your mood. Today's forecast calls for layers that transition from cool mornings to warmer afternoons. Try pairing comfort with style."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
      
          {/* Today's Recommended Outfit Section */}
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Today's Recommended Outfit
            </h2>
            <WeatherWidget />
            <OutfitSuggestion outfit={sampleOutfits[0]} />
          </motion.section>
          
          {/* User's Outfit Collection */}
          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                My Outfit Collection
              </h2>
              <Button variant="outline" onClick={handleCreateOutfit}>
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
          message="Welcome to your Outfits page! Here you can create new outfits, browse your collection, and get personalized style suggestions."
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
