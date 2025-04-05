
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { ClothingItem, Outfit } from '@/lib/types';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import PredictionPoller from './PredictionPoller';
import OutfitCustomizationPanel from './OutfitCustomizationPanel';
import OutfitActionButtons from './OutfitActionButtons';
import { Button } from '@/components/ui/button';
import { Camera, ArrowLeft, Edit, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OutfitPreviewSectionProps {
  finalImage: string | null;
  selectedOutfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessingTryOn: boolean;
  userPhoto: string | null;
  clothingPhoto?: string | null;
  isUsingOliviaImage: boolean;
  onSaveLook: () => void;
  onChangePhoto?: () => void;
}

const OutfitPreviewSection = ({
  finalImage,
  selectedOutfit,
  clothingItems,
  isProcessingTryOn,
  userPhoto,
  clothingPhoto,
  isUsingOliviaImage,
  onSaveLook,
  onChangePhoto
}: OutfitPreviewSectionProps) => {
  const [showClothingOptions, setShowClothingOptions] = useState(false);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  
  const handleToggleOptions = () => {
    setShowClothingOptions(!showClothingOptions);
  };
  
  const handleMatchItem = (item: ClothingItem) => {
    console.log('Adding item to outfit:', item);
  };
  
  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite for item:', id);
  };

  const handlePredictionComplete = (imageUrl: string) => {
    setPredictionId(null);
  };
  
  const handlePredictionError = (error: string) => {
    console.error("Prediction error:", error);
    setGenerationError(error);
    setPredictionId(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden shadow-xl shadow-purple-900/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Outfit Preview
            </motion.h2>
            
            <OutfitActionButtons 
              selectedOutfit={selectedOutfit}
              userPhoto={userPhoto}
              finalImage={finalImage}
              showClothingOptions={showClothingOptions}
              onToggleOptions={handleToggleOptions}
            />
          </div>
          
          {/* Outfit title bar - only show when an outfit is selected */}
          {selectedOutfit && finalImage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-900/30 to-slate-900/30 backdrop-blur-sm border border-white/10 rounded-lg p-3 mb-4 flex justify-between items-center shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">Currently Wearing: {selectedOutfit.name}</h3>
                  <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full text-white/70 hover:text-white hover:bg-white/10">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex mt-1 flex-wrap gap-1">
                  {selectedOutfit.seasons.map(season => (
                    <Badge 
                      key={season} 
                      variant="outline" 
                      className="text-xs py-0 px-2 bg-white/5 text-purple-200 border-purple-400/30"
                    >
                      {season}
                    </Badge>
                  ))}
                  {selectedOutfit.occasions && selectedOutfit.occasions.map(occasion => (
                    <Badge 
                      key={occasion} 
                      variant="outline" 
                      className="text-xs py-0 px-2 bg-white/5 text-blue-200 border-blue-400/30"
                    >
                      {occasion}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button size="sm" variant="ghost" className="text-xs gap-1 text-white/70 hover:text-white">
                <Calendar className="h-3 w-3" />
                Add to Calendar
              </Button>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${showClothingOptions ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`preview-${finalImage || 'empty'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {userPhoto && !finalImage && (
                    <motion.div
                      className="absolute top-4 left-4 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="bg-black/40 hover:bg-black/60 text-white"
                        onClick={onChangePhoto}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    </motion.div>
                  )}
                  
                  <div className={`overflow-hidden rounded-xl transition-all duration-300 ${isHovering && finalImage ? 'shadow-2xl shadow-purple-500/20 scale-[1.01]' : 'shadow-lg'}`}>
                    <VirtualFittingRoom 
                      finalImage={finalImage}
                      outfit={selectedOutfit}
                      clothingItems={clothingItems}
                      isProcessing={isProcessingTryOn}
                      userPhoto={userPhoto}
                      clothingPhoto={clothingPhoto}
                      onSaveLook={onSaveLook}
                      isOliviaImage={isUsingOliviaImage}
                      className="rounded-xl overflow-hidden transition-all border-2 border-white/5"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {generationError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-200 text-sm">
                  <p>AI generation error: {generationError}</p>
                  <p className="mt-1">Please try again or choose a different outfit/photo combination.</p>
                </div>
              )}
              
              {finalImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                    Style it further with...
                  </h3>
                  
                  <div className="flex gap-3 overflow-x-auto py-2 pb-3 scrollbar-none">
                    {clothingItems.slice(0, 6).map((item, index) => (
                      <motion.div 
                        key={item.id || index} 
                        className="flex-shrink-0 group cursor-pointer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shadow-md relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" className="text-white text-xs h-7 px-2 hover:bg-white/20">
                              Add
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-center mt-1 text-white/80 truncate w-20">{item.name}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-purple-300 italic mt-1">
                    <span>Olivia suggests these items based on your style preferences</span>
                  </div>
                </motion.div>
              )}
            </div>
            
            {showClothingOptions && (
              <OutfitCustomizationPanel
                clothingItems={clothingItems}
                onToggleFavorite={handleToggleFavorite}
                onMatchItem={handleMatchItem}
              />
            )}
          </div>
          
          {/* Hidden component to handle polling */}
          <PredictionPoller
            predictionId={predictionId}
            onPredictionComplete={handlePredictionComplete}
            onPredictionError={handlePredictionError}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OutfitPreviewSection;
