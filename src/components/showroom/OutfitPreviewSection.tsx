
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { ClothingItem, Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WardrobeGrid from '@/components/WardrobeGrid';

interface OutfitPreviewSectionProps {
  finalImage: string | null;
  selectedOutfit: Outfit | null;
  clothingItems: ClothingItem[];
  isProcessingTryOn: boolean;
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  onSaveLook: () => void;
}

const OutfitPreviewSection = ({
  finalImage,
  selectedOutfit,
  clothingItems,
  isProcessingTryOn,
  userPhoto,
  isUsingOliviaImage,
  onSaveLook
}: OutfitPreviewSectionProps) => {
  const [showClothingOptions, setShowClothingOptions] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('tops');
  const isMobile = useIsMobile();
  
  // Filter clothing items by category for the tabs
  const tops = clothingItems.filter(item => 
    ['shirt', 'sweater', 'hoodie'].includes(item.type)
  );
  
  const bottoms = clothingItems.filter(item => 
    ['jeans', 'pants', 'shorts', 'skirt'].includes(item.type)
  );
  
  const outerwear = clothingItems.filter(item => 
    ['jacket'].includes(item.type)
  );
  
  const dresses = clothingItems.filter(item => 
    ['dress'].includes(item.type)
  );
  
  const shoes = clothingItems.filter(item => 
    ['shoes', 'sneakers', 'boots'].includes(item.type)
  );
  
  const accessories = clothingItems.filter(item => 
    ['accessories'].includes(item.type)
  );

  const handleToggleOptions = () => {
    setShowClothingOptions(!showClothingOptions);
  };
  
  const handleMatchItem = (item: ClothingItem) => {
    // This would add the item to the outfit
    console.log('Adding item to outfit:', item);
  };
  
  const handleToggleFavorite = (id: string) => {
    // Toggle favorite status
    console.log('Toggle favorite for item:', id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Outfit Preview</h2>
            
            {selectedOutfit && finalImage && (
              <Button 
                variant="outline"
                size="sm"
                onClick={handleToggleOptions}
                className="border-purple-400/30 text-white hover:bg-white/10"
              >
                {showClothingOptions ? (
                  <>Hide Options</>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Customize Outfit
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${showClothingOptions ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <VirtualFittingRoom 
                finalImage={finalImage}
                outfit={selectedOutfit}
                clothingItems={clothingItems}
                isProcessing={isProcessingTryOn}
                userPhoto={userPhoto}
                onSaveLook={onSaveLook}
                isOliviaImage={isUsingOliviaImage}
                className="flex-grow"
              />
            </div>
            
            {showClothingOptions && (
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="bg-slate-800/40 rounded-lg border border-white/10 p-4">
                  <h3 className="text-lg font-medium mb-3">Customize Outfit</h3>
                  
                  <Tabs defaultValue="tops" value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid grid-cols-3 w-full mb-4 bg-slate-800/50">
                      <TabsTrigger value="tops">Tops</TabsTrigger>
                      <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                      <TabsTrigger value="shoes">Shoes</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tops">
                      <WardrobeGrid 
                        items={tops}
                        onToggleFavorite={handleToggleFavorite}
                        onMatchItem={handleMatchItem}
                        compactView={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="bottoms">
                      <WardrobeGrid 
                        items={bottoms}
                        onToggleFavorite={handleToggleFavorite}
                        onMatchItem={handleMatchItem}
                        compactView={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="shoes">
                      <WardrobeGrid 
                        items={shoes}
                        onToggleFavorite={handleToggleFavorite}
                        onMatchItem={handleMatchItem}
                        compactView={true}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      <Plus className="mr-2 h-4 w-4" /> Add New Item
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OutfitPreviewSection;
