
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Sparkles, ExternalLink, Camera, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface TrendingStylesProps {
  className?: string;
}

const TrendingStylesSection = ({ className }: TrendingStylesProps) => {
  const navigate = useNavigate();
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  
  const trendingStyles = [
    {
      id: 'monochrome',
      name: 'Monochrome Magic',
      description: 'Create a sleek, coordinated look with varying shades of a single color.',
      tags: ['minimalist', 'elegant', 'versatile'],
      image: 'url(https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
      color: 'from-blue-600/40 to-indigo-700/40'
    },
    {
      id: 'layered',
      name: 'Layered Looks',
      description: 'Master the art of layering for both style and practicality as seasons change.',
      tags: ['practical', 'adaptable', 'trendy'],
      image: 'url(https://images.unsplash.com/photo-1614251055880-ee96e4803a7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
      color: 'from-purple-600/40 to-pink-600/40'
    },
    {
      id: 'statement',
      name: 'Statement Accessories',
      description: 'Transform simple outfits with bold accessories that catch the eye.',
      tags: ['bold', 'expressive', 'transformative'],
      image: 'url(https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
      color: 'from-amber-500/40 to-red-600/40'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Transitions',
      description: 'Adapt your favorite pieces across seasons with smart styling choices.',
      tags: ['adaptive', 'year-round', 'sustainable'],
      image: 'url(https://images.unsplash.com/photo-1614786269829-d24616faf56d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
      color: 'from-emerald-600/40 to-teal-700/40'
    },
  ];
  
  const handleStyleExplore = (styleId: string) => {
    setActiveStyle(styleId);
    toast.success(`Exploring ${trendingStyles.find(s => s.id === styleId)?.name} styling techniques`);
    
    // In a real app, this would navigate to a style guide page or show more details
    // For now, we'll just toggle the active state
    setTimeout(() => {
      toast.info("More style guidance coming soon in the next update!");
    }, 1000);
  };
  
  const handleCreateOutfit = () => {
    navigate('/wardrobe');
    toast.success('Ready to create a new outfit from your wardrobe!');
  };
  
  const handlePlanOutfits = () => {
    navigate('/style-planner');
    toast.success('Let\'s plan your outfits for the coming days!');
  };
  
  const handleSaveStyle = (styleId: string) => {
    toast.success(`${trendingStyles.find(s => s.id === styleId)?.name} saved to your favorites!`);
  };
  
  const handleLearnMore = (styleId: string) => {
    toast.info(`Opening detailed guide for ${trendingStyles.find(s => s.id === styleId)?.name}`);
    // In a real app, this would open a modal or navigate to a detailed page
  };
  
  return (
    <div className={`rounded-xl border border-white/10 overflow-hidden bg-gradient-to-b from-slate-900/90 to-indigo-950/90 backdrop-blur-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Trending Styles & Tips</h3>
            <p className="text-white/70 text-sm">
              Explore trending styling techniques to make the most of your wardrobe
            </p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-3"
        >
          Updated Weekly
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {trendingStyles.map((style) => (
          <motion.div 
            key={style.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="relative"
          >
            <Card className={`overflow-hidden border-white/5 h-full bg-gradient-to-br ${style.color}`}>
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center z-0"
                style={{ backgroundImage: style.image }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/70 to-transparent z-0"/>
              <CardContent className="relative z-10 p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-medium text-lg">{style.name}</h4>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSaveStyle(style.id)}
                    className="text-white/70 hover:text-pink-400 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </motion.button>
                </div>
                <p className="text-white/80 text-sm mb-3">{style.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {style.tags.map((tag) => (
                    <span key={tag} className="text-xs py-1 px-2 bg-white/10 rounded-full text-cyan-300">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <Button 
                    variant="link" 
                    className="text-cyan-400 p-0 h-auto flex items-center gap-1 hover:text-cyan-300"
                    onClick={() => handleStyleExplore(style.id)}
                  >
                    <span>Explore techniques</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    variant="link" 
                    className="text-white/70 p-0 h-auto flex items-center gap-1 hover:text-white"
                    onClick={() => handleLearnMore(style.id)}
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Learn more</span>
                  </Button>
                </div>
                
                {activeStyle === style.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-white/90 text-sm mb-3">
                      View our curated guide for creating the perfect {style.name.toLowerCase()} look.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-cyan-500/30 text-white hover:bg-white/10"
                      onClick={() => handleLearnMore(style.id)}
                    >
                      <Camera className="mr-2 h-3 w-3" />
                      View Style Guide
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Button
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-blue-700/20 transition-all duration-300"
          onClick={handleCreateOutfit}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Create New Look
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-cyan-400/30 text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300"
          onClick={handlePlanOutfits}
        >
          <Calendar className="mr-2 h-4 w-4" /> Plan Weekly Outfits
        </Button>
      </div>
    </div>
  );
};

export default TrendingStylesSection;
