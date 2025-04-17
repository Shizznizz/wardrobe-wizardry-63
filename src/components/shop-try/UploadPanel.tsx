
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Shirt, 
  User2, 
  Image, 
  X, 
  Loader2, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Camera,
  Save,
  Plus,
  RefreshCw,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Outfit, ClothingItem } from '@/lib/types';
import { toast } from 'sonner';

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
  customSlot?: React.ReactNode; // Add optional customSlot prop
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
  const [activeTab, setActiveTab] = useState('user-photo');
  
  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUserPhotoUpload(e.target.files[0]);
    }
  };
  
  const handleClothingPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onClothingPhotoUpload(e.target.files[0]);
    }
  };
  
  const getOliviaEmoji = () => {
    switch (oliviaMood) {
      case 'happy': return '😊';
      case 'thinking': return '🤔';
      default: return '🙂';
    }
  };
  
  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <Card className="bg-gray-900/80 border-purple-500/20 shadow-xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-slate-800/80 p-0 h-auto border-b border-white/10">
                <TabsTrigger
                  value="user-photo"
                  className="flex-1 rounded-none py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700/30 data-[state=active]:to-pink-700/30 data-[state=active]:text-white border-b data-[state=active]:border-purple-500 border-transparent"
                >
                  <User2 className="h-4 w-4 mr-2" />
                  Your Photo
                </TabsTrigger>
                <TabsTrigger
                  value="clothing-photo"
                  className="flex-1 rounded-none py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700/30 data-[state=active]:to-pink-700/30 data-[state=active]:text-white border-b data-[state=active]:border-purple-500 border-transparent"
                >
                  <Shirt className="h-4 w-4 mr-2" />
                  Clothing
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user-photo" className="bg-transparent p-6 m-0">
                <div className="flex flex-col items-center justify-center">
                  {!userPhoto ? (
                    <div className="w-full">
                      <div className="border-2 border-dashed border-white/20 rounded-lg py-12 flex flex-col items-center justify-center bg-slate-800/50 mb-4">
                        <div className="mb-4 w-16 h-16 rounded-full bg-purple-700/30 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-purple-300" />
                        </div>
                        <p className="text-white/70 text-center mb-4 max-w-xs">
                          Upload a full-body photo of yourself or choose Olivia as your model
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => document.getElementById('user-photo-upload')?.click()}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={onShowOliviaImageGallery}
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Use Olivia
                          </Button>
                        </div>
                        <input
                          id="user-photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleUserPhotoChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-white/50 text-center">
                        Photos are processed locally. For best results, use a clear, well-lit full-body photo.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="relative overflow-hidden rounded-lg w-full aspect-[3/4] mb-4">
                        <img
                          src={userPhoto}
                          alt="User photo"
                          className="w-full h-full object-cover"
                        />
                        {isUsingOliviaImage && (
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {getOliviaEmoji()} Using Olivia as model
                          </div>
                        )}
                        <button
                          onClick={onClearUserPhoto}
                          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between">
                        <p className="text-xs text-white/60">
                          {isUsingOliviaImage ? 'Using Olivia as your model' : 'Your photo is ready'}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white/60 hover:text-white text-xs h-6 px-2"
                          onClick={() => setActiveTab('clothing-photo')}
                        >
                          Next: Add Clothing <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="clothing-photo" className="bg-transparent p-6 m-0">
                <div className="flex flex-col items-center justify-center">
                  {!clothingPhoto ? (
                    <div className="w-full">
                      <div className="border-2 border-dashed border-white/20 rounded-lg py-12 flex flex-col items-center justify-center bg-slate-800/50 mb-4">
                        <div className="mb-4 w-16 h-16 rounded-full bg-purple-700/30 flex items-center justify-center">
                          <Shirt className="h-8 w-8 text-purple-300" />
                        </div>
                        <p className="text-white/70 text-center mb-4 max-w-xs">
                          Upload a photo of the clothing item you'd like to try on
                        </p>
                        <Button
                          onClick={() => document.getElementById('clothing-photo-upload')?.click()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Clothing
                        </Button>
                        <input
                          id="clothing-photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleClothingPhotoChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-white/50 text-center">
                        For best results, use images with a clear background or product photos.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="relative overflow-hidden rounded-lg w-full aspect-square mb-4">
                        <img
                          src={clothingPhoto}
                          alt="Clothing photo"
                          className="w-full h-full object-contain bg-gray-800"
                        />
                        <button
                          onClick={() => onClothingPhotoUpload(new File([], ""))}
                          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between">
                        <p className="text-xs text-white/60">
                          Clothing photo ready
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white/60 hover:text-white text-xs h-6 px-2"
                          onClick={() => setActiveTab('user-photo')}
                        >
                          <ArrowRight className="h-3 w-3 rotate-180 mr-1" /> Back to Photo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="p-6 pt-0 flex justify-between border-t border-white/10 mt-3">
              <Button 
                variant="outline" 
                className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                onClick={onClearPhotos}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                disabled={!userPhoto || !clothingPhoto || isProcessing}
                onClick={onTryOn}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shirt className="h-4 w-4 mr-2" />
                    Try It On
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="bg-gray-900/80 border-purple-500/20 shadow-xl overflow-hidden h-full">
            <div className="p-6">
              <h3 className="font-medium text-white mb-4 flex items-center">
                <Camera className="h-4 w-4 mr-2 text-purple-400" />
                Preview Result
              </h3>
              
              <div className="rounded-lg overflow-hidden bg-gray-800/60 w-full aspect-[3/4] mb-4 flex items-center justify-center">
                {finalImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={finalImage}
                      alt="Final preview"
                      className="w-full h-full object-cover"
                    />
                    
                    {stylingTip && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm text-white text-sm p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="text-lg mt-1">{getOliviaEmoji()}</span>
                          <p>{stylingTip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6">
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 text-purple-400 animate-spin mb-4" />
                        <p className="text-white/70">Creating your virtual try-on...</p>
                        <p className="text-white/50 text-sm mt-2">This may take a few moments</p>
                      </div>
                    ) : generationError ? (
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="h-10 w-10 text-red-400 mb-4" />
                        <p className="text-white/70">Couldn't generate your try-on</p>
                        <p className="text-red-400/70 text-xs mt-2 max-w-xs">{generationError}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-4 text-white/60"
                          onClick={onTryOn}
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-700/20 flex items-center justify-center mb-4">
                          <Image className="h-8 w-8 text-indigo-300" />
                        </div>
                        <p className="text-white/70">Upload photos and click "Try It On"</p>
                        <p className="text-white/50 text-sm mt-2">Preview will appear here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {finalImage && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    onClick={onSaveLook}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Look
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      if (!isPremiumUser) {
                        onShowPremiumPopup();
                        return;
                      }
                      toast.success('Added to your outfits collection!');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Collection
                  </Button>
                  
                  {isPremiumUser && (
                    <Button 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => toast.success('Copied to clipboard!')}
                    >
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Copy Image
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {mockOutfit && (
              <div className="p-6 pt-0 border-t border-white/10 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-white/90">Outfit Components</h4>
                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    {mockOutfit.occasion}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedItems.length > 0 ? (
                    selectedItems.map((item, index) => (
                      <Badge 
                        key={index} 
                        className="bg-indigo-900/40 hover:bg-indigo-800/60 px-2 py-1 text-xs"
                      >
                        {item.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-white/50">No items selected yet</p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;
