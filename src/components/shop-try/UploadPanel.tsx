
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image, 
  Shirt, 
  X, 
  RefreshCw, 
  Wand2, 
  User, 
  Sparkles, 
  Heart, 
  Lock, 
  Download
} from 'lucide-react';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';

interface UploadPanelProps {
  userPhoto: string | null;
  clothingPhoto: string | null;
  isProcessing: boolean;
  isUsingOliviaImage: boolean;
  finalImage: string | null;
  mockOutfit: Outfit | null;
  selectedItems: ClothingItem[];
  generationError: string | null;
  isPremiumUser: boolean;
  oliviaMood: 'happy' | 'thinking' | 'neutral';
  stylingTip: string | null;
  onUserPhotoUpload: (file: File) => void;
  onClothingPhotoUpload: (file: File) => void;
  onClearUserPhoto: () => void;
  onClearPhotos: () => void;
  onTryOn: () => void;
  onShowOliviaImageGallery: () => void;
  onSaveLook: () => void;
  onAddItem: (item: ClothingItem) => void;
  onShowPremiumPopup: () => void;
}

const UploadPanel = ({
  userPhoto,
  clothingPhoto,
  isProcessing,
  isUsingOliviaImage,
  finalImage,
  mockOutfit,
  selectedItems,
  generationError,
  isPremiumUser,
  oliviaMood,
  stylingTip,
  onUserPhotoUpload,
  onClothingPhotoUpload,
  onClearUserPhoto,
  onClearPhotos,
  onTryOn,
  onShowOliviaImageGallery,
  onSaveLook,
  onAddItem,
  onShowPremiumPopup
}: UploadPanelProps) => {
  const [activeTab, setActiveTab] = useState('photo');
  const isMobile = useIsMobile();
  
  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUserPhotoUpload(e.target.files[0]);
    }
  };
  
  const handleClothingPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onClothingPhotoUpload(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <Card className="border-white/10 bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-bold text-white mb-4">Virtual Try-On</h2>
              
              <Tabs defaultValue="photo" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-800/50 border border-white/10 w-full">
                  <TabsTrigger value="photo" className="flex-1 data-[state=active]:bg-indigo-600">
                    <User className="h-4 w-4 mr-2" />
                    Your Photo
                  </TabsTrigger>
                  <TabsTrigger value="clothing" className="flex-1 data-[state=active]:bg-indigo-600">
                    <Shirt className="h-4 w-4 mr-2" />
                    Clothing
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="photo" className="mt-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    {!userPhoto ? (
                      <div className="py-6">
                        <Image className="h-12 w-12 mx-auto text-white/40 mb-4" />
                        <p className="text-white/70 mb-6">Upload a photo to see how clothes look on you</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleUserPhotoUpload}
                            />
                            <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-4 py-2 text-sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                            </div>
                          </label>
                          
                          <Button 
                            variant="outline"
                            className="border-white/20 hover:bg-white/10 text-white"
                            onClick={onShowOliviaImageGallery}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Use Olivia
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={userPhoto} 
                          alt="Uploaded" 
                          className="w-full max-h-[400px] object-contain rounded-lg"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 border-white/10 text-white hover:bg-black/80"
                          onClick={onClearUserPhoto}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        {isUsingOliviaImage && (
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            Olivia
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="clothing" className="mt-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    {!clothingPhoto ? (
                      <div className="py-6">
                        <Shirt className="h-12 w-12 mx-auto text-white/40 mb-4" />
                        <p className="text-white/70 mb-6">Upload a clothing item to try it on</p>
                        
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleClothingPhotoUpload}
                          />
                          <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-4 py-2 text-sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Clothing
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={clothingPhoto} 
                          alt="Clothing" 
                          className="w-full max-h-[400px] object-contain rounded-lg"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 border-white/10 text-white hover:bg-black/80"
                          onClick={() => onClothingPhotoUpload(new File([], ""))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                  disabled={!userPhoto || !clothingPhoto || isProcessing}
                  onClick={onTryOn}
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  {isProcessing ? 'Processing...' : 'Try It On'}
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white"
                  onClick={onClearPhotos}
                >
                  Clear All
                </Button>
              </div>
              
              {generationError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-sm text-red-200">
                  <p>Error generating image: {generationError}</p>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Preview</h2>
                
                {finalImage && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white/70 hover:text-white"
                      onClick={onSaveLook}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    
                    {!isPremiumUser && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white/70 hover:text-white"
                        onClick={onShowPremiumPopup}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Premium
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              <VirtualFittingRoom 
                finalImage={finalImage}
                outfit={mockOutfit}
                clothingItems={selectedItems}
                isProcessing={isProcessing}
                userPhoto={userPhoto}
                clothingPhoto={clothingPhoto}
                className="h-full"
                onSaveLook={onSaveLook}
                isOliviaImage={isUsingOliviaImage}
              />
              
              {/* AI Styling Tip */}
              <AnimatePresence>
                {stylingTip && finalImage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring" }}
                    className="mt-4 p-3 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg border border-purple-500/20"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs">OB</span>
                      </div>
                      <div>
                        <p className="text-white/90 text-sm">{stylingTip}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {!isPremiumUser && !userPhoto && activeTab === 'photo' && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm">Premium members can try unlimited outfits and get personalized AI styling advice.</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-purple-400/30 text-white hover:bg-white/10 whitespace-nowrap ml-3"
                  onClick={onShowPremiumPopup}
                >
                  <Lock className="h-3.5 w-3.5 mr-1.5" />
                  Upgrade
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UploadPanel;
