
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ClothingItem, Outfit } from '@/lib/types';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import OutfitSelector from '@/components/OutfitSelector';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';

const VirtualTryOn = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bodyPixModel, setBodyPixModel] = useState<bodyPix.BodyPix | null>(null);

  // Load BodyPix model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        await tf.ready();
        const model = await bodyPix.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2
        });
        setBodyPixModel(model);
        console.log('BodyPix model loaded successfully');
      } catch (error) {
        console.error('Error loading BodyPix model:', error);
        toast.error('Failed to load AI model. Please try again later.');
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
        setFinalImage(null); // Reset final image when new photo is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOutfitSelect = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    toast.success(`Selected outfit: ${outfit.name}`);
  };

  const handleTryOn = async () => {
    if (!userPhoto || !selectedOutfit || !bodyPixModel) {
      toast.error('Please upload a photo and select an outfit');
      return;
    }

    try {
      setIsProcessing(true);
      toast.info('Processing your image. This may take a few moments...');

      // In a real implementation, this would use bodyPix to segment the body
      // and apply the selected outfit to the user's photo
      
      // Simulated processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll just show a placeholder result
      setFinalImage(userPhoto);
      
      toast.success('Virtual try-on complete!');
    } catch (error) {
      console.error('Error in virtual try-on:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-2">Virtual Try-On</h1>
            <p className="text-muted-foreground">
              Upload your photo and try on outfits from your wardrobe
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Photo</h2>
              
              {isModelLoading ? (
                <div className="flex flex-col items-center space-y-4 border rounded-lg p-8">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                  <p className="text-muted-foreground">Loading AI model...</p>
                </div>
              ) : (
                <>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    onClick={handleUploadClick}
                  >
                    {userPhoto ? (
                      <div className="relative w-full max-w-md">
                        <img 
                          src={userPhoto} 
                          alt="User upload" 
                          className="w-full h-auto rounded-lg" 
                        />
                        <Button 
                          variant="secondary" 
                          className="absolute bottom-4 right-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadClick();
                          }}
                        >
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
                        <p className="text-muted-foreground text-center max-w-xs">
                          Take a full-body photo or upload an existing one to try on outfits
                        </p>
                      </>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
              
              {userPhoto && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select an Outfit</h2>
                  <OutfitSelector 
                    outfits={sampleOutfits}
                    clothingItems={sampleClothingItems}
                    onSelect={handleOutfitSelect}
                    selectedOutfitId={selectedOutfit?.id}
                  />
                  
                  <Button 
                    onClick={handleTryOn} 
                    disabled={!selectedOutfit || isProcessing}
                    className="w-full mt-4"
                  >
                    {isProcessing ? 'Processing...' : 'Try On This Outfit'}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Result</h2>
              <VirtualFittingRoom 
                finalImage={finalImage}
                outfit={selectedOutfit}
                clothingItems={sampleClothingItems}
                isProcessing={isProcessing}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default VirtualTryOn;
