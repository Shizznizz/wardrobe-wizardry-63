
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import UploadModal from '@/components/UploadModal';
import WardrobeGrid from '@/components/WardrobeGrid';
import { ClothingItem } from '@/lib/types';
import { sampleClothingItems } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const Wardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>(sampleClothingItems);
  const isMobile = useIsMobile();
  
  const handleUpload = (newItem: ClothingItem) => {
    setItems(prev => [newItem, ...prev]);
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
  
  // Animation variants
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Wardrobe</h1>
            <UploadModal onUpload={handleUpload} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <WardrobeGrid 
              items={items} 
              onToggleFavorite={handleToggleFavorite} 
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Wardrobe;
