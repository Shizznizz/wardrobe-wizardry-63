
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Camera, 
  Shirt, 
  Image, 
  Download, 
  Share2, 
  Trash2, 
  Sparkles, 
  Sparkle, 
  Plus,
  ShoppingBag,
  Heart,
  ArrowRight,
  Lightbulb,
  Star,
  Unlock,
} from 'lucide-react';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import ImageUploader from '@/components/wardrobe/ImageUploader';
import { Outfit, ClothingItem } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import OutfitSubscriptionPopup from '@/components/OutfitSubscriptionPopup';
import AdditionalItemsSelector from '@/components/outfits/AdditionalItemsSelector';
import AffiliateProducts from '@/components/outfits/AffiliateProducts';
import RecommendedOutfits from '@/components/outfits/RecommendedOutfits';
import OutfitStylingTips from '@/components/outfits/OutfitStylingTips';

const NewClothes = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('upload');
  const [isPremiumUser] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const clothingPhotoInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const mockOutfit: Outfit = {
    id: 'new-clothing',
    name: 'New Clothing Preview',
    items: selectedItems,
    occasions: ['shopping'],
    seasons: ['all'],
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  };

  // Show subscription popup after first outfit is tried on
  useEffect(() => {
    if (finalImage && !isPremiumUser) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenOutfitSubscriptionPopup');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowSubscriptionPopup(true);
          sessionStorage.setItem('hasSeenOutfitSubscriptionPopup', 'true');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [finalImage, isPremiumUser]);

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
        setFinalImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClothingPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setClothingPhoto(event.target?.result as string);
        setFinalImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      
      video.onloadedmetadata = () => {
        video.play();
        
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        setTimeout(() => {
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          
          const photoDataUrl = canvas.toDataURL('image/png');
          setUserPhoto(photoDataUrl);
          
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          
          toast.success("Photo captured successfully!");
        }, 500);
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions and try again.');
    }
  };

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) {
      toast.error('Please upload both your photo and a clothing photo');
      return;
    }

    try {
      setIsProcessing(true);
      toast.info('Processing your virtual try-on. This may take a few moments...');

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFinalImage(userPhoto);
      setSelectedItems([{
        id: 'main-item',
        name: 'Uploaded Item',
        type: 'top',
        imageUrl: clothingPhoto,
        occasions: ['casual'],
        seasons: ['all']
      }]);
      
      toast.success('Virtual try-on complete!');
    } catch (error) {
      console.error('Error in virtual try-on:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddItem = (item: ClothingItem) => {
    setSelectedItems(prev => [...prev, item]);
    // In a real app, this would trigger a re-render of the outfit preview
    toast.success(`Added ${item.name} to your outfit!`);
  };

  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium subscription page');
    setShowSubscriptionPopup(false);
  };

  const handleShowPremiumPopup = () => {
    setShowSubscriptionPopup(true);
  };

  const clearPhotos = () => {
    setUserPhoto(null);
    setClothingPhoto(null);
    setFinalImage(null);
    setSelectedItems([]);
    toast.success('Photos cleared');
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
    toast.success('Look saved to your wardrobe!');
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                New Clothes Preview
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Visualize how new items will look on you before making any purchase decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                  onClick={handleCapturePhoto}
                >
                  <Camera className="mr-2 h-4 w-4" /> Take a Photo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-400/30 text-white hover:bg-white/10"
                  onClick={() => userPhotoInputRef.current?.click()}
                >
                  <Image className="mr-2 h-4 w-4" /> Upload Images
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <Card className="glass-dark border-white/10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-purple-400/30">
                        <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center">
                          Virtual Try-On Tip
                          <Sparkle className="h-4 w-4 ml-2 text-yellow-300" />
                        </h3>
                        <p className="text-white/70">From Olivia Bloom</p>
                      </div>
                    </div>
                    <p className="text-white/90 italic">
                      "Try before you buy! Upload a photo of yourself and a clothing item you're considering to see how they'll look together before making a purchase."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border-0 shadow-soft bg-slate-900/40 border border-blue-500/20 backdrop-blur-lg">
                <CardContent className="p-6 space-y-6">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full bg-slate-800/50">
                      <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600">Upload Photos</TabsTrigger>
                      <TabsTrigger value="capture" className="data-[state=active]:bg-indigo-600">Capture Photo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4 space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="userPhoto" className="text-lg font-medium text-blue-100">Your Photo</Label>
                        <div 
                          className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg border border-blue-500/20"
                          onClick={() => userPhotoInputRef.current?.click()}
                        >
                          {userPhoto ? (
                            <div className="relative">
                              <img 
                                src={userPhoto} 
                                alt="Your uploaded photo" 
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
                              <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                <Image className="h-8 w-8 text-white" />
                              </div>
                              <p className="text-muted-foreground text-center mb-6">
                                Upload a full-body photo of yourself
                              </p>
                              <Button 
                                variant="outline"
                                className="border-blue-500/30 text-blue-300 hover:text-blue-100"
                              >
                                Select Your Photo
                              </Button>
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
                      </div>
                      
                      <div className="space-y-3">
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
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="capture" className="mt-4">
                      <div className="space-y-6">
                        <div className="rounded-lg overflow-hidden border border-blue-500/20 bg-gradient-to-br from-slate-800 to-slate-900 p-10 text-center">
                          <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-muted-foreground text-center mb-6">
                            Take a photo using your device's camera
                          </p>
                          <Button 
                            variant="default"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            onClick={handleCapturePhoto}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Capture Photo
                          </Button>
                        </div>
                        
                        {userPhoto && (
                          <div className="mt-4">
                            <Label className="text-lg font-medium text-blue-100 mb-2 block">Preview</Label>
                            <div className="relative rounded-lg overflow-hidden">
                              <img 
                                src={userPhoto} 
                                alt="Captured photo" 
                                className="w-full h-auto rounded-lg" 
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <Label htmlFor="clothingPhotoCapture" className="text-lg font-medium text-blue-100">Clothing Item</Label>
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
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <Button 
                  onClick={handleTryOn} 
                  disabled={!userPhoto || !clothingPhoto || isProcessing}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-medium shadow-md px-8"
                >
                  {isProcessing ? 'Processing...' : 'Preview on Me'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={clearPhotos}
                  className="w-full md:w-auto border-red-500/30 text-red-300 hover:text-red-100 h-12 text-lg font-medium"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Clear Photos
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Preview Result</h2>
              <VirtualFittingRoom 
                finalImage={finalImage}
                outfit={finalImage ? mockOutfit : null}
                clothingItems={selectedItems}
                isProcessing={isProcessing}
                userPhoto={userPhoto}
                onSaveLook={handleSaveLook}
              />
              
              {finalImage && (
                <AdditionalItemsSelector 
                  onAddItem={handleAddItem}
                  onPremiumClick={handleShowPremiumPopup}
                  isPremium={isPremiumUser}
                  className="mt-6"
                />
              )}
            </div>
          </motion.div>
          
          {finalImage && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <AffiliateProducts />
              <OutfitStylingTips />
            </motion.div>
          )}
          
          {finalImage && (
            <motion.div variants={itemVariants}>
              <RecommendedOutfits />
            </motion.div>
          )}
          
          {!isPremiumUser && (
            <motion.div 
              variants={itemVariants} 
              className="mt-16 bg-slate-900/40 border border-white/10 rounded-xl p-8 backdrop-blur-lg"
            >
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 flex items-center">
                <Star className="mr-2 h-6 w-6 text-yellow-400" />
                Unlock Premium Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-400/20">
                    <Image className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-blue-200">Multiple Photos</h3>
                  <p className="text-blue-100/80">
                    Upload and try on outfits for multiple photos and occasions. See how different clothing looks in various settings.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-400/20">
                    <ShoppingBag className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium text-purple-200">Exclusive Collections</h3>
                  <p className="text-purple-100/80">
                    Access premium outfit collections curated by expert stylists, featuring the latest trends and timeless classics.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-400/20">
                    <Sparkles className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-medium text-pink-200">Advanced Styling</h3>
                  <p className="text-pink-100/80">
                    Customize outfits with detailed editing tools. Resize, reposition, and adjust colors for a perfect virtual try-on.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button 
                  size="lg"
                  onClick={handleUpgradeToPremium}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 shadow-lg"
                >
                  <Unlock className="mr-2 h-5 w-5" /> Upgrade to Premium
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <OutfitSubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
        onUpgrade={handleUpgradeToPremium}
      />
    </div>
  );
};

export default NewClothes;
