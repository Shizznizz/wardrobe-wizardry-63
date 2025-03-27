import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Camera, 
  Heart, 
  Download, 
  Share2, 
  Star, 
  ShoppingBag, 
  CircleChevronLeft, 
  CircleChevronRight, 
  Lock, 
  Unlock,
  ChevronDown,
  GalleryVertical,
  Plus
} from 'lucide-react';
import OliviaTips from '@/components/OliviaTips';
import OutfitSelector from '@/components/OutfitSelector';
import VirtualFittingRoom from '@/components/VirtualFittingRoom';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { ClothingItem, Outfit } from '@/lib/types';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import RecommendedOutfit from '@/components/outfits/RecommendedOutfit';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useOutfitState } from '@/hooks/use-outfit-state';

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
  const [selectedCollection, setSelectedCollection] = useState('recommended');
  const [isPremiumUser] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [afterUploadView, setAfterUploadView] = useState<'olivia-pick' | 'user-outfits' | null>(null);

  const {
    outfits,
    clothingItems, 
    selectedOutfit,
    userPhoto,
    finalImage,
    isProcessingTryOn,
    handleUserPhotoChange,
    handleClearUserPhoto,
    handleTryOnOutfit
  } = useOutfitState(sampleOutfits, sampleClothingItems);

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    const collection = fashionCollections.find(c => c.id === collectionId);
    if (collection && collection.outfits.length > 0) {
      // Don't auto-select the outfit here anymore, just change the collection
      // setSelectedOutfit(collection.outfits[0]);
    }
  };

  const handleAfterPhotoUpload = (photoUrl: string) => {
    handleUserPhotoChange(photoUrl);
    toast.success('Photo uploaded successfully!');
    
    const recommendedCollection = fashionCollections.find(c => c.id === 'recommended');
    if (recommendedCollection && recommendedCollection.outfits.length > 0) {
      // We don't auto try-on anymore, just set the afterUploadView
      // setSelectedOutfit(recommendedCollection.outfits[0]);
    }
    
    setAfterUploadView('olivia-pick');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleAfterPhotoUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSelectOutfit = (outfit: Outfit) => {
    // When an outfit is selected, try it on
    handleTryOnOutfit(outfit);
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

  const handleViewChange = (view: 'olivia-pick' | 'user-outfits') => {
    setAfterUploadView(view);
    
    if (view === 'olivia-pick') {
      handleCollectionChange('recommended');
    } else if (view === 'user-outfits') {
      handleCollectionChange('wardrobe');
    }
  };

  const userOutfits = sampleOutfits.slice(0, 3);
  const oliviasRecommendedOutfit = fashionCollections[0].outfits[0];

  const currentCollection = fashionCollections.find(c => c.id === selectedCollection) || fashionCollections[0];
  const isCurrentCollectionPremium = currentCollection?.premium && !isPremiumUser;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-6xl mx-auto">
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
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold mb-4">Virtual Try-On</h2>
                      <VirtualFittingRoom 
                        finalImage={finalImage}
                        outfit={selectedOutfit}
                        clothingItems={sampleClothingItems}
                        isProcessing={isProcessingTryOn}
                        userPhoto={userPhoto}
                        className="flex-grow"
                      />
                      
                      <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
                        <Button 
                          onClick={handleSaveLook}
                          disabled={!finalImage || isProcessingTryOn}
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
          
          {userPhoto && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <Card className="glass-dark border-white/10 overflow-hidden">
                <CardContent className="p-6">
                  <Tabs defaultValue={afterUploadView || 'olivia-pick'} className="mb-6">
                    <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-slate-800/50">
                      <TabsTrigger 
                        value="olivia-pick" 
                        onClick={() => handleViewChange('olivia-pick')}
                        className="data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-500"
                      >
                        Olivia's Pick
                      </TabsTrigger>
                      <TabsTrigger 
                        value="user-outfits" 
                        onClick={() => handleViewChange('user-outfits')}
                        className="data-[state=active]:bg-gradient-to-r from-purple-600 to-pink-500"
                      >
                        Your Outfits
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="olivia-pick" className="mt-6">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                          <Avatar className="h-12 w-12 border-2 border-purple-400/30">
                            <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-semibold">Olivia's Pick For You</h3>
                            <p className="text-white/70 text-sm">Based on today's weather and your style preferences</p>
                          </div>
                        </div>
                        
                        {oliviasRecommendedOutfit && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 bg-slate-800/50 rounded-lg p-4 border border-white/10">
                              <h4 className="font-medium mb-2">{oliviasRecommendedOutfit.name}</h4>
                              <motion.div 
                                className="aspect-square rounded-lg overflow-hidden bg-black/20 mb-3 relative group"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
                                  <ShoppingBag className="h-16 w-16 text-white/30" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-black/40 text-white border-white/30 hover:bg-black/60 hover:border-white/50"
                                    onClick={() => handleSelectOutfit(oliviasRecommendedOutfit)}
                                  >
                                    Preview On Me
                                  </Button>
                                </div>
                              </motion.div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {oliviasRecommendedOutfit.seasons.map((season) => (
                                  <span key={season} className="text-xs px-2 py-1 bg-white/10 rounded-full capitalize">
                                    {season}
                                  </span>
                                ))}
                              </div>
                              <Button 
                                onClick={() => handleSelectOutfit(oliviasRecommendedOutfit)}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              >
                                Try This On
                              </Button>
                            </div>
                            
                            <div className="md:col-span-2 bg-slate-800/50 rounded-lg p-4 border border-white/10">
                              <h4 className="font-medium mb-3">Why This Look Works For You</h4>
                              <p className="text-white/80 mb-4">
                                This outfit is perfect for today's weather and complements your style profile. 
                                The colors harmonize with your preferred palette, and the pieces work well together 
                                for both comfort and style.
                              </p>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {oliviasRecommendedOutfit.occasions?.map((occasion, index) => (
                                  <div key={index} className="bg-white/5 rounded p-3 text-center">
                                    <p className="text-sm font-medium capitalize">{occasion}</p>
                                    <p className="text-xs text-white/60">Perfect For</p>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <h5 className="text-sm font-medium mb-2">Other outfits you might like:</h5>
                                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
                                  {fashionCollections[0].outfits.slice(1, 4).map((outfit) => (
                                    <motion.div 
                                      key={outfit.id}
                                      className="flex-shrink-0 w-20 aspect-square bg-black/20 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all duration-200"
                                      onClick={() => handleSelectOutfit(outfit)}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="h-full w-full flex items-center justify-center">
                                        <ShoppingBag className="h-8 w-8 text-white/30" />
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="user-outfits" className="mt-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">Your Created Outfits</h3>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <GalleryVertical className="h-4 w-4 mr-2" />
                                View As
                                <ChevronDown className="h-4 w-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                                Grid View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                                List View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {userOutfits.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {userOutfits.map((outfit) => (
                              <motion.div 
                                key={outfit.id} 
                                className="bg-slate-800/50 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer"
                                onClick={() => handleSelectOutfit(outfit)}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <div className="aspect-square relative bg-gradient-to-br from-slate-900 to-slate-800">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <ShoppingBag className="h-16 w-16 text-white/30" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="bg-black/40 text-white border-white/30 hover:bg-black/60 hover:border-white/50"
                                    >
                                      Try On Now
                                    </Button>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium truncate">{outfit.name}</h4>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {outfit.seasons.slice(0, 2).map((season, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-white/10 rounded-full capitalize">
                                        {season}
                                      </span>
                                    ))}
                                    {outfit.seasons.length > 2 && (
                                      <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                                        +{outfit.seasons.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            
                            {isPremiumUser ? (
                              <div className="flex items-center justify-center bg-white/5 rounded-lg border border-dashed border-white/20 aspect-square cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="text-center p-4">
                                  <Plus className="h-10 w-10 text-purple-400 mx-auto mb-2" />
                                  <p className="text-white/70">Create New Outfit</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center bg-slate-800/50 rounded-lg border border-white/10 aspect-square relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                                <div className="text-center p-4 relative z-10">
                                  <Lock className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                                  <p className="text-white font-medium">Premium Feature</p>
                                  <Button 
                                    size="sm" 
                                    onClick={handleUpgradeToPremium}
                                    className="mt-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 text-white"
                                  >
                                    Unlock
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-10 bg-slate-800/30 rounded-lg border border-white/10">
                            <p className="text-white/70 mb-4">You haven't created any outfits yet</p>
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
                              Create Your First Outfit
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
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
      
      {showTips && (
        <OliviaTips position="bottom-right" />
      )}
    </div>
  );
};

export default Showroom;
