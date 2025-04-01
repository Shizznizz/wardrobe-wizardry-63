
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { ClothingItem, Outfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Wand } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WardrobeGrid from '@/components/WardrobeGrid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
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

  // Poll for prediction results if we have a prediction ID
  useEffect(() => {
    if (!predictionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { predictionId }
        });

        if (error) throw new Error(error.message);

        if (data.generatedImageUrl) {
          // Image generation is complete
          setAiGeneratedImage(data.generatedImageUrl);
          setIsGeneratingAI(false);
          setPredictionId(null);
          clearInterval(pollInterval);
          toast.success("AI-generated try-on is ready!");
        }
      } catch (err) {
        console.error("Error polling for prediction:", err);
      }
    }, 3000);

    // Cleanup interval on component unmount or when polling completes
    return () => clearInterval(pollInterval);
  }, [predictionId]);

  const handleToggleOptions = () => {
    setShowClothingOptions(!showClothingOptions);
  };
  
  const handleMatchItem = (item: ClothingItem) => {
    console.log('Adding item to outfit:', item);
  };
  
  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite for item:', id);
  };

  const generateAITryOn = async () => {
    if (!selectedOutfit || !userPhoto) {
      toast.error("You need both a photo and an outfit selected");
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      const outfitItems = selectedOutfit.items.map(id => {
        const item = clothingItems.find(item => item.id === id);
        return item ? item.name : "";
      }).filter(Boolean).join(", ");
      
      const prompt = `a photorealistic image of a person wearing ${outfitItems}`;
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt,
          userPhotoUrl: userPhoto
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("AI generation response:", data);
      
      if (data.generatedImageUrl) {
        // Image was generated immediately
        setAiGeneratedImage(data.generatedImageUrl);
        toast.success("AI-generated try-on ready!");
        setIsGeneratingAI(false);
      } else if (data.predictionId) {
        // Need to poll for results
        setPredictionId(data.predictionId);
        // Use the mock image URL temporarily if provided
        if (data.mockImageUrl) {
          setAiGeneratedImage(data.mockImageUrl);
        }
        toast("Generating AI try-on image...", {
          description: "This may take a minute or two. We'll notify you when it's ready."
        });
      }
    } catch (error) {
      console.error("Error in AI generation:", error);
      toast.error("Failed to generate AI try-on image");
      setIsGeneratingAI(false);
    }
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
            
            <div className="flex gap-2">
              {selectedOutfit && userPhoto && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAITryOn}
                  disabled={isGeneratingAI}
                  className="border-purple-400/30 text-white hover:bg-white/10"
                >
                  <Wand className="mr-2 h-4 w-4" />
                  {isGeneratingAI ? 'Generating...' : 'AI Try-On'}
                </Button>
              )}
              
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
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${showClothingOptions ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <VirtualFittingRoom 
                finalImage={aiGeneratedImage || finalImage}
                outfit={selectedOutfit}
                clothingItems={clothingItems}
                isProcessing={isProcessingTryOn || isGeneratingAI}
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
