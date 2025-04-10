
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, User, Trash2, Shirt, Heart, Share2, Sparkles } from 'lucide-react';
import VirtualTryOn from './VirtualTryOn';

interface UploadPanelProps {
  userPhoto: string | null;
  clothingPhoto: string | null;
  isProcessing: boolean;
  isUsingOliviaImage: boolean;
  finalImage: string | null;
  effectivePremiumUser: boolean;
  onUserPhotoUpload: (file: File) => void;
  onClothingPhotoUpload: (file: File) => void;
  onClearPhotos: () => void;
  onTryOn: () => void;
  onShowOliviaImageGallery: () => void;
  onSaveLook: () => void;
}

const UploadPanel = ({
  userPhoto,
  clothingPhoto,
  isProcessing,
  isUsingOliviaImage,
  finalImage,
  effectivePremiumUser,
  onUserPhotoUpload,
  onClothingPhotoUpload,
  onClearPhotos,
  onTryOn,
  onShowOliviaImageGallery,
  onSaveLook
}: UploadPanelProps) => {
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const clothingPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUserPhotoUpload(file);
    }
  };

  const handleClothingPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onClothingPhotoUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your Virtual Fitting Room
        </motion.h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Upload Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-slate-900/40 border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Your Photo</h3>
                
                {/* User Photo Upload Section */}
                <div className="relative overflow-hidden rounded-lg border border-purple-500/20 group cursor-pointer">
                  {userPhoto ? (
                    <div className="relative aspect-[3/4] max-h-80 overflow-hidden">
                      <img 
                        src={userPhoto} 
                        alt="Your photo" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => userPhotoInputRef.current?.click()}
                          className="bg-black/50 text-white border-white/30 hover:bg-white/20"
                        >
                          Change Photo
                        </Button>
                      </div>
                      {isUsingOliviaImage && (
                        <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Olivia's Avatar
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center aspect-[3/4]"
                      onClick={() => userPhotoInputRef.current?.click()}
                    >
                      <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-white/70 text-center mb-6">
                        Upload a photo to see how clothes look on you
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
                          Choose Olivia as Model
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={userPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUserPhotoChange}
                  className="hidden"
                />
                
                {/* Clothing Photo Upload Section */}
                <h3 className="text-lg font-medium text-white mt-6">Clothing Item</h3>
                <div className="relative overflow-hidden rounded-lg border border-purple-500/20 group cursor-pointer">
                  {clothingPhoto ? (
                    <div className="relative aspect-video max-h-60 overflow-hidden">
                      <img 
                        src={clothingPhoto} 
                        alt="Clothing item" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => clothingPhotoInputRef.current?.click()}
                          className="bg-black/50 text-white border-white/30 hover:bg-white/20"
                        >
                          Change Item
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center aspect-video"
                      onClick={() => clothingPhotoInputRef.current?.click()}
                    >
                      <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Shirt className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-white/70 text-center mb-6">
                        Upload a clothing item you want to try on
                      </p>
                      <Button 
                        variant="outline"
                        className="border-purple-500/30 text-purple-300 hover:text-purple-100"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select Clothing
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={clothingPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleClothingPhotoChange}
                  className="hidden"
                />
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={onTryOn} 
                    disabled={isProcessing || !userPhoto || !clothingPhoto}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 shadow-md"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Create Style'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onClearPhotos}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Right Side - Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-slate-900/40 border border-white/10 overflow-hidden shadow-xl h-full backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="text-lg font-medium text-white mb-4">Preview</h3>
              
              <VirtualTryOn
                finalImage={finalImage}
                isProcessing={isProcessing}
                userPhoto={userPhoto}
                isOliviaImage={isUsingOliviaImage}
                onSaveLook={onSaveLook}
                effectivePremiumUser={effectivePremiumUser}
              />
              
              {(!userPhoto && !finalImage) && (
                <div className="flex-grow flex items-center justify-center text-center p-8">
                  <div className="max-w-sm">
                    <p className="text-white/60 text-lg mb-2">Your styled look will appear here!</p>
                    <p className="text-white/40 text-sm">Upload your photo and select clothing to see the magic.</p>
                  </div>
                </div>
              )}
              
              {finalImage && (
                <div className="mt-4 flex gap-3">
                  <Button 
                    onClick={onSaveLook}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Save Look
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UploadPanel;
