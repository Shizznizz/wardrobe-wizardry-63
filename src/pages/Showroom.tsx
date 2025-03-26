
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkle, Sparkles, Star, TrendingUp, Award, Calendar, Users, MessageCircle } from 'lucide-react';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import OutfitSlider from '@/components/OutfitSlider';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';

const fashionTips = [
  {
    id: 1,
    title: "Layering Basics",
    content: "Master the art of layering with my simple rule of three: Start with a base layer that's comfortable against your skin, add a middle insulating layer, then finish with a statement outer layer that ties everything together."
  },
  {
    id: 2,
    title: "Color Psychology",
    content: "Use color theory to your advantage! Wear blues and greens for calm confidence in meetings, energizing reds and oranges for social events, and soft neutrals when you need focus and clarity."
  },
  {
    id: 3,
    title: "Accessorizing 101",
    content: "When in doubt, follow the rule of three for accessories too: choose three key pieces (like earrings, a watch, and a bracelet) rather than overwhelming your look with too many elements."
  },
  {
    id: 4,
    title: "Sustainable Style",
    content: "Cultivate a capsule wardrobe with versatile pieces that can create dozens of outfits. It's not just environmentally conscious – it makes getting dressed so much easier!"
  }
];

const Showroom = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showAssistant, setShowAssistant] = useState(false);
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };
  
  useEffect(() => {
    // Rotate tips every 15 seconds
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % fashionTips.length);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentTip = fashionTips[currentTipIndex];

  const handleShowAssistant = () => {
    setShowAssistant(true);
  };

  const handleAssistantAction = () => {
    setShowAssistant(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Your Fashion Showroom
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Discover your unique style story, curated by Olivia Bloom, your personal style advisor.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 w-full sm:w-auto shadow-lg">
                    <Star className="mr-2 h-4 w-4" /> Create New Outfit
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" variant="outline" className="border-purple-400/30 text-white hover:bg-white/10 w-full sm:w-auto shadow-md">
                    <TrendingUp className="mr-2 h-4 w-4" /> Browse Trends
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
                <Card className="glass-dark border-white/10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-purple-400/30">
                        <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia Bloom" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center">
                          Olivia's Style Tip
                          <Sparkle className="h-4 w-4 ml-2 text-yellow-300" />
                        </h3>
                        <p className="text-white/70">{currentTip.title}</p>
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
                        "{currentTip.content}"
                      </motion.p>
                    </AnimatePresence>
                    
                    <div className="flex justify-end">
                      {!showAssistant && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShowAssistant}
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
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs defaultValue="seasonal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto bg-black/30 border border-white/10">
                <TabsTrigger value="seasonal" className="py-3 data-[state=active]:bg-purple-900/50">
                  <Calendar className="h-4 w-4 mr-2" /> Seasonal Looks
                </TabsTrigger>
                <TabsTrigger value="trending" className="py-3 data-[state=active]:bg-purple-900/50">
                  <TrendingUp className="h-4 w-4 mr-2" /> Trending Now
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="py-3 data-[state=active]:bg-purple-900/50">
                  <Award className="h-4 w-4 mr-2" /> For You
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="seasonal" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Winter 2023 Collection</h2>
                <OutfitSlider />
              </TabsContent>
              
              <TabsContent value="trending" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">What's Hot Right Now</h2>
                <OutfitSlider />
              </TabsContent>
              
              <TabsContent value="recommendations" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Personalized For Your Style</h2>
                <OutfitSlider />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      {showWelcome && (
        <OliviaBloomAssistant
          message="Welcome to your Fashion Showroom! I've curated some seasonal looks and trending styles just for you. Browse through the collections and I'll provide personalized advice based on your style profile."
          type="welcome"
          timing="long"
          actionText="Thanks, Olivia!"
          onAction={() => setShowWelcome(false)}
          position="bottom-right"
          autoClose={false}
        />
      )}
      
      {showAssistant && (
        <OliviaBloomAssistant
          message={currentTip.content}
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

export default Showroom;
