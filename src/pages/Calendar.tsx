
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import OutfitCalendar from '@/components/outfits/OutfitCalendar';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Calendar = () => {
  // We'll use the same loading state logic as the Wardrobe page
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState(sampleClothingItems);

  // Load items from localStorage on initial render
  useEffect(() => {
    const loadItems = () => {
      setIsLoading(true);
      try {
        const savedItems = localStorage.getItem('wardrobeItems');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        } else {
          // Use sample items as fallback
          setItems(sampleClothingItems);
          // Save sample items to localStorage for future use
          localStorage.setItem('wardrobeItems', JSON.stringify(sampleClothingItems));
        }
      } catch (error) {
        console.error("Failed to load wardrobe items:", error);
        // Fallback to sample items
        setItems(sampleClothingItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden max-w-[100vw]">
      <Header />
      
      <main className="w-full px-3 sm:px-4 pt-24 pb-16 max-w-full overflow-hidden">
        <motion.div 
          className="space-y-8 max-w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="w-full">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Your Outfit Tracker & Insights
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-6">
              Track, analyze, and optimize your outfits with powerful visual analytics and personalized recommendations.
            </p>
          </motion.div>
          
          {!isLoading && (
            <motion.div variants={itemVariants} className="w-full mt-10 overflow-hidden">
              <OutfitCalendar 
                outfits={sampleOutfits}
                clothingItems={items}
                onAddLog={(log) => {
                  toast.success(`Outfit logged for ${format(log.date, 'MMMM d, yyyy')}`);
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Calendar;
