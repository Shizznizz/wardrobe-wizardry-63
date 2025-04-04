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
import { Card, CardContent } from '@/components/ui/card';
import BackgroundShapes from '@/components/BackgroundShapes';
import VerticalStepCards from '@/components/VerticalStepCards';
import { Lightbulb } from 'lucide-react';

const USER_PHOTO_STORAGE_KEY = 'userVirtualTryOnPhoto';

const VirtualTryOn = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bodyPixModel, setBodyPixModel] = useState<bodyPix.BodyPix | null>(null);

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

  useEffect(() => {
    const savedPhoto = localStorage.getItem(USER_PHOTO_STORAGE_KEY);
    if (savedPhoto) {
      setUserPhoto(savedPhoto);
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoData = event.target?.result as string;
        setUserPhoto(photoData);
        setFinalImage(null);
        
        try {
          localStorage.setItem(USER_PHOTO_STORAGE_KEY, photoData);
        } catch (error) {
          console.error('Error saving photo to localStorage:', error);
          toast.error('Unable to save your photo for future sessions. The photo will be available only for this session.');
        }
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

      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <BackgroundShapes />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              See How You Shine in Our Styles
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Upload your photo and experience our revolutionary virtual fitting room. 
              Try on any outfit from your wardrobe instantly — no changing room needed!
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {/* Olivia Bloom Tip */}
              <div className="neo-blur p-4 rounded-xl border border-white/10 mb-6">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-full">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Styling Tip</h3>
                    <p className="text-sm text-white/80 mt-1">
                      For the best results, upload a photo with neutral lighting and a simple background. Stand in a natural pose facing the camera.
                    </p>
                  </div>
                </div>
              </div>
              
              <Card className="bg-transparent overflow-hidden border-0 shadow-xl">
                <CardContent className="p-0">
                  {isModelLoading ? (
                    <div className="flex flex-col items-center space-y-4 neo-blur rounded-lg p-8">
                      <Skeleton className="h-32 w-32 rounded-full bg-white/5" />
                      <Skeleton className="h-4 w-48 bg-white/5" />
                      <p className="text-white/70">Loading AI model...</p>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg"
                        onClick={handleUploadClick}
                      >
                        {userPhoto ? (
                          <div className="relative w-full">
                            <img 
                              src={userPhoto} 
                              alt="Your uploaded photo" 
                              className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-102" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70 group-hover:opacity-80 transition-opacity"></div>
                            <Button 
                              variant="secondary" 
                              className="absolute bottom-4 right-4 shadow-md border border-white/20 bg-white/10 text-white hover:bg-white/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUploadClick();
                              }}
                            >
                              Change Photo
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-10 rounded-lg text-center border border-white/10">
                            <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Upload Your Photo</h3>
                            <p className="text-white/70 text-center max-w-xs mx-auto mb-6">
                              Take a full-body photo or upload one to see how our styles look on you in seconds
                            </p>
                            <Button 
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                            >
                              Select an Image
                            </Button>
                          </div>
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
                </CardContent>
              </Card>
              
              {userPhoto && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Select an Outfit</h2>
                  <OutfitSelector 
                    outfits={sampleOutfits}
                    clothingItems={sampleClothingItems}
                    onSelect={handleOutfitSelect}
                    selectedOutfitId={selectedOutfit?.id}
                  />
                  
                  <Button 
                    onClick={handleTryOn} 
                    disabled={!selectedOutfit || isProcessing}
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-12 text-lg font-medium shadow-md border border-white/10"
                  >
                    {isProcessing ? 'Processing...' : 'Try On This Outfit'}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold text-white">Result</h2>
              <VirtualFittingRoom 
                finalImage={finalImage}
                outfit={selectedOutfit}
                clothingItems={sampleClothingItems}
                isProcessing={isProcessing}
              />
              
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">How It Works</h2>
                <VerticalStepCards />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default VirtualTryOn;
