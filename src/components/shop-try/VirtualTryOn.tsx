
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClothingItem, Outfit } from '@/lib/types';
import { 
  Upload,
  Camera, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  FileWarning,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import UserPhotoDisplay from '@/components/fitting-room/UserPhotoDisplay';
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
  const [activeTab, setActiveTab] = useState<string>(userPhoto ? 'clothing' : 'photo');
  const [email, setEmail] = useState('');
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'user' | 'clothing') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (type === 'user') {
      onUserPhotoUpload(file);
      setActiveTab('clothing');
    } else {
      onClothingPhotoUpload(file);
    }
    
    // Reset input value so the same file can be uploaded again if needed
    event.target.value = '';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent, type: 'user' | 'clothing') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      if (type === 'user') {
        onUserPhotoUpload(file);
        setActiveTab('clothing');
      } else {
        onClothingPhotoUpload(file);
      }
    }
  };
  
  const getOliviaEmoji = () => {
    switch (oliviaMood) {
      case 'happy': return '😊';
      case 'thinking': return '🤔';
      default: return '👋';
    }
  };
  
  return (
    <section className="py-16 relative" id={id}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center mb-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 px-4 py-1 rounded-full">
            <span className="text-sm font-medium text-white mr-2">Coming Soon</span>
            <Sparkles className="h-4 w-4 text-pink-300" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Virtual Try-On</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            See how clothes look on you before you buy them
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left side - Upload interface */}
          <div className="md:col-span-5">
            <div className="space-y-6">
              {userPhoto ? (
                <UserPhotoDisplay 
                  userPhoto={userPhoto}
                  isUsingOliviaImage={isUsingOliviaImage}
                  onResetPhoto={onClearUserPhoto}
                />
              ) : (
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 mb-4 bg-slate-900/70">
                    <TabsTrigger value="photo">Your Photo</TabsTrigger>
                    <TabsTrigger value="olivia">Use Olivia</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="photo">
                    <Card 
                      className="border-white/10 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'user')}
                    >
                      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                          <Upload className="h-7 w-7 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Upload your photo</h3>
                        <p className="text-sm text-white/60 text-center mb-6 max-w-xs">
                          Drag and drop or click below to upload your photo
                        </p>
                        <div>
                          <label htmlFor="user-photo-upload">
                            <Button 
                              type="button" 
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Choose File
                            </Button>
                            <input 
                              id="user-photo-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleFileUpload(e, 'user')} 
                            />
                          </label>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="olivia">
                    <Card className="border-white/10 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
                      <div className="p-6 text-center">
                        <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-purple-600 to-pink-500 p-1 mb-4">
                          <img 
                            src="/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png" 
                            alt="Olivia" 
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Use Olivia as your model</h3>
                        <p className="text-sm text-white/60 mb-4">
                          See how outfits look on our virtual model
                        </p>
                        <Button 
                          onClick={onShowOliviaImageGallery} 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Choose Olivia Image
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
              
              {userPhoto && !clothingPhoto && (
                <Card 
                  className="border-white/10 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'clothing')}
                >
                  <div className="p-6 flex flex-col items-center justify-center min-h-[260px]">
                    <div className="w-14 h-14 rounded-full bg-pink-900/30 flex items-center justify-center mb-4">
                      <ImageIcon className="h-6 w-6 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Upload clothing item</h3>
                    <p className="text-sm text-white/60 text-center mb-6 max-w-xs">
                      Upload a clothing item to see how it looks on your photo
                    </p>
                    <div>
                      <label htmlFor="clothing-upload">
                        <Button 
                          type="button" 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Choose Clothing
                        </Button>
                        <input 
                          id="clothing-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'clothing')} 
                        />
                      </label>
                    </div>
                  </div>
                </Card>
              )}
              
              {userPhoto && clothingPhoto && (
                <Card className="border-white/10 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Selected Clothing</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          onClothingPhotoUpload(null as any);
                        }} 
                        className="text-white/70 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="relative rounded-lg overflow-hidden aspect-square">
                      <img 
                        src={clothingPhoto} 
                        alt="Selected clothing" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <Button 
                        onClick={onTryOn} 
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Camera className="h-4 w-4 mr-2" />
                            Try It On
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              {generationError && (
                <Card className="border-red-600/30 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
                  <div className="p-4 flex items-start">
                    <FileWarning className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-400 mb-1">Error generating try-on</h4>
                      <p className="text-sm text-white/70">{generationError}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
          
          {/* Right side - Results display */}
          <div className="md:col-span-7">
            <Card className="border-white/10 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden h-full relative">
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10"></div>
              
              <div className="p-3 sm:p-4 h-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                  {stylingTip && finalImage ? (
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg max-w-sm border border-white/20 shadow-xl">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
                            <span className="text-xl">{getOliviaEmoji()}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-white mb-1">Olivia's Tip:</p>
                          <p className="text-sm text-white/80">{stylingTip}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="h-12 w-12 text-pink-500/70 mb-2" />
                        <h3 className="text-xl font-bold">Coming Soon!</h3>
                      </div>
                      <p className="text-white/70 max-w-sm">
                        Our AI-powered virtual try-on feature is currently in development.
                        Stay tuned for the official release!
                      </p>
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
                  className="relative z-0"
                  onSaveLook={onSaveLook}
                  isOliviaImage={isUsingOliviaImage}
                />
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default VirtualTryOn;
