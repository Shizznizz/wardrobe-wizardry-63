
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface TrendingStylesProps {
  className?: string;
}

const TrendingStylesSection = ({ className }: TrendingStylesProps) => {
  const navigate = useNavigate();
  
  const trendingStyles = [
    {
      id: 'monochrome',
      name: 'Monochrome Magic',
      description: 'Create a sleek, coordinated look with varying shades of a single color.',
      tags: ['minimalist', 'elegant', 'versatile']
    },
    {
      id: 'layered',
      name: 'Layered Looks',
      description: 'Master the art of layering for both style and practicality as seasons change.',
      tags: ['practical', 'adaptable', 'trendy']
    },
    {
      id: 'statement',
      name: 'Statement Accessories',
      description: 'Transform simple outfits with bold accessories that catch the eye.',
      tags: ['bold', 'expressive', 'transformative']
    },
    {
      id: 'seasonal',
      name: 'Seasonal Transitions',
      description: 'Adapt your favorite pieces across seasons with smart styling choices.',
      tags: ['adaptive', 'year-round', 'sustainable']
    },
  ];
  
  const handleStyleExplore = (styleId: string) => {
    toast.info(`Exploring ${styleId} styling techniques`);
    // In a real app, this would navigate to a style guide page
  };
  
  const handleCreateOutfit = () => {
    navigate('/wardrobe');
    toast.success('Ready to create a new outfit from your wardrobe!');
  };
  
  const handlePlanOutfits = () => {
    navigate('/style-planner');
    toast.success('Let\'s plan your outfits for the coming days!');
  };
  
  return (
    <div className={`rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-md p-6 ${className}`}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Trending Styles & Tips</h3>
          </div>
          <p className="text-white/70 text-sm">
            Explore trending styling techniques to make the most of your wardrobe
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {trendingStyles.map((style) => (
          <motion.div 
            key={style.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 border-white/5 overflow-hidden">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-1">{style.name}</h4>
                <p className="text-white/70 text-sm mb-2">{style.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {style.tags.map((tag) => (
                    <span key={tag} className="text-xs py-1 px-2 bg-white/10 rounded-full text-cyan-300">
                      #{tag}
                    </span>
                  ))}
                </div>
                <Button 
                  variant="link" 
                  className="text-cyan-400 p-0 h-auto flex items-center gap-1 hover:text-cyan-300"
                  onClick={() => handleStyleExplore(style.id)}
                >
                  <span>Explore techniques</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Button
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90"
          onClick={handleCreateOutfit}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Create New Look
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-cyan-400/30 text-white hover:bg-white/10"
          onClick={handlePlanOutfits}
        >
          <Calendar className="mr-2 h-4 w-4" /> Plan Weekly Outfits
        </Button>
      </div>
    </div>
  );
};

export default TrendingStylesSection;
