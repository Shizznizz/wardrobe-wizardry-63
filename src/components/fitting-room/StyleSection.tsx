
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Outfit } from '@/lib/types';
import OutfitCard from './OutfitCard';
import BlurredSectionOverlay from './BlurredSectionOverlay';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StyleSectionProps {
  title: string;
  subtitle?: string;
  outfits: Outfit[];
  icon?: React.ReactNode;
  gradientColors?: {
    from: string;
    to: string;
  };
  iconColor?: string;
  titleGradient?: string;
  onPreviewOutfit: (outfit: Outfit) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  userPhoto: string | null;
  onClickChooseModel: () => void;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  className?: string;
  showTrending?: boolean;
}

const StyleSection: React.FC<StyleSectionProps> = ({
  title,
  subtitle,
  outfits = [],
  icon,
  gradientColors = { from: 'from-slate-800/80', to: 'to-slate-900/80' },
  iconColor = 'text-purple-400',
  titleGradient = 'from-blue-200 to-purple-300',
  onPreviewOutfit,
  onRefresh,
  isLoading = false,
  userPhoto,
  onClickChooseModel,
  lastUpdated,
  isRefreshing = false,
  className = '',
  showTrending = false
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <div className={`mt-8 relative ${className}`}>
      <Card 
        className={`glass-dark border-white/10 overflow-hidden shadow-lg relative
          bg-gradient-to-br ${gradientColors.from} ${gradientColors.to} border border-white/10`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}>
              <motion.span 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="inline-flex items-center"
              >
                {title}
                {icon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {React.isValidElement(icon) ? 
                      React.cloneElement(icon as React.ReactElement, { 
                        className: `h-5 w-5 ml-2 ${iconColor}` 
                      }) : 
                      icon
                    }
                  </motion.div>
                )}
              </motion.span>
            </h2>
            
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <motion.span 
                  className="text-xs text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Updated: {lastUpdated.toLocaleDateString()}
                </motion.span>
              )}
              
              {onRefresh && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </div>
          </div>
          
          {subtitle && (
            <p className="text-white/70 mb-6">
              {subtitle}
            </p>
          )}
          
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                onClick={handleScrollLeft}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[420px]">
                <div className="animate-pulse flex flex-col items-center">
                  {icon && React.isValidElement(icon) ? 
                    React.cloneElement(icon as React.ReactElement, { 
                      className: "h-8 w-8 text-white/30 mb-3" 
                    }) : 
                    null
                  }
                  <p className="text-white/50">Loading styles for you...</p>
                </div>
              </div>
            ) : (
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pl-12 pr-12"
                style={{ scrollbarWidth: 'thin' }}
              >
                {outfits.map((outfit, index) => (
                  <div key={outfit.id || index} className="flex-shrink-0 w-[300px]">
                    <OutfitCard
                      outfit={outfit}
                      onPreview={onPreviewOutfit}
                      disabled={!userPhoto}
                      isHighlighted={index === 0}
                      isTrending={showTrending}
                    />
                  </div>
                ))}
                
                {outfits.length === 0 && !isLoading && (
                  <div className="flex items-center justify-center w-full h-[420px] text-white/50">
                    No outfits available
                  </div>
                )}
              </div>
            )}
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                onClick={handleScrollRight}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Overlay when no model is selected */}
        {!userPhoto && (
          <BlurredSectionOverlay 
            onClickChooseModel={onClickChooseModel} 
            customMessage={`Choose a photo or Olivia to preview these outfits`}
          />
        )}
      </Card>
    </div>
  );
};

export default StyleSection;
