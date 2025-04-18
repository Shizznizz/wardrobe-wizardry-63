
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ClothingItem, Outfit } from '@/lib/types';
import OutfitCanvas from './outfit-builder/OutfitCanvas';
import WardrobeDrawer from './outfit-builder/WardrobeDrawer';
import CategoryFilters from './outfit-builder/CategoryFilters';
import { PersonStanding, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateOutfitSectionProps {
  clothingItems: ClothingItem[];
  isPremium?: boolean;
}

const CreateOutfitSection = ({ clothingItems, isPremium = false }: CreateOutfitSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('top');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');

  const vibeOptions = [
    'Casual', 'Formal', 'Business', 'Party', 'Romantic', 
    'Power Boss', 'Creative', 'Sporty', 'Boho', 'Minimal'
  ];

  const handleSelectItem = (item: ClothingItem) => {
    // Remove any existing item of the same category
    const filteredItems = selectedItems.filter(
      selected => selected.category !== item.category
    );
    setSelectedItems([...filteredItems, item]);
  };

  const handleRemoveItem = (item: ClothingItem) => {
    setSelectedItems(selectedItems.filter(
      selected => selected.id !== item.id
    ));
  };

  const handleSaveOutfit = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item for your outfit");
      return;
    }

    if (!outfitName) {
      toast.error("Please give your outfit a name");
      return;
    }

    const newOutfit: Outfit = {
      id: Date.now().toString(),
      name: outfitName,
      items: selectedItems.map(item => item.id),
      season: ['all'], // Default to all seasons
      occasion: selectedVibe.toLowerCase() || 'casual',
      createdAt: new Date(),
      dateAdded: new Date(),
      tags: selectedVibe ? [selectedVibe] : []
    };

    // Here you would typically save to your backend
    toast.success("Outfit saved successfully!");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/10"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Own Outfit</h2>
          <p className="text-white/70">
            Choose items from your personal wardrobe to build outfits you love – for any mood, event, or weather.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,2fr] gap-6">
          {/* Left side - Canvas */}
          <OutfitCanvas
            selectedItems={selectedItems}
            onItemClick={handleRemoveItem}
          />

          {/* Right side - Controls */}
          <div className="space-y-6">
            <Input
              placeholder="Name your outfit..."
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="bg-black/20 border-white/10"
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white/70">Select your vibe:</h3>
              <div className="flex flex-wrap gap-2">
                {vibeOptions.map(vibe => (
                  <Badge
                    key={vibe}
                    variant="outline"
                    className={cn(
                      "cursor-pointer hover:bg-purple-500/20",
                      selectedVibe === vibe && "bg-purple-500 text-white"
                    )}
                    onClick={() => setSelectedVibe(vibe)}
                  >
                    {vibe}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={handleSaveOutfit}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Outfit
              </Button>
              
              {isPremium && (
                <Button 
                  variant="outline"
                  className="w-full border-purple-500/30 hover:bg-purple-500/20"
                >
                  <PersonStanding className="w-4 h-4 mr-2" />
                  Try on Olivia
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom - Category filters and wardrobe drawer */}
        <div className="space-y-4">
          <CategoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          <WardrobeDrawer
            items={clothingItems}
            selectedCategory={selectedCategory}
            onSelectItem={handleSelectItem}
            selectedItems={selectedItems}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default CreateOutfitSection;
