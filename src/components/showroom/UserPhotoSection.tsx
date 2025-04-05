
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserPhotoSectionProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  onUserPhotoChange: (photo: string) => void;
  onShowOliviaImageGallery: () => void;
}

const UserPhotoSection = ({
  userPhoto,
  isUsingOliviaImage,
  onUserPhotoChange,
  onShowOliviaImageGallery
}: UserPhotoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUserPhotoChange(e.target.result as string);
        toast.success('Photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    toast('Camera functionality would open here', {
      description: 'This feature would access your device camera in a real implementation.'
    });
  };

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  }, [onUserPhotoChange]);

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
          
          {!userPhoto ? (
            <div 
              className={`flex flex-col items-center justify-center py-8 flex-grow rounded-lg border-2 border-dashed ${isDragging ? 'border-purple-400 bg-purple-500/10' : 'border-white/10 bg-black/20'} transition-all duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <motion.div 
                className="mb-6 bg-slate-800/50 p-6 rounded-full"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px rgba(176, 132, 240, 0.5)" 
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{ 
                    y: isDragging ? [0, -10, 0] : 0,
                    rotate: isDragging ? [-5, 5, -5, 5, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: isDragging ? Infinity : 0,
                    repeatType: "loop"
                  }}
                >
                  <Camera className="h-12 w-12 text-purple-400" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-medium mb-2">Upload Your Photo</h3>
              <p className="text-white/70 mb-6 text-center max-w-sm px-2">
                {isDragging ? 'Drop your image here!' : 'See how outfits look on you with our virtual try-on feature'}
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs px-4">
                <Button 
                  onClick={triggerFileUpload}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                >
                  <Upload className="mr-2 h-5 w-5" /> Choose Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="outline"
                  className="w-full border-purple-400/30 text-white hover:bg-white/10"
                  onClick={handleTakePhoto}
                >
                  <Camera className="mr-2 h-5 w-5" /> Take a Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={onShowOliviaImageGallery}
                  className="w-full text-sm border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-500/50 transition-colors"
                >
                  <User className="mr-2 h-4 w-4" />
                  Choose an Image of Olivia Bloom
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <motion.div 
                className="relative flex-grow bg-black/20 rounded-lg border border-white/10 overflow-hidden"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <AnimatePresence>
                  <motion.img 
                    key={userPhoto}
                    src={userPhoto} 
                    alt="Your uploaded photo" 
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {isUsingOliviaImage && (
                  <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Olivia's Image
                  </div>
                )}
              </motion.div>
              <div className="flex justify-center mt-4 gap-3">
                <Button 
                  variant="outline"
                  onClick={triggerFileUpload}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="mr-2 h-4 w-4" /> Change Photo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default UserPhotoSection;
