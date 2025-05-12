
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, User } from 'lucide-react';
import UserPhotoDisplay from '@/components/fitting-room/UserPhotoDisplay';

interface ModelSelectionSectionProps {
  userPhoto: string | null;
  isUploading: boolean;
  isUsingOliviaImage: boolean;
  onUserPhotoChange: (photo: string) => void;
  onShowOliviaImageGallery: () => void;
}

const ModelSelectionSection = ({
  userPhoto,
  isUploading,
  isUsingOliviaImage,
  onUserPhotoChange,
  onShowOliviaImageGallery
}: ModelSelectionSectionProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUserPhotoChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    // In a real implementation, this would access the device camera
    // For now, let's just trigger the file input as a fallback
    triggerFileInput();
  };

  // If already uploaded, show the photo instead
  if (userPhoto) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Your Photo</h2>
            
            <UserPhotoDisplay 
              userPhoto={userPhoto} 
              isUsingOliviaImage={isUsingOliviaImage} 
              onResetPhoto={() => onUserPhotoChange('')} 
            />
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline"
                onClick={triggerFileInput}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Upload className="mr-2 h-4 w-4" /> Change Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isUploading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Preparing Your Photo</h2>
            
            <div className="flex flex-col items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <div className="w-12 h-12 border-4 border-t-purple-500 border-purple-300/30 rounded-full animate-spin"></div>
              </motion.div>
              
              <h3 className="text-xl font-medium mb-2 text-white">Getting everything ready...</h3>
              <p className="text-white/70 text-center max-w-md">
                We're preparing your virtual try-on experience. This will just take a moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Choose a Model for Your Virtual Try-On</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Button 1: Choose a Photo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg hover:border-blue-400/30 hover:shadow-blue-400/10"
            >
              <h3 className="text-lg font-medium mb-3 text-blue-200">Choose a Photo</h3>
              <p className="text-white/70 mb-6">
                Upload a photo of yourself to see how outfits look on you
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={triggerFileInput}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 shadow-lg shadow-blue-900/20"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Photo
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Button 2: Take a Photo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg hover:border-green-400/30 hover:shadow-green-400/10"
            >
              <h3 className="text-lg font-medium mb-3 text-green-200">Take a Photo</h3>
              <p className="text-white/70 mb-6">
                Use your device's camera to take a photo right now
              </p>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleTakePhoto}
                  variant="outline"
                  className="w-full border-green-400/30 text-white hover:bg-white/10"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Take a Photo
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Button 3: Use Olivia Bloom */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg hover:border-purple-400/30 hover:shadow-purple-400/10"
            >
              <h3 className="text-lg font-medium mb-3 text-purple-200">Use Olivia Bloom</h3>
              <p className="text-white/70 mb-6">
                Try outfits on our virtual model for a quick look preview
              </p>
              
              <div className="flex items-center justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border border-purple-400/20">
                  <User className="h-10 w-10 text-purple-400" />
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onShowOliviaImageGallery}
                  className="w-full text-sm border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-500/50 transition-colors"
                  variant="outline"
                >
                  <User className="h-5 w-5 mr-2" />
                  Choose an Image of Olivia Bloom
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModelSelectionSection;
