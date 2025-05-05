import React, { useState, useEffect } from 'react';
import { useShowroom } from '@/hooks/useShowroom';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, Download, Heart, Info, ArrowUp, Sparkles, 
  Cloud, Sun, Users, Camera, Upload, Check, RefreshCw, X
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClothingSeason, ClothingOccasion, WeatherInfo, Outfit, ClothingItem } from '@/lib/types';
import PageHeader from '@/components/shared/PageHeader';
import OptimizedImage from '@/components/ui/optimized-image';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Import existing components
import WelcomeMessage from '@/components/fitting-room/WelcomeMessage';
import UserPhotoSection from '@/components/showroom/UserPhotoSection';
import ShowroomDialogs from '@/components/showroom/ShowroomDialogs';
import NoOutfitsMessage from '@/components/fitting-room/NoOutfitsMessage';
import OutfitPreviewArea from '@/components/fitting-room/OutfitPreviewArea';
import NoPhotoMessage from '@/components/fitting-room/NoPhotoMessage';
import WardrobeOutfitSelector from '@/components/fitting-room/WardrobeOutfitSelector';
import OliviaRecommendationBox from '@/components/fitting-room/OliviaRecommendationBox';
import OutfitFilters from '@/components/fitting-room/OutfitFilters';
import OutfitCarousel from '@/components/fitting-room/OutfitCarousel';
import UserPhotoDisplay from '@/components/fitting-room/UserPhotoDisplay';
import StyleOfTheDay from '@/components/fitting-room/StyleOfTheDay';
import TrendingLooks from '@/components/fitting-room/TrendingLooks';
import OliviaOutfitPick from '@/components/fitting-room/OliviaOutfitPick';

const FittingRoom = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [userOutfits, setUserOutfits] = useState<Outfit[]>([]);
  const [isLoadingOutfits, setIsLoadingOutfits] = useState(true);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  // Fetch user's outfits from Supabase
  useEffect(() => {
    const fetchUserOutfits = async () => {
      if (!user) return;
      
      setIsLoadingOutfits(true);
      try {
        const { data, error } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching outfits:', error);
          toast.error('Failed to load your outfits');
        } else {
          console.log('Fetched outfits:', data);
          setUserOutfits(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Exception fetching outfits:', err);
      } finally {
        setIsLoadingOutfits(false);
      }
    };

    // Also fetch clothing items
    const fetchClothingItems = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching clothing items:', error);
        } else {
          console.log('Fetched clothing items:', data);
          setClothingItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Exception fetching clothing items:', err);
      }
    };

    fetchUserOutfits();
    fetchClothingItems();
  }, [user]);

  const [photoSide, setPhotoSide] = useState<'left' | 'right'>('left');
  const [showOliviaHint, setShowOliviaHint] = useState(false);
  const [triedOnCount, setTriedOnCount] = useState(0);
  const [showOliviaTips, setShowOliviaTips] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<ClothingOccasion | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isSelectingOutfit, setIsSelectingOutfit] = useState(false);
  const [modelTab, setModelTab] = useState<'upload' | 'olivia'>('upload');
  const [activeFilter, setActiveFilter] = useState<'today' | 'weather' | 'style'>('today');
  
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo>({
    temperature: 22,
    condition: 'Sunny',
    icon: 'sun'
  });

  const {
    isPremiumUser = false,
    showTips = false,
    showSubscriptionPopup = false,
    showOliviaImageGallery = false,
    isUsingOliviaImage = false,
    showStatusBar = false,
    isUploadLoading = false,
    oliviaSuggestion = "",
    clothingItems: showroomClothingItems = [],
    selectedOutfit = null,
    userPhoto = null,
    finalImage = null,
    isProcessingTryOn = false,
    
    handleSelectOliviaImage = () => {},
    handleSelectOutfit = () => {},
    handleUserPhotoUpload = () => {},
    handleSaveLook = () => {},
    handleUpgradeToPremium = () => {},
    handleCloseSubscriptionPopup = () => {},
    resetSelection = () => {},
    handlePreviewNow = () => {},
    setShowOliviaImageGallery = () => {},
    setIsProcessingTryOn,
    setFinalImage,
  } = useShowroom();

  const safeOutfits = Array.isArray(userOutfits) ? userOutfits : [];

  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (userPhoto && !finalImage) {
        setShowOliviaHint(true);
      }
    }, 15000);

    return () => clearTimeout(idleTimer);
  }, [userPhoto, finalImage]);

  useEffect(() => {
    if (triedOnCount >= 3 && showOliviaTips) {
      toast(
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center mr-3">
            <span className="text-white text-sm">OB</span>
          </div>
          <p className="text-sm">
            Looking for something new? Maybe Shop & Try is where your next favorite item is hiding...
          </p>
        </div>,
        {
          duration: 8000,
          action: {
            label: "Go there",
            onClick: () => window.location.href = "/shop-and-try",
          },
        }
      );
    }
  }, [triedOnCount, showOliviaTips]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOutfitPreview = (outfit: Outfit) => {
    if (!outfit) return;
    
    handleSelectOutfit(outfit);
    setTriedOnCount(prev => prev + 1);
    setIsSelectingOutfit(false);

    setTimeout(() => {
      if (userPhoto) {
        setIsProcessingTryOn(true);
        setFinalImage(null);

        if (window.navigator.vibrate) {
          window.navigator.vibrate(100);
        }

        setTimeout(() => {
          setFinalImage(userPhoto);
          setIsProcessingTryOn(false);
          
          toast.success('Virtual try-on complete!', {
            duration: 2000,
            position: isMobile ? 'bottom-center' : 'top-center',
            className: isMobile 
              ? 'bg-purple-600 text-white rounded-full shadow-lg bottom-4' 
              : ''
          });
        }, 1500);
      } else {
        toast.info('Please select a photo first or use Olivia as your model', {
          position: isMobile ? 'bottom-center' : 'top-center'
        });
      }
    }, 100);
  };

  const handleDownload = async () => {
    if (!finalImage) return;
    
    try {
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitting-room-preview.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (!finalImage) return;
    
    try {
      if (navigator.share) {
        const response = await fetch(finalImage);
        const blob = await response.blob();
        const file = new File([blob], 'fitting-room-preview.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Outfit Preview',
          text: 'Check out this outfit I created!',
          files: [file]
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Sharing is not supported on this device');
    }
  };

  const toggleOliviaTips = () => {
    setShowOliviaTips(!showOliviaTips);
    toast.success(showOliviaTips 
      ? "Olivia's style tips are now hidden" 
      : "Olivia's style tips are now enabled");
  };

  const handleSeasonChange = (season: ClothingSeason) => {
    setSelectedSeason(prev => prev === season ? null : season);
  };

  const handleOccasionChange = (occasion: ClothingOccasion) => {
    setSelectedOccasion(prev => prev === occasion ? null : occasion);
  };

  const toggleFavorites = () => {
    setShowFavoritesOnly(prev => !prev);
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByTag = (tag: string) => {
    if (tag === 'weather') {
      const temp = currentWeather?.temperature || 20;
      let season: ClothingSeason = 'summer';
      
      if (temp < 10) season = 'winter';
      else if (temp < 20) season = 'autumn';
      else if (temp < 25) season = 'spring';
      
      handleSeasonChange(season);
    } else if (tag === 'style') {
      handleAssistantAction();
    }
  };

  const handleStartOutfitSelection = () => {
    setIsSelectingOutfit(true);
  };

  const filteredOutfits = safeOutfits.filter((outfit) => {
    if (!outfit) return false;
    
    if (selectedSeason && Array.isArray(outfit.seasons)) {
      if (!outfit.seasons.includes(selectedSeason)) {
        return false;
      }
    }
    
    if (selectedOccasion && Array.isArray(outfit.occasions)) {
      if (!outfit.occasions.includes(selectedOccasion)) {
        return false;
      }
    }
    
    if (showFavoritesOnly && outfit.favorite !== true) {
      return false;
    }
    
    return true;
  });

  const safeFilteredOutfits = Array.isArray(filteredOutfits) ? filteredOutfits : [];
  const hasPhoto = userPhoto !== null;

  return (
    <div className={`
      min-h-screen 
      bg-gradient-to-b 
      from-slate-950 
      to-purple-950 
      text-white 
      ${isMobile ? 'overflow-x-hidden' : 'overflow-x-hidden'}
    `}>
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-32 max-w-[1600px] relative">
        {/* Step 1: Hero Section */}
        <PageHeader
          title="Try On Your Wardrobe"
          subtitle="Upload your photo or use Olivia to try pieces from your closet."
          halfBodyImage="/lovable-uploads/e8fc1e11-c29c-400b-8e33-2577a311b453.png"
          imagePosition="right"
          animationStyle="float"
          overlayEffect="glow"
        />
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleOliviaTips}
            className="bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Info className="h-4 w-4 mr-2" />
            {showOliviaTips ? "Hide Olivia's Tips" : "Show Olivia's Tips"}
          </Button>
        </div>
        
        {/* Step 2: Choose Your Model Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8 mb-12"
        >
          <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            Select Your Model
          </h2>
          
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <Tabs 
                defaultValue={modelTab} 
                onValueChange={(value) => setModelTab(value as 'upload' | 'olivia')}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 gap-2 mb-6 bg-black/20 p-1 w-full max-w-md mx-auto">
                  <TabsTrigger 
                    value="upload" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your Photo
                  </TabsTrigger>
                  <TabsTrigger 
                    value="olivia"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Use Olivia Bloom
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-0">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/2 space-y-4">
                      <h3 className="text-lg font-medium text-white/90">Upload Your Photo</h3>
                      <p className="text-white/70">
                        Upload a full-body photo of yourself to see how outfits would look on you.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Button
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photo
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take a Photo
                        </Button>
                        <input 
                          type="file" 
                          id="photo-upload" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                if (result) {
                                  handleUserPhotoUpload(result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 flex justify-center">
                      {userPhoto && !isUsingOliviaImage ? (
                        <div className="relative w-full max-w-sm">
                          <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-purple-500/20">
                            <OptimizedImage 
                              src={userPhoto} 
                              alt="Your uploaded photo" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="absolute top-2 right-2 bg-black/50 border-none text-white/90 hover:bg-black/70 rounded-full p-2 h-auto"
                            onClick={resetSelection}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full">
                            Your Photo
                          </div>
                        </div>
                      ) : (
                        <div className="w-full max-w-sm aspect-[3/4] rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center">
                          <Upload className="h-10 w-10 text-white/40 mb-4" />
                          <p className="text-white/70 mb-2">Drag & drop your photo here</p>
                          <p className="text-white/50 text-sm">or click "Choose Photo" button</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="olivia" className="mt-0">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/2 space-y-4">
                      <h3 className="text-lg font-medium text-white/90">Use Olivia as Your Model</h3>
                      <p className="text-white/70">
                        Don't want to upload your photo? Let Olivia be your virtual model instead.
                      </p>
                      <div className="flex gap-3 mt-4">
                        <Button
                          onClick={() => setShowOliviaImageGallery(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Choose Olivia
                        </Button>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 flex justify-center">
                      {userPhoto && isUsingOliviaImage ? (
                        <div className="relative w-full max-w-sm">
                          <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-purple-500/20">
                            <OptimizedImage 
                              src={userPhoto} 
                              alt="Olivia as your model" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="absolute top-2 right-2 bg-black/50 border-none text-white/90 hover:bg-black/70 rounded-full p-2 h-auto"
                            onClick={resetSelection}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full">
                            Olivia
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full max-w-sm aspect-[3/4] rounded-lg border-2 border-white/20 flex flex-col items-center justify-center p-6 overflow-hidden relative"
                          onClick={() => setShowOliviaImageGallery(true)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                          <OptimizedImage 
                            src="/lovable-uploads/f29b0fb8-330c-409a-8488-2e7ae2b351ed.png"
                            alt="Olivia Bloom"
                            className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute bottom-6 left-0 right-0 text-center z-20">
                            <Button 
                              variant="default"
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Select Olivia
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>
        
        {/* Step 3 & 4: Pick an Outfit & Preview Area */}
        {hasPhoto && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
              Try On Outfits
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Outfit Selector */}
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle>Select an Outfit</CardTitle>
                  <CardDescription className="text-white/70">
                    Browse your wardrobe or try Olivia's suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="wardrobe" className="w-full" id="outfit-tabs">
                    <TabsList className="grid grid-cols-2 gap-2 mb-6 bg-black/20 p-1 w-full">
                      <TabsTrigger 
                        value="wardrobe" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                      >
                        Your Outfits
                      </TabsTrigger>
                      <TabsTrigger 
                        value="suggestions"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                      >
                        Olivia's Picks
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="wardrobe" className="mt-0">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${selectedSeason === 'summer' ? 'bg-white/20' : ''}`}
                            onClick={() => handleSeasonChange('summer')}
                          >
                            Summer
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${selectedSeason === 'winter' ? 'bg-white/20' : ''}`}
                            onClick={() => handleSeasonChange('winter')}
                          >
                            Winter
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${selectedOccasion === 'casual' ? 'bg-white/20' : ''}`}
                            onClick={() => handleOccasionChange('casual')}
                          >
                            Casual
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${selectedOccasion === 'formal' ? 'bg-white/20' : ''}`}
                            onClick={() => handleOccasionChange('formal')}
                          >
                            Formal
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${showFavoritesOnly ? 'bg-white/20' : ''}`}
                            onClick={toggleFavorites}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-pink-500' : ''}`} />
                            Favorites
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {isLoadingOutfits ? (
                            <div className="col-span-2 text-center py-10">
                              <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-white rounded-full animate-spin mb-4"></div>
                              <p className="text-white/70">Loading your outfits...</p>
                            </div>
                          ) : safeFilteredOutfits.length > 0 ? (
                            safeFilteredOutfits.map((outfit) => (
                              <div 
                                key={outfit.id}
                                className="relative group overflow-hidden border border-white/10 rounded-lg hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                                onClick={() => handleOutfitPreview(outfit)}
                              >
                                <div className="aspect-square bg-black/30 overflow-hidden">
                                  <OptimizedImage
                                    src="/placeholder.svg" 
                                    alt={outfit.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-300"
                                  />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                  <h4 className="text-sm font-medium truncate text-white">{outfit.name}</h4>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {outfit.seasons?.slice(0, 2).map(season => (
                                      <span key={season} className="text-xs bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded-full">
                                        {season}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <button 
                                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(outfit.id);
                                  }}
                                >
                                  <Heart className={`h-4 w-4 ${outfit.favorite ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-10">
                              <p className="text-white/70 mb-4">No outfits match your filters</p>
                              <Button 
                                variant="outline"
                                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                                onClick={() => {
                                  setSelectedSeason(null);
                                  setSelectedOccasion(null);
                                  setShowFavoritesOnly(false);
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Clear Filters
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="suggestions" className="mt-0">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${activeFilter === 'today' ? 'bg-white/20' : ''}`}
                            onClick={() => setActiveFilter('today')}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Today's Look
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${activeFilter === 'weather' ? 'bg-white/20' : ''}`}
                            onClick={() => setActiveFilter('weather')}
                          >
                            <Sun className="h-4 w-4 mr-2" />
                            Weather-Ready
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`bg-white/5 border-white/10 text-white hover:bg-white/10 ${activeFilter === 'style' ? 'bg-white/20' : ''}`}
                            onClick={() => setActiveFilter('style')}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Style Match
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {safeFilteredOutfits.length > 0 ? (
                            safeFilteredOutfits.slice(0, 6).map((outfit) => (
                              <div 
                                key={outfit.id}
                                className="relative group overflow-hidden border border-white/10 rounded-lg hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                                onClick={() => handleOutfitPreview(outfit)}
                              >
                                <div className="aspect-square bg-black/30 overflow-hidden">
                                  <OptimizedImage
                                    src="/placeholder.svg" 
                                    alt={outfit.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-300"
                                  />
                                </div>
                                <div className="absolute top-0 left-0 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-br-lg">
                                  Olivia's Pick
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                  <h4 className="text-sm font-medium truncate text-white">{outfit.name}</h4>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {outfit.seasons?.slice(0, 2).map(season => (
                                      <span key={season} className="text-xs bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded-full">
                                        {season}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-10">
                              <p className="text-white/70 mb-4">No outfit suggestions available</p>
                              <Button 
                                variant="default"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                onClick={handleAssistantAction}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Suggestions
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Right Column: Try-on Preview */}
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle>Your Virtual Fitting Room</CardTitle>
                  <CardDescription className="text-white/70">
                    See how outfits look on your model
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {finalImage ? (
                    <div className="relative">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-purple-500/20">
                        <OptimizedImage 
                          src={finalImage} 
                          alt="Try-on preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedOutfit && (
                        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                          <h4 className="text-sm font-medium text-white">{selectedOutfit.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedOutfit.seasons?.map(season => (
                              <span key={season} className="text-xs bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded-full">
                                {season}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isProcessingTryOn ? (
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-purple-500/20 flex items-center justify-center bg-black/50">
                      <div className="text-center">
                        <motion.div 
                          className="w-16 h-16 border-t-2 border-purple-500 rounded-full mx-auto mb-4"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-white/70">Processing your try-on...</p>
                      </div>
                    </div>
                  ) : userPhoto ? (
                    <div className="relative">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-purple-500/20">
                        <OptimizedImage 
                          src={userPhoto} 
                          alt={isUsingOliviaImage ? "Olivia as your model" : "Your uploaded photo"} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
                        <div className="text-center max-w-xs p-6">
                          <h4 className="text-white font-medium mb-2">Ready for Try-On</h4>
                          <p className="text-white/70 mb-4">
                            Select an outfit from the left panel to see how it looks on your model
                          </p>
                          <Button
                            variant="default"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                            onClick={() => document.getElementById('outfit-tabs')?.click()}
                          >
                            Choose an Outfit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center">
                      <Upload className="h-10 w-10 text-white/40 mb-4" />
                      <p className="text-white/70 mb-2">Select a model first</p>
                      <p className="text-white/50 text-sm">Upload your photo or choose Olivia as your model</p>
                    </div>
                  )}
                  
                  {finalImage && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="default"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        onClick={handleSaveLook}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Save Look
                      </Button>
                      
                      {navigator.share && (
                        <Button
                          variant="outline"
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 ml-auto"
                        onClick={resetSelection}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Another
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}
        
        {/* Step A: Olivia's Suggestions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            Olivia's Suggestions
          </h2>
          
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <OliviaRecommendationBox 
                weather={currentWeather} 
                selectedOutfit={selectedOutfit}
                onSuggestOutfit={handleRefreshOutfit}
                onFilterByTag={handleFilterByTag}
                onTryOutfit={handleOutfitPreview}
                outfits={safeFilteredOutfits}
              />
            </CardContent>
          </Card>
        </motion.section>
        
        {/* Step B: Saved Looks & Outfit Collections */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-16"
          id="outfits-section"
        >
          <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            Your Outfits & Collections
          </h2>
          
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <OutfitFilters 
                selectedSeason={selectedSeason}
                selectedOccasion={selectedOccasion}
                showFavoritesOnly={showFavoritesOnly}
                onSeasonChange={handleSeasonChange}
                onOccasionChange={handleOccasionChange}
                onFavoritesToggle={toggleFavorites}
                totalOutfits={safeOutfits.length}
                filteredOutfits={safeFilteredOutfits.length}
                className="shadow-xl shadow-purple-900/10 mb-6"
              />
              
              {isLoadingOutfits ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-dark border border-white/10 rounded-lg p-6 text-center"
                >
                  <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-white/70">Loading your outfits...</p>
                </motion.div>
              ) : (!Array.isArray(safeFilteredOutfits) || safeFilteredOutfits.length === 0) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-dark border border-white/10 rounded-lg p-6 text-center"
                >
                  <Sparkles className="h-8 w-8 text-purple-400 mb-3 mx-auto" />
                  <h3 className="text-lg font-medium text-white mb-2">No outfits yet</h3>
                  <p className="text-white/70 mb-4">Would you like Olivia to create some looks for you?</p>
                  <Button
                    onClick={handleAssistantAction}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                  >
                    Generate Looks
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {safeFilteredOutfits.map((outfit) => (
                    <div 
                      key={outfit.id}
                      className="relative group overflow-hidden border border-white/10 rounded-lg hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="aspect-square bg-black/30 overflow-hidden">
                        <OptimizedImage
                          src="/placeholder.svg" 
                          alt={outfit.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-300"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <h4 className="text-sm font-medium truncate text-white">{outfit.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {outfit.seasons?.slice(0, 2).map(season => (
                            <span key={season} className="text-xs bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded-full">
                              {season}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button 
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(outfit.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${outfit.favorite ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
                      </button>
                      <div className="absolute left-0 right-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/90 via-black/70 to-transparent translate-y-10 group-hover:translate-y-0 duration-300">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                          onClick={() => handleOutfitPreview(outfit)}
                        >
                          Try This Look
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
        
        {/* Step C: Style of the Day */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-16"
        >
          <StyleOfTheDay 
            outfit={safeFilteredOutfits[0] || null} 
            onPreview={handleOutfitPreview}
          />
        </motion.section>
          
        {/* Step D: Community Picks (Renamed TrendingLooks) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-400" />
            Trending in the Community
          </h2>
          
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <TrendingLooks onShowLogin={handleUpgradeToPremium} />
            </CardContent>
          </Card>
        </motion.section>
      </main>
      
      {showScrollToTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            variant="default"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700 shadow-lg"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
      
      <ShowroomDialogs 
        showStatusBar={showStatusBar}
        userPhoto={userPhoto}
        selectedOutfit={selectedOutfit}
        oliviaSuggestion={oliviaSuggestion}
        finalImage={finalImage}
        isMobile={isMobile}
        showOliviaImageGallery={showOliviaImageGallery}
        showSubscriptionPopup={showSubscriptionPopup}
        showTips={showTips && showOliviaTips}
        onResetSelection={resetSelection}
        onPreviewNow={handlePreviewNow}
        onCloseOliviaImageGallery={() => setShowOliviaImageGallery(false)}
        onCloseSubscriptionPopup={handleCloseSubscriptionPopup}
        onSelectOliviaImage={handleSelectOliviaImage}
        onUpgradeToPremium={handleUpgradeToPremium}
      />
    </div>
  );
};

export default FittingRoom;
