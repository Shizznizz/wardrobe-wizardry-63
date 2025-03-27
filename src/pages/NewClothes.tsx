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
  Shirt, 
  Image, 
  Download, 
  Share2, 
  Trash2, 
  Sparkles, 
  Plus,
  ShoppingBag,
  Heart,
  ArrowRight,
  Lightbulb,
  Star,
  Unlock,
  HelpCircle,
  User
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
import OliviaHelpAvatar from '@/components/OliviaHelpAvatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import OutfitTips, { defaultOutfitTips } from '@/components/outfits/OutfitTips';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';

const NewClothes = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [clothingPhoto, setClothingPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('upload');
  const [isPremiumUser] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [showOliviaImageGallery, setShowOliviaImageGallery] = useState(false);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [showHelpTips, setShowHelpTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const clothingPhotoInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const mockOutfit: Outfit = {
    id: 'new-clothing',
    name: 'New Clothing Preview',
    items: selectedItems.map(item => item.id),
    occasions: ['shopping'],
    seasons: ['all'],
    favorite: false,
    timesWorn: 0,
    dateAdded: new Date()
  };

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

  const handleUserPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserPhoto(event.target?.result as string);
      setFinalImage(null);
      setIsUsingOliviaImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClothingPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setClothingPhoto(event.target?.result as string);
      setFinalImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectOliviaImage = (imageSrc: string) => {
    setUserPhoto(imageSrc);
    setFinalImage(null);
    setIsUsingOliviaImage(true);
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
        type: 'shirt',
        imageUrl: clothingPhoto,
        occasions: ['casual'],
        seasons: ['all'],
        color: 'white',
        material: 'cotton',
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date()
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
    setIsUsingOliviaImage(false);
    toast.success('Photos cleared');
  };

  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
    toast.success('Look saved to your wardrobe!');
  };

  const handleNextTip = () => {
    if (currentTipIndex < defaultOutfitTips.length - 1) {
      setCurrentTipIndex(prevIndex => prevIndex + 1);
    } else {
      setShowHelpTips(false);
      setCurrentTipIndex(0);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      {/* Help Avatar in top right corner */}
      <div className="fixed top-20 right-4 z-50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={() => setShowHelpTips(true)}
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-purple-400/30 shadow-lg hover:border-purple-400/60 transition-all duration-300">
              <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[10px] rounded-full px-1.5 py-0.5 border border-white">
              ?
            </div>
          </div>
          <p className="text-xs text-center mt-1 text-white/70">Need help?</p>
        </motion.div>
      </div>
      
      {/* Help Tips Popup */}
      {showHelpTips && (
        <div className="fixed top-36 right-4 z-40">
          <OutfitTips 
            tips={defaultOutfitTips}
            onShowAssistant={() => {}}
            showAssistant={false}
            onClose={() => {
              setShowHelpTips(false);
              setCurrentTipIndex(0);
            }}
            currentTipIndex={currentTipIndex}
            onNextTip={handleNextTip}
          />
        </div>
      )}
      
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
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border-0 shadow-soft bg-slate-900/40 border border-blue-500/20 backdrop-blur-lg">
                <CardContent className="p-6 space-y-6">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="grid grid-cols-1 w-full bg-slate-800/50">
                      <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600">Photo Upload</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-4 space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="userPhoto" className="text-lg font-medium text-blue-100">Your Photo</Label>
                        
                        <ImageUploader
                          imagePreview={userPhoto}
                          onImageChange={handleUserPhotoUpload}
                          onClearImage={() => {
                            setUserPhoto(null);
                            setFinalImage(null);
                            setIsUsingOliviaImage(false);
                          }}
                          label="Upload a full-body photo of yourself"
                          isOliviaImage={isUsingOliviaImage}
                          onOliviaImageClick={() => setShowOliviaImageGallery(true)}
                          className="border border-blue-500/20 rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="clothingPhoto" className="text-lg font-medium text-blue-100">Clothing Item</Label>
                        
                        <ImageUploader
                          imagePreview={clothingPhoto}
                          onImageChange={handleClothingPhotoUpload}
                          onClearImage={() => {
                            setClothingPhoto(null);
                            setFinalImage(null);
                          }}
                          label="Upload a photo of the clothing item you want to try on"
                          className="border border-purple-500/20 rounded-lg"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleTryOn} 
                        disabled={!userPhoto || !clothingPhoto || isProcessing}
                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-medium shadow-md px-8 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-lg"
                      >
                        {isProcessing ? 'Processing...' : 'Preview on Me'}
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
                        onClick={clearPhotos}
                        className="w-full md:w-auto border-red-500/30 text-red-300 hover:text-red-100 h-12 text-lg font-medium transition-all duration-300 hover:border-red-500/50"
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Clear Photos
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 text-white border-red-400/30">
                      <p>Click to remove the photos and start over.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                isOliviaImage={isUsingOliviaImage}
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
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Button 
                    size="lg"
                    onClick={handleUpgradeToPremium}
                    className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 shadow-lg h-14 px-8 text-lg relative z-10 transition-all duration-300 hover:shadow-amber-500/30 hover:shadow-xl"
                  >
                    <Unlock className="mr-2 h-5 w-5" /> Upgrade to Premium
                  </Button>
                  <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-center text-white/70 mt-4 max-w-md mx-auto">
                Unlock advanced styling and multiple photos with Premium!
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      {/* Olivia Image Gallery Dialog */}
      <OliviaImageGallery 
        isOpen={showOliviaImageGallery}
        onClose={() => setShowOliviaImageGallery(false)}
        onSelectImage={handleSelectOliviaImage}
      />
      
      <OutfitSubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
        onUpgrade={handleUpgradeToPremium}
      />
    </div>
  );
};

export default NewClothes;
