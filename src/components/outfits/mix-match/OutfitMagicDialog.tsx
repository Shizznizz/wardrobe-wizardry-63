
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClothingItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Outfit } from '@/lib/types';
import { toast } from 'sonner';
import { Wand2, Check, Save, Loader2 } from 'lucide-react';
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
  { value: 'professional', label: 'Confident & Professional', description: 'Polished and put-together looks' },
  { value: 'romantic', label: 'Romantic & Soft', description: 'Gentle, flowing, and feminine pieces' },
  { value: 'bold', label: 'Bold & Trendy', description: 'Statement pieces that turn heads' },
  { value: 'comfy', label: 'Chill & Comfy', description: 'Relaxed and effortlessly cool' },
  { value: 'smart-casual', label: 'Smart Casual', description: 'Balanced blend of casual and dressed-up' },
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
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [generatedOutfit, setGeneratedOutfit] = useState<Outfit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { clothingItems, addOutfit, isLoadingItems } = useWardrobeData();
  
  const resetDialog = () => {
    setStep(1);
    setSelectedVibe('');
    setSelectedOccasion('');
    setSelectedItem(null);
    setGeneratedOutfit(null);
  };
  
  useEffect(() => {
    if (!open) {
      // Reset the flow when dialog is closed
      resetDialog();
    }
  }, [open]);
  
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleGenerateOutfit = () => {
    setIsGenerating(true);
    
    // Simulate a delay for outfit generation
    setTimeout(() => {
      // Create a mock generated outfit
      const mockOutfit: Outfit = {
        id: uuidv4(),
        name: `${getVibeLabel(selectedVibe)} ${getOccasionLabel(selectedOccasion)} Outfit`,
        items: [selectedItem?.id || ''].filter(Boolean),
        // Add 2-3 more items from the user's wardrobe that would match
        occasions: [selectedOccasion],
        occasion: selectedOccasion,
        season: ['all'],
        favorite: false,
        timesWorn: 0,
        dateAdded: new Date(),
        personality_tags: [selectedVibe],
        color_scheme: "Harmonious blend",
        colors: selectedItem?.color ? [selectedItem.color] : []
      };
      
      setGeneratedOutfit(mockOutfit);
      setIsGenerating(false);
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
        toast.success('Outfit saved to your collection!');
        onOpenChange(false);
      } else {
        toast.error('Could not save outfit');
      }
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast.error('Failed to save the outfit');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-purple-950/95 border-purple-500/30 text-white max-w-lg p-0 overflow-hidden">
        {/* Progress indicator */}
        <div className="flex justify-between p-4 bg-purple-900/50 border-b border-purple-500/20">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-1/4 h-1 rounded-full mx-1 transition-all ${
                s === step ? 'bg-pink-400' : s < step ? 'bg-pink-400/50' : 'bg-purple-700/50'
              }`} 
            />
          ))}
        </div>
        
        {/* Avatar and step content */}
        <div className="p-6">
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
                {step === 1 && "What's the vibe today?"}
                {step === 2 && "What's the occasion?"}
                {step === 3 && "Pick one item from your wardrobe"}
                {step === 4 && "Your magical outfit"}
              </motion.h2>
              
              <motion.p 
                key={`step-${step}-description`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-purple-200"
              >
                {step === 1 && "Let's start with how you want to feel today."}
                {step === 2 && "Where are you headed with this look?"}
                {step === 3 && "Choose a piece you definitely want to wear."}
                {step === 4 && (isGenerating ? "Just a moment while I craft something special..." : "Here's what I've put together for you!")}
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
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
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
              </motion.div>
            )}
            
            {/* Step 3: Item Selection */}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2">
                    {clothingItems.map((item) => (
                      <div 
                        key={item.id}
                        className={`relative rounded-lg border border-purple-500/30 overflow-hidden cursor-pointer transition-all hover:border-pink-400/50 ${
                          selectedItem?.id === item.id ? 'ring-2 ring-pink-400' : ''
                        }`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="aspect-square w-full">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs">
                          {item.name}
                        </div>
                        {selectedItem?.id === item.id && (
                          <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
            
            {/* Step 4: Generated Outfit */}
            {step === 4 && (
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
                ) : generatedOutfit ? (
                  <>
                    <div className="bg-purple-900/40 rounded-lg p-4 border border-purple-500/30">
                      <h3 className="font-medium mb-2">{generatedOutfit.name}</h3>
                      <p className="text-sm text-purple-200 mb-3">
                        I've created this {getVibeLabel(selectedVibe).toLowerCase()} look for your {getOccasionLabel(selectedOccasion).toLowerCase()}.
                        This outfit will make you feel confident while staying true to your personal style!
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        {selectedItem && (
                          <div className="relative rounded-md overflow-hidden w-20 h-20">
                            <img 
                              src={selectedItem.imageUrl} 
                              alt={selectedItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* This is where we could show other matched items */}
                        <div className="flex-1 text-sm text-purple-200">
                          <p>
                            Your {selectedItem?.name || 'item'} pairs beautifully with complementary pieces 
                            from your wardrobe to create this {selectedVibe} look.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/40 rounded-lg p-4 border border-purple-500/30">
                      <h4 className="text-sm font-medium mb-2">Olivia's styling notes:</h4>
                      <p className="text-xs text-purple-200">
                        This {getVibeLabel(selectedVibe).toLowerCase()} outfit balances comfort and style,
                        perfect for a {getOccasionLabel(selectedOccasion).toLowerCase()} setting.
                        The colors work harmoniously together, and the silhouette flatters your figure beautifully!
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-purple-300">
                    <p>Ready to generate your outfit!</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="p-4 bg-purple-900/50 border-t border-purple-500/20 flex justify-between">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="border-purple-500/30 text-white hover:bg-purple-800/50"
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={(step === 1 && !selectedVibe) || (step === 2 && !selectedOccasion) || (step === 3 && !selectedItem)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Continue
            </Button>
          ) : isGenerating ? (
            <Button disabled className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </Button>
          ) : !generatedOutfit ? (
            <Button 
              onClick={handleGenerateOutfit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Outfit
            </Button>
          ) : (
            <Button 
              onClick={handleSaveOutfit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save to My Looks
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitMagicDialog;
