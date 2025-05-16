
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Shirt, TrousersIcon } from '@/components/ui/icons';

interface WardrobeGapsProps {
  items: ClothingItem[];
}

const WardrobeGaps = ({ items }: WardrobeGapsProps) => {
  const navigate = useNavigate();
  const [gap, setGap] = React.useState<{category: string, reason: string} | null>(null);
  
  // Analyze wardrobe for gaps
  React.useEffect(() => {
    if (!items || items.length === 0) return;
    
    const categoryCounts: Record<string, number> = {};
    const essentialCategories = ['jacket', 'coat', 'shoes', 'formal', 'dress', 'pants'];
    
    // Count items per category
    items.forEach(item => {
      const category = item.type || item.category || '';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      
      // Check for formal occasions
      if (item.occasions && item.occasions.includes('formal')) {
        categoryCounts['formal'] = (categoryCounts['formal'] || 0) + 1;
      }
    });
    
    // Find missing essentials
    const missingEssentials = essentialCategories.filter(cat => 
      !categoryCounts[cat] || categoryCounts[cat] < 2
    );
    
    if (missingEssentials.length > 0) {
      const randomMissing = missingEssentials[Math.floor(Math.random() * missingEssentials.length)];
      const recommendations = {
        'jacket': 'a versatile jacket',
        'coat': 'a seasonal coat',
        'shoes': 'dress shoes or versatile footwear',
        'formal': 'formal attire options',
        'dress': 'a versatile dress',
        'pants': 'formal or tailored pants'
      };
      
      setGap({
        category: randomMissing,
        reason: `You seem to be missing ${recommendations[randomMissing as keyof typeof recommendations]} in your wardrobe.`
      });
    } else {
      setGap(null);
    }
  }, [items]);
  
  const handleShowRecommendations = () => {
    // Navigate to Shop & Try with category filter
    if (gap) {
      navigate(`/shop-and-try?category=${encodeURIComponent(gap.category)}`);
    }
  };
  
  if (!gap) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-5 bg-purple-900/20 border border-purple-500/30 rounded-lg backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {gap.category === 'pants' || gap.category === 'formal' ? (
            <TrousersIcon className="h-8 w-8 text-purple-300/70" />
          ) : (
            <Shirt className="h-8 w-8 text-purple-300/70" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-1">Wardrobe Gap Detected</h3>
          <p className="text-sm text-white/80 mb-3">{gap.reason} Want Olivia to recommend something?</p>
          <Button 
            onClick={handleShowRecommendations} 
            size="sm"
            className="bg-white text-purple-800 hover:bg-white/90"
          >
            Show Recommendations
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WardrobeGaps;
