
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import UploadModal from '@/components/UploadModal';
import { ClothingItem } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';

const Wardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>(sampleClothingItems);

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

  // Scroll to upload section if URL has #upload hash
  useEffect(() => {
    if (window.location.hash === '#upload') {
      const uploadSection = document.getElementById('upload-section');
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth' });
        // Trigger the upload modal to open
        const uploadButton = document.getElementById('upload-button');
        if (uploadButton) {
          uploadButton.click();
        }
      }
    }
  }, []);

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
          <motion.div id="upload-section" variants={itemVariants} className="flex flex-wrap justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">My Wardrobe</h1>
            <div id="upload-button">
              <UploadModal onUpload={handleUpload} />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-dark p-6 rounded-xl border border-white/10">
            <WardrobeGrid 
              items={items} 
              onToggleFavorite={handleToggleFavorite} 
            />
          </motion.div>
        </motion.div>
      </main>
      
      <OliviaBloomAdvisor 
        items={sampleClothingItems}
        userPreferences={{
          favoriteColors: sampleUserPreferences.favoriteColors,
          favoriteStyles: sampleUserPreferences.favoriteStyles
        }}
      />
    </div>
  );
};

export default Wardrobe;
