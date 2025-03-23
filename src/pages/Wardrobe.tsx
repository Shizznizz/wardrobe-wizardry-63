
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import UploadModal from '@/components/UploadModal';
import WardrobeGrid from '@/components/WardrobeGrid';
import { ClothingItem } from '@/lib/types';
import { sampleClothingItems } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart } from 'lucide-react';

const Wardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>(sampleClothingItems);
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites'>('all');
  const isMobile = useIsMobile();
  
  const handleUpload = (newItem: ClothingItem) => {
    setItems(prev => [newItem, ...prev]);
    toast.success(`${newItem.name} added to your wardrobe`);
  };
  
  const handleToggleFavorite = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, favorite: !item.favorite } 
          : item
      )
    );
    
    const item = items.find(item => item.id === id);
    if (item) {
      const action = !item.favorite ? 'added to' : 'removed from';
      toast.success(`${item.name} ${action} favorites`);
    }
  };

  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(item => item.favorite);
  
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
          <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">My Wardrobe</h1>
            <UploadModal onUpload={handleUpload} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-dark p-6 rounded-xl border border-white/10">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-black/20">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setActiveFilter('all')}
                    className="data-[state=active]:bg-primary/20"
                  >
                    All Items
                  </TabsTrigger>
                  <TabsTrigger 
                    value="favorites" 
                    onClick={() => setActiveFilter('favorites')}
                    className="data-[state=active]:bg-primary/20"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <WardrobeGrid 
                  items={filteredItems} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-0">
                <WardrobeGrid 
                  items={filteredItems} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Wardrobe;
