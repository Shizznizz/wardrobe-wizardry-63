
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, Heart, Download, Share2, Star, ShoppingBag, CircleChevronLeft, CircleChevronRight, Lock, Unlock } from 'lucide-react';
import OliviaTips from '@/components/OliviaTips';
import OutfitSelector from '@/components/OutfitSelector';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { ClothingItem, Outfit } from '@/lib/types';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const fashionCollections = [
  {
    id: 'recommended',
    name: 'Olivia\'s Picks',
    description: 'Personalized recommendations based on your style profile',
    outfits: sampleOutfits.slice(0, 4),
  },
  {
    id: 'business',
    name: 'Business Casual',
    description: 'Professional looks that maintain comfort and style',
    outfits: sampleOutfits.slice(2, 6),
  },
  {
    id: 'summer',
    name: 'Summer Breeze',
    description: 'Light and airy ensembles for warm weather',
    outfits: sampleOutfits.slice(1, 5),
  },
  {
    id: 'winter',
    name: 'Winter Formal',
    description: 'Elegant outfits for colder months and special occasions',
    outfits: sampleOutfits.slice(3, 7),
  },
  {
    id: 'wardrobe',
    name: 'Your Wardrobe',
    description: 'Outfits you\'ve created and saved',
    outfits: sampleOutfits.slice(0, 3),
    premium: true,
  },
];

const Showroom = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [selectedCollection, setSelectedCollection] = useState('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isPremiumUser] = useState(false); // In a real app, this would come from user state
  const [showTips, setShowTips] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    const collection = fashionCollections.find(c => c.id === collectionId);
    if (collection && collection.outfits.length > 0) {
      setSelectedOutfit(collection.outfits[0]);
    } else {
      setSelectedOutfit(null);
    }
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserPhoto(e.target?.result as string);
        toast.success('Photo uploaded successfully!');
        
        // Auto-select first outfit if none selected
        if (!selectedOutfit && fashionCollections[0].outfits.length > 0) {
          setSelectedOutfit(fashionCollections[0].outfits[0]);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleSelectOutfit = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    if (userPhoto) {
      processVirtualTryOn(outfit);
    }
  };
  
  const processVirtualTryOn = (outfit: Outfit) => {
    if (!userPhoto) {
      toast.error('Please upload your photo first!');
      return;
    }
    
    setIsProcessing(true);
    setFinalImage(null); // Clear the final image while processing
    
    // Simulate processing delay
    setTimeout(() => {
      setFinalImage(userPhoto); // In a real app, this would be the processed image with the outfit
      setIsProcessing(false);
    }, 2000);
  };
  
  const handleSaveLook = () => {
    if (!finalImage) {
      toast.error('Create a look first!');
      return;
    }
    
    toast.success('Look saved to your wardrobe!');
  };
  
  const handleUpgradeToPremium = () => {
    toast('This would navigate to the premium subscription page', {
      description: 'Unlock unlimited outfit swaps, priority styling, and more!'
    });
  };
  
  // If user selects an outfit and has uploaded a photo, process the virtual try-on
  useEffect(() => {
    if (selectedOutfit && userPhoto) {
      processVirtualTryOn(selectedOutfit);
    }
  }, [selectedOutfit]);
  
  // Find the current collection
  const currentCollection = fashionCollections.find(c => c.id === selectedCollection) || fashionCollections[0];
  const isCurrentCollectionPremium = currentCollection?.premium && !isPremiumUser;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Your Fashion Showroom
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              Discover your unique style story, curated by Olivia Bloom, your personal style advisor.
            </p>
          </motion.div>
          
          {/* Upload Photo Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="glass-dark border-white/10 overflow-hidden">
              <CardContent className="p-8">
                {!userPhoto ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-6 bg-slate-800/50 p-6 rounded-full">
                      <Camera className="h-12 w-12 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Upload Your Photo</h2>
                    <p className="text-white/70 mb-6 text-center max-w-lg">
                      Snap a photo or upload one from your device to see how our outfits look on you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg"
                        onClick={triggerFileUpload}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 shadow-lg"
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
                        size="lg"
                        variant="outline"
                        className="border-purple-400/30 text-white hover:bg-white/10"
                      >
                        <Camera className="mr-2 h-5 w-5" /> Take a Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Virtual Try-On Section */}
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold mb-4">Virtual Try-On</h2>
                      <VirtualFittingRoom 
                        finalImage={finalImage}
                        outfit={selectedOutfit}
                        clothingItems={sampleClothingItems}
                        isProcessing={isProcessing}
                        userPhoto={userPhoto} // Pass the user photo to display when no final image is available
                      />
                      
                      <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
                        <Button 
                          onClick={handleSaveLook}
                          disabled={!finalImage || isProcessing}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <Heart className="mr-2 h-4 w-4" /> Save Look
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={triggerFileUpload}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Change Photo
                        </Button>
                      </div>
                    </div>
                    
                    {/* Outfit Selection Section */}
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Choose an Outfit</h2>
                        {isCurrentCollectionPremium && (
                          <div className="flex items-center text-yellow-500 text-sm">
                            <Lock className="h-4 w-4 mr-1" /> Premium
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                        {fashionCollections.map((collection) => (
                          <Button
                            key={collection.id}
                            variant={selectedCollection === collection.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCollectionChange(collection.id)}
                            className={`whitespace-nowrap ${
                              selectedCollection === collection.id 
                                ? "bg-gradient-to-r from-purple-600 to-pink-500" 
                                : "border-white/20 text-white hover:bg-white/10"
                            } ${collection.premium && !isPremiumUser ? "opacity-70" : ""}`}
                          >
                            {collection.premium && !isPremiumUser && (
                              <Lock className="h-3 w-3 mr-1" />
                            )}
                            {collection.name}
                          </Button>
                        ))}
                      </div>
                      
                      {isCurrentCollectionPremium ? (
                        <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                          <Lock className="h-10 w-10 mx-auto mb-4 text-yellow-500" />
                          <h3 className="text-xl font-medium mb-2">Premium Feature</h3>
                          <p className="text-white/70 mb-4">
                            Upgrade to unlock access to your personal wardrobe and unlimited outfit swaps.
                          </p>
                          <Button 
                            onClick={handleUpgradeToPremium}
                            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 text-white"
                          >
                            <Unlock className="mr-2 h-4 w-4" /> Unlock Premium
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col">
                          <OutfitSelector
                            outfits={currentCollection.outfits}
                            clothingItems={sampleClothingItems}
                            onSelect={handleSelectOutfit}
                            selectedOutfitId={selectedOutfit?.id}
                          />
                          
                          <div className="mt-4 flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="rounded-full h-9 w-9 border-white/20 text-white hover:bg-white/10"
                            >
                              <CircleChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="rounded-full h-9 w-9 border-white/20 text-white hover:bg-white/10"
                            >
                              <CircleChevronRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Premium Features Section */}
          {!isPremiumUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card className="glass-dark border-white/10 overflow-hidden bg-gradient-to-r from-slate-900/90 to-purple-950/90">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-yellow-500/20">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-semibold">Unlock Premium Features</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="glass-dark rounded-lg p-5 border border-white/5">
                      <Upload className="h-5 w-5 mb-3 text-purple-400" />
                      <h3 className="text-lg font-medium mb-2">Multiple Photos</h3>
                      <p className="text-white/70 text-sm">
                        Upload multiple photos and try on different outfits for various occasions.
                      </p>
                    </div>
                    <div className="glass-dark rounded-lg p-5 border border-white/5">
                      <ShoppingBag className="h-5 w-5 mb-3 text-purple-400" />
                      <h3 className="text-lg font-medium mb-2">Exclusive Collections</h3>
                      <p className="text-white/70 text-sm">
                        Access to premium outfit collections created by expert stylists.
                      </p>
                    </div>
                    <div className="glass-dark rounded-lg p-5 border border-white/5">
                      <Heart className="h-5 w-5 mb-3 text-purple-400" />
                      <h3 className="text-lg font-medium mb-2">Advanced Styling</h3>
                      <p className="text-white/70 text-sm">
                        Resize, reposition, and customize outfits for a perfect virtual try-on.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      size="lg"
                      onClick={handleUpgradeToPremium}
                      className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 shadow-lg"
                    >
                      <Unlock className="mr-2 h-5 w-5" /> Upgrade to Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Olivia Tips Component */}
      {showTips && (
        <OliviaTips position="bottom-right" />
      )}
    </div>
  );
};

export default Showroom;
