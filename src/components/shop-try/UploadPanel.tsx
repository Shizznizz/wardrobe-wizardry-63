
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Camera, Trash2, RefreshCw, Save, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Outfit, ClothingItem } from '@/lib/types';
import OliviaMoodAvatar from './OliviaMoodAvatar';

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
  onClothingPhotoUpload: (file: File | string) => void; // Updated to accept string
  onClearUserPhoto: () => void;
  onClearPhotos: () => void;
  onTryOn: () => void;
  onShowOliviaImageGallery: () => void;
  onSaveLook: () => void;
  onAddItem: (item: ClothingItem) => void;
  onShowPremiumPopup: () => void;
  customSlot?: React.ReactNode; // Added customSlot as an optional prop
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
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isImage = file.type.startsWith('image/');
      
      if (isImage) {
        if (!userPhoto) {
          onUserPhotoUpload(file);
        } else if (!clothingPhoto) {
          onClothingPhotoUpload(file);
        }
      }
    }
  };
  
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
  
  return (
    <Card 
      className="relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-950/90 p-6 backdrop-blur-lg"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {dragActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-900/40 backdrop-blur-sm z-10">
          <div className="bg-slate-800/90 rounded-lg p-6 border border-purple-500/50 shadow-xl">
            <Upload className="h-12 w-12 text-purple-400 mx-auto mb-3" />
            <p className="text-white text-center">Drop your image here</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Your Photo</h3>
          
          {!userPhoto ? (
            <div className="relative rounded-lg border-2 border-dashed border-white/20 h-60 flex flex-col items-center justify-center overflow-hidden bg-slate-800/50">
              <Upload className="h-8 w-8 text-white/40 mb-2" />
              <p className="text-sm text-white/60 text-center px-4 mb-2">
                Drag a photo or click to upload
              </p>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <label className="cursor-pointer">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photo
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleUserPhotoChange} 
                    />
                  </label>
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={onShowOliviaImageGallery}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Use Olivia
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-lg h-60 flex items-center justify-center overflow-hidden bg-slate-800/50">
              <img 
                src={userPhoto} 
                alt="User uploaded" 
                className="h-full w-full object-contain" 
              />
              
              <div className="absolute top-2 right-2 flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={onClearUserPhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isUsingOliviaImage && (
                <div className="absolute bottom-2 left-2 bg-black/50 rounded-full px-2 py-1 text-xs text-white/80">
                  Using Olivia as model
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Clothing Item</h3>
          
          {!clothingPhoto ? (
            <div className="relative rounded-lg border-2 border-dashed border-white/20 h-60 flex flex-col items-center justify-center overflow-hidden bg-slate-800/50">
              <Upload className="h-8 w-8 text-white/40 mb-2" />
              <p className="text-sm text-white/60 text-center px-4 mb-2">
                Upload a clothing item or select from collections below
              </p>
              
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Clothing
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleClothingPhotoChange} 
                  />
                </label>
              </Button>
            </div>
          ) : (
            <div className="relative rounded-lg h-60 flex items-center justify-center overflow-hidden bg-slate-800/50">
              <img 
                src={clothingPhoto} 
                alt="Clothing item" 
                className="h-full w-full object-contain" 
              />
              
              <div className="absolute top-2 right-2 flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={() => onClothingPhotoUpload("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Your Look</h3>
          
          {!finalImage ? (
            <div className="relative rounded-lg border-2 border-dashed border-white/20 h-60 flex flex-col items-center justify-center overflow-hidden bg-slate-800/50">
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-white text-sm">Creating your look...</p>
                </div>
              ) : (
                <>
                  <div className="relative mb-2">
                    <OliviaMoodAvatar mood={oliviaMood} size="md" />
                  </div>
                  
                  <p className="text-sm text-white/60 text-center px-4 mb-2">
                    {generationError 
                      ? "Sorry, something went wrong. Please try again." 
                      : "Upload both a photo and clothing to see your styled look"}
                  </p>
                  
                  <Button 
                    onClick={onTryOn}
                    disabled={!userPhoto || !clothingPhoto || isProcessing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Try it On
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="relative rounded-lg h-60 flex items-center justify-center overflow-hidden bg-slate-800/50">
              <img 
                src={finalImage} 
                alt="AI generated look" 
                className="h-full w-full object-contain" 
              />
              
              <div className="absolute top-2 right-2 flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={onClearPhotos}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={onTryOn}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={isPremiumUser ? onSaveLook : onShowPremiumPopup}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              
              {stylingTip && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 flex items-start gap-2"
                >
                  <OliviaMoodAvatar mood="happy" size="sm" />
                  <p className="text-xs text-white">{stylingTip}</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mt-6 gap-4">
        <Button 
          variant="outline" 
          className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={onClearPhotos}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        
        <Button 
          onClick={onTryOn}
          disabled={!userPhoto || !clothingPhoto || isProcessing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>Try it On</>
          )}
        </Button>
      </div>
      
      {/* Render the customSlot if provided */}
      {customSlot}
    </Card>
  );
};

export default UploadPanel;
