
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { sampleOutfits } from '@/lib/wardrobeData';
import { Outfit, ClothingItem } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import FittingRoomPhotoSection from '@/components/fitting-room/FittingRoomPhotoSection';
import OutfitSelectionSection from '@/components/fitting-room/OutfitSelectionSection';
import TryOnExperience from '@/components/fitting-room/TryOnExperience';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { CircleMinus, CirclePlus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const FittingRoom = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isUsingOliviaImage, setIsUsingOliviaImage] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isProcessingTryOn, setIsProcessingTryOn] = useState(false);
  const [personalOutfits, setPersonalOutfits] = useState<Outfit[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [showTryOnOptions, setShowTryOnOptions] = useState(false);
  
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  
  // Load personal outfits (simulated)
  useEffect(() => {
    // In a real app, this would fetch from a database
    // For now, filter sample outfits to simulate personal ones
    const userOutfits = sampleOutfits.filter(outfit => 
      outfit.name.includes('Casual') || outfit.name.includes('Office')
    );
    setPersonalOutfits(userOutfits);
  }, []);

  const handleUserPhotoUpload = (photo: string) => {
    setUserPhoto(photo);
    setIsUsingOliviaImage(false);
    setFinalImage(null);
    setSelectedOutfit(null);
  };

  const handleSelectOliviaImage = (imageSrc: string) => {
    setUserPhoto(imageSrc);
    setIsUsingOliviaImage(true);
    setFinalImage(null);
    setSelectedOutfit(null);
  };

  const handleSelectOutfit = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setIsProcessingTryOn(true);
    setFinalImage(null);
    
    // Simulate processing delay
    setTimeout(() => {
      setFinalImage(userPhoto);
      setIsProcessingTryOn(false);
    }, 1000);
  };

  const handleSwapItem = (oldItem: ClothingItem, newItem: ClothingItem) => {
    if (!selectedOutfit) return;
    
    // Create a new outfit with the swapped item
    const updatedOutfit = {
      ...selectedOutfit,
      items: selectedOutfit.items.map(id => 
        id === oldItem.id ? newItem.id : id
      )
    };
    
    setSelectedOutfit(updatedOutfit);
    
    // Simulate try-on update
    setIsProcessingTryOn(true);
    setTimeout(() => {
      setIsProcessingTryOn(false);
      toast.success(`Swapped ${oldItem.name} with ${newItem.name}`);
    }, 800);
  };

  const handleSaveLook = () => {
    if (!finalImage || !selectedOutfit) {
      toast.error('Please select an outfit first');
      return;
    }
    
    toast.success('Look saved to your collection!');
  };

  const handleClearSelection = () => {
    setSelectedOutfit(null);
    setFinalImage(null);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleToggleFilters = () => {
    setShowAllFilters(!showAllFilters);
  };

  const filteredOutfits = activeFilter 
    ? personalOutfits.filter(outfit => 
        outfit.seasons.includes(activeFilter as any) || 
        outfit.occasions?.includes(activeFilter as any)
      )
    : personalOutfits;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-24 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
            Fitting Room
          </h1>
          <p className="text-white/70 max-w-xl mx-auto mt-2">
            Try on outfits from your personal wardrobe and see how they look on you
          </p>
        </motion.div>

        {/* Photo Upload Section (Always visible) */}
        {!userPhoto ? (
          <FittingRoomPhotoSection
            onUserPhotoUpload={handleUserPhotoUpload}
            onSelectOliviaImage={handleSelectOliviaImage}
          />
        ) : (
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {/* Left: Photo & Try-On Section */}
            <div className={isMobile ? 'order-2' : 'col-span-1 sticky top-24 self-start'}>
              <TryOnExperience
                userPhoto={userPhoto}
                finalImage={finalImage}
                selectedOutfit={selectedOutfit}
                isProcessingTryOn={isProcessingTryOn}
                isUsingOliviaImage={isUsingOliviaImage}
                onSaveLook={handleSaveLook}
                onClearSelection={handleClearSelection}
                onToggleOptions={() => setShowTryOnOptions(!showTryOnOptions)}
                showOptions={showTryOnOptions}
                onHandleSwapItem={handleSwapItem}
              />
            </div>
            
            {/* Right: Outfit Selection */}
            <div className={isMobile ? 'order-1' : 'col-span-2'}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Outfits</h2>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 border-white/20 hover:bg-white/10"
                    onClick={handleToggleFilters}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {showAllFilters ? (
                      <CircleMinus className="h-4 w-4 ml-1" />
                    ) : (
                      <CirclePlus className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              <AnimatePresence>
                {showAllFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
                      <h3 className="text-sm font-medium mb-2">Filter By:</h3>
                      <div className="flex flex-wrap gap-2">
                        {['summer', 'winter', 'spring', 'autumn', 'casual', 'formal', 'business'].map(filter => (
                          <Button
                            key={filter}
                            variant="outline"
                            size="sm"
                            className={`capitalize text-xs px-3 py-1 h-7 ${
                              activeFilter === filter 
                                ? 'bg-purple-600 border-purple-400 text-white' 
                                : 'bg-transparent border-white/20 text-white/70 hover:bg-white/10'
                            }`}
                            onClick={() => handleFilterChange(filter)}
                          >
                            {filter}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isMobile ? (
                // Mobile: Tabs for categories + horizontal carousels
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4 bg-black/30 border border-white/10">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="casual">Casual</TabsTrigger>
                    <TabsTrigger value="formal">Formal</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0">
                    <OutfitSelectionSection 
                      outfits={filteredOutfits}
                      selectedOutfit={selectedOutfit}
                      onSelectOutfit={handleSelectOutfit}
                      isMobile={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="casual" className="mt-0">
                    <OutfitSelectionSection 
                      outfits={filteredOutfits.filter(o => o.occasions?.includes('casual'))}
                      selectedOutfit={selectedOutfit}
                      onSelectOutfit={handleSelectOutfit}
                      isMobile={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="formal" className="mt-0">
                    <OutfitSelectionSection 
                      outfits={filteredOutfits.filter(o => o.occasions?.includes('formal'))}
                      selectedOutfit={selectedOutfit}
                      onSelectOutfit={handleSelectOutfit}
                      isMobile={true}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                // Desktop: Grid layout
                <OutfitSelectionSection 
                  outfits={filteredOutfits}
                  selectedOutfit={selectedOutfit}
                  onSelectOutfit={handleSelectOutfit}
                  isMobile={false}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FittingRoom;
