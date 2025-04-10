
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Trash2, Upload, User, Camera, Image, ShoppingBag, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Outfit, ClothingItem } from '@/lib/types';
import OliviaMoodAvatar from './OliviaMoodAvatar';
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
  customSlot?: React.ReactNode;
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
  onShowPremiumPopup,
  customSlot
}: UploadPanelProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('upload');
  const clothingPhotoInputRef = useRef<HTMLInputElement>(null);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUserPhotoUpload(file);
    }
  };

  const handleClothingPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onClothingPhotoUpload(file);
    }
  };

  const handleTabClick = () => {
    userPhotoInputRef.current?.click();
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUserPhotoUpload(file);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Create Your Look
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left Panel - Upload */}
        <Card className="border-0 shadow-soft bg-slate-900/40 border border-blue-500/20 backdrop-blur-lg overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList 
                className="grid grid-cols-1 w-full bg-gradient-to-r from-pink-500 to-purple-600 overflow-hidden relative group cursor-pointer"
                onClick={handleTabClick}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <TabsTrigger 
                  value="upload" 
                  className="data-[state=active]:bg-transparent relative z-10 pointer-events-none"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-sm sm:text-base text-white"
                  >
                    Upload Your Photo or Choose Olivia
                  </motion.span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4 space-y-6">
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Label htmlFor="userPhoto" className="text-lg font-medium text-blue-100">Your Photo</Label>
                  <div 
                    className={`relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg border ${isDragging ? 'border-purple-500/50 bg-purple-900/20' : 'border-purple-500/20'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {userPhoto ? (
                      <div className="relative">
                        <img 
                          src={userPhoto} 
                          alt="Your photo" 
                          className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Button 
                          variant="secondary" 
                          className="absolute bottom-4 right-4 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => userPhotoInputRef.current?.click()}
                        >
                          Change Photo
                        </Button>
                        {isUsingOliviaImage && (
                          <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Olivia's Image
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-lg text-center">
                        <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-muted-foreground text-center mb-6">
                          {isDragging ? 'Drop your image here!' : 'Upload a full-body photo of yourself'}
                        </p>
                        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                            onClick={() => userPhotoInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose Photo
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                            onClick={() => {}}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take a Photo
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={onShowOliviaImageGallery}
                            className="w-full text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-500/50 transition-colors"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Choose an Image of Olivia Bloom
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Input
                    ref={userPhotoInputRef}
                    id="userPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleUserPhotoUpload}
                    className="hidden"
                  />
                </motion.div>
                
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <Label htmlFor="clothingPhoto" className="text-lg font-medium text-blue-100">Clothing Item</Label>
                  <div 
                    className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg border border-purple-500/20"
                    onClick={() => clothingPhotoInputRef.current?.click()}
                  >
                    {clothingPhoto ? (
                      <div className="relative">
                        <img 
                          src={clothingPhoto} 
                          alt="Clothing item" 
                          className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Button 
                          variant="secondary" 
                          className="absolute bottom-4 right-4 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-lg text-center">
                        <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Shirt className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-muted-foreground text-center mb-6">
                          Upload a photo of the clothing item you want to try on
                        </p>
                        <Button 
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:text-purple-100"
                        >
                          Select Clothing
                        </Button>
                      </div>
                    )}
                  </div>
                  <Input
                    ref={clothingPhotoInputRef}
                    id="clothingPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleClothingPhotoUpload}
                    className="hidden"
                  />
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <div className="px-6 py-4 border-t border-white/5 bg-slate-900/50 flex justify-between flex-wrap gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={onTryOn} 
                    disabled={isProcessing || !clothingPhoto || !userPhoto}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 h-10 font-medium shadow-md px-4 transition-all duration-300"
                  >
                    {isProcessing ? 'Processing...' : 'Try On Now'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 text-white border-purple-400/30">
                  <p>Click to place the selected clothing item on your uploaded photo and preview the look.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onClearPhotos}
                    className="border-white/20 text-white hover:bg-white/10 h-10 font-medium transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Photos
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 text-white border-red-400/30">
                  <p>Click to remove the photos and start over.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
        
        {/* Right Panel - Preview */}
        <Card className="border-0 shadow-soft bg-slate-900/40 border border-blue-500/20 backdrop-blur-lg overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-blue-100">Preview Result</h3>
              
              {finalImage && (
                <OliviaMoodAvatar mood={oliviaMood} size="sm" />
              )}
            </div>
            
            <div className="relative rounded-lg overflow-hidden border border-white/10 min-h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              {finalImage ? (
                <div className="relative w-full h-full">
                  <VirtualFittingRoom 
                    finalImage={finalImage}
                    outfit={mockOutfit}
                    clothingItems={selectedItems}
                    isProcessing={isProcessing}
                    userPhoto={userPhoto}
                    onSaveLook={onSaveLook}
                    isOliviaImage={isUsingOliviaImage}
                  />
                  
                  {/* Custom Slot for additional components */}
                  {customSlot}
                </div>
              ) : isProcessing ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 border-t-2 border-purple-500 rounded-full animate-spin"></div>
                  <p className="text-white/80">Processing your virtual try-on...</p>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <Image className="h-16 w-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/80 mb-2">Your styled look will appear here!</p>
                  <p className="text-white/60 text-sm">Upload your photo and select clothing to see the magic.</p>
                </div>
              )}
              
              {generationError && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-900/70 text-white p-3 text-sm">
                  <p className="font-medium">Error generating image</p>
                  <p className="text-white/80 text-xs">{generationError}</p>
                </div>
              )}
            </div>
            
            {finalImage && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={onSaveLook} 
                    variant="outline" 
                    className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:text-pink-200"
                    size="sm"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                    Save Look
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200"
                    size="sm"
                    onClick={() => {}}
                  >
                    <Image className="h-3.5 w-3.5 mr-1.5" />
                    Download Image
                  </Button>
                  
                  {!isPremiumUser && (
                    <Button 
                      variant="outline" 
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                      size="sm"
                      onClick={onShowPremiumPopup}
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Unlock Premium
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadPanel;
