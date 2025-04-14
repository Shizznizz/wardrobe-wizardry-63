
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, Heart, ArrowLeft, Eye, Shuffle, ShirtIcon, PantsIcon } from 'lucide-react';
import { ClothingItem, Outfit } from '@/lib/types';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface OutfitPreviewAreaProps {
  finalImage: string | null;
  userPhoto: string | null;
  selectedOutfit: Outfit | null;
  isProcessingTryOn: boolean;
  isUsingOliviaImage: boolean;
  clothingItems: ClothingItem[];
  onSaveLook: () => void;
  onDownload: () => void;
  onShare: () => void;
  onResetSelection: () => void;
}

const OutfitPreviewArea = ({
  finalImage,
  userPhoto,
  selectedOutfit,
  isProcessingTryOn,
  isUsingOliviaImage,
  clothingItems,
  onSaveLook,
  onDownload,
  onShare,
  onResetSelection
}: OutfitPreviewAreaProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("outfit");
  const [isSwapping, setIsSwapping] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
      id="preview-section"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          Outfit Preview
        </motion.h2>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5"
          onClick={onResetSelection}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Try Another Outfit
        </Button>
      </div>
      
      <Card className="glass-dark border-white/10 overflow-hidden shadow-xl shadow-purple-900/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`preview-${finalImage || 'empty'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="overflow-hidden rounded-xl">
                    <VirtualFittingRoom 
                      finalImage={finalImage}
                      outfit={selectedOutfit}
                      clothingItems={clothingItems}
                      isProcessing={isProcessingTryOn}
                      userPhoto={userPhoto}
                      isOliviaImage={isUsingOliviaImage}
                      className="rounded-xl overflow-hidden transition-all border-2 border-white/5"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex flex-col">
              {selectedOutfit && (
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-white mb-2">{selectedOutfit.name}</h3>
                  <p className="text-white/70 text-sm mb-4">
                    This is your personal outfit from Mix & Match. You can try different variations or save this look.
                  </p>
                  
                  {/* Optional outfit swap functionality */}
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-white/90 mb-3">Try variations of this outfit</h4>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 border-white/10 text-white"
                      >
                        <ShirtIcon className="h-4 w-4 mr-2" />
                        Swap Top
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 border-white/10 text-white"
                      >
                        <PantsIcon className="h-4 w-4 mr-2" />
                        Swap Bottom
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-auto">
                <p className="text-sm text-white/70 mb-3">Actions:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    onClick={onSaveLook}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Save Look
                  </Button>
                  
                  {navigator.share && (
                    <Button 
                      variant="outline" 
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      onClick={onShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={onDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitPreviewArea;
