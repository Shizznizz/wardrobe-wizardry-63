
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Download,
  CheckCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import FeedbackLoop from '@/components/shop-try/FeedbackLoop';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

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
  earlyTester: boolean;
  onUserPhotoUpload: (file: File) => void;
  onClothingPhotoUpload: (file: File) => void;
  onClearUserPhoto: () => void;
  onClearPhotos: () => void;
  onTryOn: () => void;
  onShowOliviaImageGallery: () => void;
  onSaveLook: () => void;
  onAddItem: (item: ClothingItem) => void;
  onShowPremiumPopup: () => void;
  onAddToEarlyTesters: (email: string) => void;
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
  earlyTester,
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
  setShowFeedback,
  showFeedback
}: VirtualTryOnProps) => {
  const [activeTab, setActiveTab] = useState('photo');
  const [emailInput, setEmailInput] = useState('');
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

  const handleEarlyTesterSignup = () => {
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    onAddToEarlyTesters(emailInput);
    setEmailInput('');
  };

  return (
    <section className="py-16 relative scroll-mt-24" id={id}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-2 right-0 md:right-1/3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs md:text-sm px-3 py-1 rounded-full font-medium shadow-lg rotate-3 transform">
            Coming Soon
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Virtual Try-On</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Upload your photo and try on clothes before you buy them
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                  
                  {/* Early testers toggle section */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2 mb-3">
                      <Switch id="early-tester" checked={earlyTester} disabled={earlyTester} />
                      <label
                        htmlFor="early-tester"
                        className="text-sm font-medium text-white/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Add me to the early testers list
                      </label>
                    </div>
                    
                    {!earlyTester && (
                      <div className="flex items-center mt-3">
                        <input 
                          type="email" 
                          placeholder="Your email" 
                          className="bg-slate-800/50 border border-white/10 rounded-l-md px-3 py-1.5 text-sm flex-grow focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <Button 
                          variant="default" 
                          size="sm"
                          className="rounded-l-none bg-purple-600 hover:bg-purple-700"
                          onClick={handleEarlyTesterSignup}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                    
                    {earlyTester && (
                      <div className="text-sm flex items-center text-green-300">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        You're on the list! We'll notify you when VTO launches.
                      </div>
                    )}
                  </div>
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
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: stylingTip && finalImage ? 1 : 0, y: stylingTip && finalImage ? 0 : 20 }}
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
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {showFeedback && finalImage && (
          <FeedbackLoop 
            visible={showFeedback}
            outfitName={clothingPhoto ? 'this look' : 'Custom Look'}
            onClose={() => setShowFeedback(false)}
            onFeedbackSubmit={() => {}}
            onSave={onSaveLook}
            isPremium={isPremiumUser}
            onUpgradeToPremium={onShowPremiumPopup}
          />
        )}
      </Container>
    </section>
  );
};

export default VirtualTryOn;
