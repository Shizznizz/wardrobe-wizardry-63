
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Sparkles, User, Crown, Info } from 'lucide-react';
import { ClothingItem, Outfit } from '@/lib/types';
import OptimizedImage from '@/components/ui/optimized-image';

interface VirtualTryOnProps {
  id?: string;
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
  onAddToEarlyTesters: () => void;
  earlyTester: boolean;
  setShowFeedback: (show: boolean) => void;
  showFeedback: boolean;
}

const VirtualTryOn = ({
  id,
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
  onShowPremiumPopup,
  onAddToEarlyTesters,
  earlyTester,
  setShowFeedback,
  showFeedback
}: VirtualTryOnProps) => {
  const [activeTab, setActiveTab] = useState("your-photo");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'user' | 'clothing') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'user') {
        onUserPhotoUpload(file);
      } else {
        onClothingPhotoUpload(file);
      }
    }
  };

  return (
    <section id={id} className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Virtual Try-On Preview</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-4">
            Select a photo and preview how outfits might look before buying.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
            <Info className="h-4 w-4" />
            <span>Upload your photo or use Olivia to see outfit previews</span>
          </div>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900/50 border border-white/10">
              <TabsTrigger 
                value="your-photo" 
                className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Your Photo
              </TabsTrigger>
              <TabsTrigger 
                value="use-olivia"
                className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Use Olivia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="your-photo" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 border-white/10">
                <CardContent className="p-8">
                  {userPhoto && !isUsingOliviaImage ? (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="relative">
                          <img 
                            src={userPhoto} 
                            alt="Your photo" 
                            className="w-64 h-80 object-cover rounded-lg border-2 border-white/10"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearUserPhoto}
                            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 border-red-500 text-white"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Badge className="bg-green-600/20 text-green-300 border-green-500/30 mb-4">
                          Photo Ready
                        </Badge>
                        <p className="text-white/70 mb-4">
                          Your photo is ready! Now you can try on different outfits.
                        </p>
                        <div className="flex justify-center gap-4">
                          <Button 
                            onClick={onTryOn}
                            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Try On Outfit
                          </Button>
                          {isPremiumUser && (
                            <Button 
                              onClick={onSaveLook}
                              variant="outline"
                              className="border-white/20 hover:bg-white/10 text-white"
                            >
                              Save Look
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-64 h-80 mx-auto border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center bg-slate-800/30">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-white/40 mx-auto mb-4" />
                          <p className="text-white/60 mb-4">Upload your photo to get started</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'user')}
                            className="hidden"
                            id="user-photo-upload"
                          />
                          <label htmlFor="user-photo-upload">
                            <Button 
                              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white"
                              asChild
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Photo
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                      
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-200">
                            <p className="font-medium mb-1">Coming Soon - Advanced Try-On</p>
                            <p className="text-blue-200/80">
                              We're working on realistic virtual try-on technology. For now, enjoy our style recommendations and outfit previews!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="use-olivia" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 border-white/10">
                <CardContent className="p-8">
                  {userPhoto && isUsingOliviaImage ? (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="relative">
                          <img 
                            src={userPhoto} 
                            alt="Olivia model" 
                            className="w-64 h-80 object-cover rounded-lg border-2 border-pink-500/30"
                          />
                          <Badge className="absolute top-2 left-2 bg-pink-600/80 text-white border-pink-500">
                            <Crown className="h-3 w-3 mr-1" />
                            Olivia
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearUserPhoto}
                            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 border-red-500 text-white"
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Badge className="bg-pink-600/20 text-pink-300 border-pink-500/30 mb-4">
                          Using Olivia as Model
                        </Badge>
                        <p className="text-white/70 mb-4">
                          Perfect! Olivia is ready to show you how outfits look.
                        </p>
                        <div className="flex justify-center gap-4">
                          <Button 
                            onClick={onTryOn}
                            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Try On Outfit
                          </Button>
                          {isPremiumUser && (
                            <Button 
                              onClick={onSaveLook}
                              variant="outline"
                              className="border-white/20 hover:bg-white/10 text-white"
                            >
                              Save Look
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-64 h-80 mx-auto rounded-lg overflow-hidden border-2 border-pink-500/30">
                        <OptimizedImage 
                          src="/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png" 
                          alt="Olivia AI Model" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <Badge className="bg-pink-600/20 text-pink-300 border-pink-500/30 mb-4">
                          AI Model Available
                        </Badge>
                        <p className="text-white/70 mb-4">
                          Use Olivia as your virtual model to see how outfits look.
                        </p>
                        <Button 
                          onClick={onShowOliviaImageGallery}
                          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Use Olivia as Model
                        </Button>
                      </div>
                      
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-purple-200">
                            <p className="font-medium mb-1">Why Use Olivia?</p>
                            <p className="text-purple-200/80">
                              Olivia helps you visualize outfits and styling ideas before making purchase decisions. Perfect for trying new looks!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </Container>
    </section>
  );
};

export default VirtualTryOn;
