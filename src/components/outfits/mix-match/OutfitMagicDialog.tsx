import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ClothingItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Outfit } from '@/lib/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  Wand2, 
  Check, 
  Save, 
  Loader2, 
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Gift,
  Heart,
  TrendingUp
} from 'lucide-react';
import { useWardrobeData } from '@/hooks/useWardrobeData';
import { v4 as uuidv4 } from '@/lib/utils';

interface OutfitMagicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type VibeOption = {
  value: string;
  label: string;
  description: string;
};

type OccasionOption = {
  value: string;
  label: string;
};

const vibeOptions: VibeOption[] = [
  { value: 'professional', label: 'Confident & Professional', description: 'Polished and put-together looks that mean business' },
  { value: 'romantic', label: 'Romantic & Soft', description: 'Gentle, flowing, and feminine pieces with dreamy vibes' },
  { value: 'bold', label: 'Bold & Trendy', description: 'Statement pieces that turn heads and make an entrance' },
  { value: 'comfy', label: 'Chill & Comfy', description: 'Relaxed and effortlessly cool without sacrificing style' },
  { value: 'smart-casual', label: 'Smart Casual', description: 'That perfect blend of casual and dressed-up that works everywhere' },
];

const occasionOptions: OccasionOption[] = [
  { value: 'work', label: 'Work' },
  { value: 'date', label: 'Date' },
  { value: 'party', label: 'Party' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'me-time', label: 'Me-time' },
];

const OutfitMagicDialog: React.FC<OutfitMagicDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [generatedOutfit, setGeneratedOutfit] = useState<Outfit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRevealAnimation, setShowRevealAnimation] = useState(false);
  const [surpriseMe, setSurpriseMe] = useState(false);
  
  const { clothingItems, addOutfit, isLoadingItems } = useWardrobeData();
  const navigate = useNavigate();
  
  const resetDialog = () => {
    setStep(1);
    setSelectedVibe('');
    setSelectedOccasion('');
    setSelectedItems([]);
    setGeneratedOutfit(null);
    setShowRevealAnimation(false);
    setSurpriseMe(false);
  };
  
  useEffect(() => {
    if (!open) {
      // Reset the flow when dialog is closed
      resetDialog();
    }
  }, [open]);
  
  const handleNext = () => {
    if (step < 5) {
      // Skip the wardrobe selection step if "Surprise me" is selected
      if (step === 2 && surpriseMe) {
        setStep(4);
      } else {
        setStep(step + 1);
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      // Handle going back from summary when "Surprise me" was selected
      if (step === 4 && surpriseMe) {
        setStep(2);
      } else {
        setStep(step - 1);
      }
    }
  };

  const toggleItemSelection = (item: ClothingItem) => {
    setSelectedItems(prevItems => {
      // Check if the item is already selected
      const isSelected = prevItems.some(selectedItem => selectedItem.id === item.id);
      
      if (isSelected) {
        // If selected, remove it
        return prevItems.filter(selectedItem => selectedItem.id !== item.id);
      } else {
        // If not selected and we have less than 3 items, add it
        if (prevItems.length < 3) {
          return [...prevItems, item];
        }
        // If we already have 3 items, show a message and don't change the selection
        toast.info("You can select up to 3 items. Deselect an item first to change your selection.");
        return prevItems;
      }
    });
  };

  const handleToggleSurpriseMe = () => {
    setSurpriseMe(prev => {
      const newValue = !prev;
      if (newValue) {
        // Clear any selected items if enabling "Surprise me"
        setSelectedItems([]);
        toast.success("Olivia will surprise you with a fantastic look! 💫");
      }
      return newValue;
    });
  };
  
  const handleGenerateOutfit = () => {
    setIsGenerating(true);
    
    // Simulate a delay for outfit generation
    setTimeout(() => {
      // Create a generated outfit using the selected items plus additional matches
      const availableItems = clothingItems.filter(
        item => !selectedItems.some(selected => selected.id === item.id)
      );

      let outfitItems: ClothingItem[] = [];
      
      // If surprise me is selected, randomly choose 3-4 items from the wardrobe
      if (surpriseMe) {
        // Shuffle and pick 3-4 random items from the wardrobe
        const shuffled = [...clothingItems].sort(() => 0.5 - Math.random());
        const randomItemCount = Math.floor(Math.random() * 2) + 3; // 3 or 4 items
        outfitItems = shuffled.slice(0, randomItemCount);
      } else {
        // Start with the user's selected items
        outfitItems = [...selectedItems];
        
        // Get additional items to reach at least 3 total items
        const additionalItemsNeeded = Math.max(0, 3 - selectedItems.length);
        
        if (additionalItemsNeeded > 0 && availableItems.length > 0) {
          // Filter items by selected occasion and vibe (in a real app, more sophisticated matching would be used)
          const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
          const additionalItems = shuffled.slice(0, additionalItemsNeeded);
          outfitItems = [...outfitItems, ...additionalItems];
        }
      }
      
      const outfitItemIds = outfitItems.map(item => item.id);
      
      // Create the outfit object
      const mockOutfit: Outfit = {
        id: uuidv4(),
        name: `${getVibeLabel(selectedVibe)} ${getOccasionLabel(selectedOccasion)} Outfit`,
        items: outfitItemIds,
        occasions: [selectedOccasion],
        occasion: selectedOccasion,
        season: ['all'],
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        personality_tags: [selectedVibe],
        color_scheme: "Harmonious blend",
        colors: outfitItems.map(item => item.color)
      };
      
      setGeneratedOutfit(mockOutfit);
      setIsGenerating(false);
      
      // Show reveal animation
      setShowRevealAnimation(true);
      setTimeout(() => {
        setShowRevealAnimation(false);
      }, 1500);
      
    }, 2500);
  };
  
  const getVibeLabel = (value: string): string => {
    return vibeOptions.find(option => option.value === value)?.label || value;
  };
  
  const getOccasionLabel = (value: string): string => {
    return occasionOptions.find(option => option.value === value)?.label || value;
  };
  
  const handleSaveOutfit = async () => {
    if (!generatedOutfit) return;
    
    try {
      const savedOutfit = await addOutfit(generatedOutfit);
      
      if (savedOutfit) {
        toast.success('Outfit saved to your collection! ✨');
        onOpenChange(false);
      } else {
        toast.error('Could not save outfit');
      }
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast.error('Failed to save the outfit');
    }
  };

  const handleGenerateAnother = () => {
    // Keep the current selections but regenerate the outfit
    setGeneratedOutfit(null);
    handleGenerateOutfit();
  };

  const handleViewInFittingRoom = () => {
    if (generatedOutfit) {
      handleSaveOutfit();
      // Navigate to the fitting room page
      setTimeout(() => {
        navigate('/fitting-room', { state: { outfitId: generatedOutfit.id } });
      }, 500);
    }
  };

  // Get selected items from wardrobe
  const getSelectedItemsFromWardrobe = () => {
    return selectedItems.map(item => {
      const wardrobeItem = clothingItems.find(i => i.id === item.id);
      return wardrobeItem || item;
    });
  };

  // Get AI-suggested items (subset of the generated outfit not from user selection)
  const getAISuggestedItems = () => {
    if (!generatedOutfit) return [];
    
    const outfitItems = generatedOutfit.items
      .filter(id => !selectedItems.some(item => item.id === id))
      .map(id => clothingItems.find(item => item.id === id))
      .filter(Boolean) as ClothingItem[];
    
    return outfitItems;
  };

  // Generate styling notes based on outfit and selections
  const generateStylingNotes = () => {
    const vibeText = selectedVibe === 'professional' ? 'polished and confident'
      : selectedVibe === 'romantic' ? 'soft and feminine'
      : selectedVibe === 'bold' ? 'bold and eye-catching'
      : selectedVibe === 'comfy' ? 'relaxed yet stylish'
      : 'versatile and balanced';
      
    const occasionText = selectedOccasion === 'work' ? 'your workday'
      : selectedOccasion === 'date' ? 'your special date'
      : selectedOccasion === 'party' ? 'that exciting party'
      : selectedOccasion === 'shopping' ? 'a fun shopping trip'
      : 'your precious me-time';
      
    // Random style tips based on vibe
    const styleTips = [
      `The silhouette we've created flatters your figure beautifully while keeping that ${vibeText} energy you're looking for.`,
      `I've balanced colors and textures to create a harmonious look that's perfect for ${occasionText}.`,
      `The pieces complement each other wonderfully, creating a cohesive look that's both ${vibeText} and appropriate for ${occasionText}.`,
      `I chose complementary tones that work together to enhance your natural coloring and bring out your best features.`,
      `This outfit has just the right amount of personality - it feels uniquely you while embracing that ${vibeText} aesthetic!`
    ];
    
    const accessoryTip = Math.random() > 0.5 
      ? `Consider adding a statement accessory to really make this look pop!` 
      : `You could layer a light jacket over this for cooler weather without losing the vibe.`;
    
    const confidenceTip = `Wear this with confidence, and you'll absolutely shine at ${occasionText}! 💫`;
    
    return `I've created this ${vibeText} look specifically for ${occasionText}, keeping your personal style in mind. ${styleTips[Math.floor(Math.random() * styleTips.length)]} ${accessoryTip} ${confidenceTip}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-purple-950/95 border-purple-500/30 text-white max-w-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Add DialogTitle (hidden for screen readers) to fix accessibility warning */}
        <DialogTitle className="sr-only">Outfit Magic</DialogTitle>
        
        {/* Progress indicator */}
        <div className="flex justify-between p-4 bg-purple-900/50 border-b border-purple-500/20 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`w-1/5 h-1 rounded-full mx-1 transition-all ${
                s === step ? 'bg-pink-400' : s < step ? 'bg-pink-400/50' : 'bg-purple-700/50'
              }`} 
            />
          ))}
        </div>
        
        {/* Avatar and step content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-start mb-6 gap-4">
            <Avatar className="h-12 w-12 border-2 border-purple-400 ring-2 ring-purple-300/20">
              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">OB</AvatarFallback>
            </Avatar>
            
            <div>
              <motion.h2 
                key={`step-${step}-title`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xl font-medium mb-1"
              >
                {step === 1 && "What's your vibe today, gorgeous? ✨"}
                {step === 2 && "Where are you headed with this fabulous look?"}
                {step === 3 && "Pick your faves (up to 3) & I'll do the rest! 💖"}
                {step === 4 && "Ready to see the magic happen..."}
                {step === 5 && "Your magical outfit is ready! ✨"}
              </motion.h2>
              
              <motion.p 
                key={`step-${step}-description`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-purple-200"
              >
                {step === 1 && "Let's start with how you want to feel and look today."}
                {step === 2 && "The perfect outfit always matches the occasion!"}
                {step === 3 && "Choose 1-3 pieces you definitely want to rock today."}
                {step === 4 && (surpriseMe 
                  ? "I'll surprise you with something amazing based on your vibe and occasion!" 
                  : "Let's put together something unforgettable with your selections!"
                )}
                {step === 5 && (isGenerating ? "Just a moment while I craft something special..." : "Here's what I've created just for you!")}
              </motion.p>
            </div>
          </div>
          
          <div className="py-2">
            {/* Step 1: Vibe Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <RadioGroup value={selectedVibe} onValueChange={setSelectedVibe}>
                  {vibeOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`flex items-center space-x-3 rounded-lg border border-purple-500/30 p-4 cursor-pointer transition-all hover:bg-purple-800/30 ${
                        selectedVibe === option.value ? 'bg-purple-800/50 border-pink-400/50' : ''
                      }`}
                      onClick={() => setSelectedVibe(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={`vibe-${option.value}`} className="text-pink-400" />
                      <div className="grid gap-1">
                        <label 
                          htmlFor={`vibe-${option.value}`} 
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {option.label}
                        </label>
                        <p className="text-xs text-purple-300/80">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            )}
            
            {/* Step 2: Occasion Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {occasionOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`flex items-center justify-center p-4 rounded-lg border border-purple-500/30 cursor-pointer transition-all hover:bg-purple-800/30 ${
                        selectedOccasion === option.value ? 'bg-purple-800/50 border-pink-400/50' : ''
                      }`}
                      onClick={() => setSelectedOccasion(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-purple-500/20">
                  <div 
                    className={`flex items-center space-x-3 rounded-lg border border-purple-500/30 p-4 cursor-pointer transition-all hover:bg-purple-800/30 ${
                      surpriseMe ? 'bg-purple-800/50 border-pink-400/70 border-2' : ''
                    }`}
                    onClick={handleToggleSurpriseMe}
                  >
                    <Checkbox 
                      id="surprise-me" 
                      checked={surpriseMe} 
                      onCheckedChange={handleToggleSurpriseMe} 
                      className="text-pink-400" 
                    />
                    <div className="grid gap-1">
                      <label 
                        htmlFor="surprise-me" 
                        className="text-sm font-medium leading-none cursor-pointer flex items-center"
                      >
                        <Gift className="h-4 w-4 mr-2 text-pink-400" />
                        🎁 Surprise me, Olivia!
                      </label>
                      <p className="text-xs text-purple-300/80">Let me work my magic and choose everything for you</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Multiple Item Selection (up to 3) */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {isLoadingItems ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                ) : clothingItems.length > 0 ? (
                  <>
                    <div className="text-xs text-purple-300 mb-2">
                      Selected: {selectedItems.length}/3 items
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2">
                      {clothingItems.map((item) => {
                        const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
                        return (
                          <div 
                            key={item.id}
                            className={`relative rounded-lg border border-purple-500/30 overflow-hidden cursor-pointer transition-all hover:border-pink-400/50 ${
                              isSelected ? 'ring-2 ring-pink-400' : ''
                            }`}
                            onClick={() => toggleItemSelection(item)}
                          >
                            <div className="aspect-square w-full">
                              <img 
                                src={item.imageUrl || ''} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs">
                              {item.name}
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-purple-300">
                    <p>No clothing items found in your wardrobe.</p>
                    <Button variant="ghost" className="mt-2 text-pink-400">
                      Add items to your wardrobe first
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Summary before generating */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-purple-900/40 rounded-lg p-5 border border-purple-500/30">
                  <h3 className="font-medium text-lg mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 text-pink-300 mr-2" />
                    Your Style Selections
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-purple-300 mb-1">Vibe:</p>
                      <p className="font-medium text-white bg-purple-800/40 px-3 py-2 rounded-md inline-block">
                        {getVibeLabel(selectedVibe)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-purple-300 mb-1">Occasion:</p>
                      <p className="font-medium text-white bg-purple-800/40 px-3 py-2 rounded-md inline-block">
                        {getOccasionLabel(selectedOccasion)}
                      </p>
                    </div>
                    
                    {!surpriseMe && selectedItems.length > 0 && (
                      <div>
                        <p className="text-sm text-purple-300 mb-1">Selected Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="bg-purple-800/40 px-2 py-1 rounded-md text-sm flex items-center">
                              {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {surpriseMe && (
                      <div>
                        <p className="text-sm text-purple-300 mb-1">Selected Items:</p>
                        <div className="bg-purple-800/40 px-3 py-2 rounded-md text-sm flex items-center">
                          <Gift className="h-4 w-4 mr-2 text-pink-300" />
                          Full surprise from Olivia!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center p-4">
                  <div className="mb-5">
                    <div className="inline-block relative">
                      <Wand2 className="h-8 w-8 text-pink-400 animate-bounce" />
                      <div className="absolute inset-0 -z-10 bg-pink-400/20 blur-xl rounded-full"></div>
                    </div>
                  </div>
                  
                  <p className="text-lg font-medium text-purple-100 mb-2">
                    {surpriseMe 
                      ? "Ready to be wowed? Let's create some magic!" 
                      : "Alright, here's what we've got so far — let me work my magic and complete the perfect look!"}
                  </p>
                  
                  <p className="text-sm text-purple-300">
                    I'll mix your selections with my fashion expertise to create something you'll absolutely love.
                    Get ready for some serious style magic! ✨
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Step 5: Generated Outfit with Animation */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative">
                      <Wand2 className="h-10 w-10 text-pink-400 animate-bounce" />
                      <div className="absolute inset-0 -z-10 bg-pink-400/20 blur-xl rounded-full animate-pulse"></div>
                    </div>
                    <p className="mt-4 text-purple-200">Creating your perfect outfit...</p>
                  </div>
                ) : showRevealAnimation ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <div className="relative">
                      <Sparkles className="h-16 w-16 text-yellow-400" />
                      <div className="absolute inset-0 -z-10 bg-yellow-400/20 blur-xl rounded-full animate-pulse"></div>
                    </div>
                    <p className="mt-4 text-yellow-200 text-lg font-bold">✨ Revealing Your Outfit ✨</p>
                  </motion.div>
                ) : generatedOutfit ? (
                  <>
                    <div className="bg-purple-900/40 rounded-lg p-4 border border-purple-500/30">
                      <h3 className="font-medium text-lg mb-2 flex items-center">
                        <Heart className="h-5 w-5 text-pink-400 mr-2" />
                        {generatedOutfit.name}
                      </h3>
                      <p className="text-sm text-purple-200 mb-3">
                        I've created this {getVibeLabel(selectedVibe).toLowerCase()} look for your {getOccasionLabel(selectedOccasion).toLowerCase()}.
                        You're going to look absolutely fabulous in this! 😍
                      </p>
                      
                      {/* Visual outfit preview with selected items */}
                      <div className="bg-purple-800/30 rounded-lg p-3 mt-3">
                        <p className="text-xs text-purple-300 mb-2">Your outfit pieces:</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* User selected items with special highlight */}
                          {getSelectedItemsFromWardrobe().map((item) => (
                            <div key={`selected-${item.id}`} className="relative rounded-md overflow-hidden w-16 h-16 border border-pink-400/50">
                              <img 
                                src={item.imageUrl || ''}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-pink-500/80 p-0.5 text-[10px] text-white">
                                {item.name}
                              </div>
                            </div>
                          ))}
                          
                          {/* AI suggested additional items */}
                          {getAISuggestedItems().map((item, i) => (
                            <div key={`additional-${i}`} className="relative rounded-md overflow-hidden w-16 h-16 border border-purple-500/30">
                              <img
                                src={item?.imageUrl || ''}
                                alt={item?.name || 'Item'}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-purple-700/80 p-0.5 text-[10px] text-white">
                                {item?.name || 'Item'}
                              </div>
                              <div className="absolute top-0 right-0 bg-purple-900/80 p-0.5">
                                <Sparkles className="h-3 w-3 text-yellow-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Complete outfit visualization */}
                        <div className="relative h-40 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center mb-2">
                          <div className="text-white/70 text-center">
                            <p className="font-medium">Complete look visualization</p>
                            <p className="text-xs mt-1">This would show the complete outfit layout</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/40 rounded-lg p-4 border border-purple-500/30">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-pink-400" />
                        Olivia's styling notes:
                      </h4>
                      <p className="text-xs text-purple-200">
                        {generateStylingNotes()}
                      </p>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handleViewInFittingRoom}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                      >
                        💜 View in Fitting Room
                      </Button>
                      
                      <Button 
                        onClick={handleGenerateAnother}
                        variant="outline" 
                        className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-800/30 hover:text-white"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate Another Look
                      </Button>
                      
                      <Button 
                        onClick={handleSaveOutfit}
                        variant="ghost" 
                        className="w-full text-purple-200 hover:bg-purple-800/30 hover:text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save to My Collection
                      </Button>
                    </div>
                  </>
                ) : null}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="p-4 flex justify-between items-center border-t border-purple-500/20 bg-purple-900/50 flex-shrink-0">
          {step > 1 ? (
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-purple-200 hover:bg-purple-800/30 hover:text-white px-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}
          
          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedVibe) ||
                (step === 2 && !selectedOccasion) ||
                (step === 3 && !surpriseMe && selectedItems.length === 0)
              }
              variant="default"
              className="bg-purple-600 hover:bg-purple-500 text-white px-6"
            >
              Next
            </Button>
          ) : step === 4 ? (
            <Button
              onClick={handleGenerateOutfit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6"
            >
              <Wand2 className="h-5 w-5 mr-2" />
              Generate Outfit
            </Button>
          ) : (
            <div></div> // Empty div in final step
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitMagicDialog;
