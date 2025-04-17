
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WardrobeGrid from '@/components/WardrobeGrid';
import OutfitGrid from '@/components/OutfitGrid';
import OutfitBuilder from '@/components/OutfitBuilder';
import UploadModal from '@/components/UploadModal';
import { ClothingItem, Outfit } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { useAuth } from '@/hooks/useAuth';
import { useOlivia } from '@/contexts/OliviaContext';

const Wardrobe = () => {
  const [activeTab, setActiveTab] = useState('clothes');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(sampleClothingItems);
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [selectedOutfitItems, setSelectedOutfitItems] = useState<ClothingItem[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { setHasUploadedWardrobe } = useOlivia();
  
  // Update Olivia context with wardrobe status
  useEffect(() => {
    setHasUploadedWardrobe(clothingItems.length > 0);
  }, [clothingItems, setHasUploadedWardrobe]);

  const handleAddItem = (item: ClothingItem) => {
    setClothingItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
    toast.success('Item added to your wardrobe!');
    setShowUploadModal(false);
  };

  const handleStartBuilding = () => {
    setIsBuilding(true);
    setSelectedOutfitItems([]);
  };

  const handleCancelBuilding = () => {
    setIsBuilding(false);
    setSelectedOutfitItems([]);
  };

  const handleAddToOutfit = (item: ClothingItem) => {
    setSelectedOutfitItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSaveOutfit = (name: string) => {
    if (selectedOutfitItems.length === 0) {
      toast.error('Please select at least one item for your outfit');
      return;
    }

    const newOutfit: Outfit = {
      id: Date.now().toString(),
      name,
      items: selectedOutfitItems.map(item => item.id),
      seasons: ['spring', 'summer', 'autumn', 'winter'], // Changed 'fall' to 'autumn' to match ClothingSeason type
      occasions: ['casual'],
      season: ['all'],
      occasion: 'casual',
      favorite: false,
      timesWorn: 0,
      dateAdded: new Date()
    };

    setOutfits(prev => [...prev, newOutfit]);
    setIsBuilding(false);
    setSelectedOutfitItems([]);
    toast.success('Outfit created successfully!');
  };

  // Added handlers required by component props
  const handleToggleFavorite = (id: string) => {
    setClothingItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const handleMatchItem = (item: ClothingItem) => {
    // Implement logic for matching items
    toast.info(`Finding matches for ${item.name}...`);
  };

  const handleEditOutfit = (outfit: Outfit) => {
    // Implement edit outfit functionality
    toast.info(`Editing outfit: ${outfit.name}`);
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== id));
    toast.success('Outfit deleted successfully');
  };

  const handleToggleOutfitFavorite = (id: string) => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Your Digital Wardrobe
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Organize your clothes, create outfits, and get personalized style recommendations.
          </p>
        </motion.div>
        
        {isBuilding ? (
          <OutfitBuilder 
            allItems={clothingItems}
            selectedItems={selectedOutfitItems}
            onAddToOutfit={handleAddToOutfit}
            onSave={handleSaveOutfit}
            onCancel={handleCancelBuilding}
          />
        ) : (
          <Tabs defaultValue="clothes" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-slate-800/50">
                <TabsTrigger value="clothes" className="data-[state=active]:bg-purple-600">Clothing Items</TabsTrigger>
                <TabsTrigger value="outfits" className="data-[state=active]:bg-purple-600">Outfits</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                {activeTab === 'clothes' ? (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
                  >
                    Add New Item
                  </button>
                ) : (
                  <button
                    onClick={handleStartBuilding}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
                  >
                    Create Outfit
                  </button>
                )}
              </div>
            </div>

            <TabsContent value="clothes" className="mt-6">
              <WardrobeGrid 
                items={clothingItems} 
                onToggleFavorite={handleToggleFavorite}
                onMatchItem={handleMatchItem}
              />
            </TabsContent>
            
            <TabsContent value="outfits" className="mt-6">
              <OutfitGrid 
                outfits={outfits}
                clothingItems={clothingItems}
                onEdit={handleEditOutfit}
                onDelete={handleDeleteOutfit}
                onToggleFavorite={handleToggleOutfitFavorite}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <UploadModal 
        onAddItem={handleAddItem}
        buttonText="Add Item"
      />
    </div>
  );
};

export default Wardrobe;
