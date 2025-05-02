import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import OutfitCalendar from '@/components/outfits/OutfitCalendar';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedLocationSelector from '@/components/weather/EnhancedLocationSelector';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { format } from 'date-fns';
import ScrollToTop from '@/components/ScrollToTop';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/shared/PageHeader';

const StylePlanner = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState(sampleClothingItems);
  const [outfits, setOutfits] = useState(sampleOutfits);
  const [location, setLocation] = useState<{ city: string; country: string }>({ city: '', country: '' });
  const [locationUpdated, setLocationUpdated] = useState(false);
  const isMobile = useIsMobile();
  const { savedLocation } = useLocationStorage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ first_name: string | null } | null>(null);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data);
          }
        });
    }
  }, [user?.id]);

  useEffect(() => {
    if (savedLocation && !locationUpdated) {
      setLocation({
        country: savedLocation.country,
        city: savedLocation.city
      });
      setLocationUpdated(true);
    }
  }, [savedLocation]);

  useEffect(() => {
    const loadItems = () => {
      setIsLoading(true);
      try {
        const savedItems = localStorage.getItem('wardrobeItems');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        } else {
          setItems(sampleClothingItems);
          localStorage.setItem('wardrobeItems', JSON.stringify(sampleClothingItems));
        }
        
        const savedOutfits = localStorage.getItem('wardrobeOutfits');
        if (savedOutfits) {
          setOutfits(JSON.parse(savedOutfits));
        } else {
          setOutfits(sampleOutfits);
          localStorage.setItem('wardrobeOutfits', JSON.stringify(sampleOutfits));
        }
      } catch (error) {
        console.error("Failed to load wardrobe data:", error);
        setItems(sampleClothingItems);
        setOutfits(sampleOutfits);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleLocationChange = (city: string, country: string) => {
    setLocation({ city, country });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden max-w-[100vw]">
      <ScrollToTop />
      <Header />
      
      <main className="w-full px-4 sm:px-6 md:px-8 pt-24 pb-32 max-w-7xl mx-auto overflow-hidden">
        <motion.div 
          className="space-y-8 md:space-y-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <PageHeader
            title="Your Style Planner & Insights"
            subtitle="Let's look at your fashion evolution and unlock your ideal style."
            showAvatar={true}
          >
            {profile?.first_name && (
              <p className="text-white/80">
                Hi {profile.first_name}, here's your outfit planner!
              </p>
            )}
          </PageHeader>
          
          <motion.div variants={itemVariants} className="w-full max-w-md mx-auto">
            <EnhancedLocationSelector 
              onLocationChange={handleLocationChange}
              initialCity={location.city}
              initialCountry={location.country}
            />
          </motion.div>
          
          {!isLoading && (
            <motion.div 
              variants={itemVariants} 
              className="w-full overflow-hidden rounded-2xl shadow-xl"
            >
              <OutfitCalendar 
                outfits={outfits}
                clothingItems={items}
                location={location}
                onAddLog={(log) => {
                  toast.success(`Outfit ${log.date > new Date() ? 'planned' : 'logged'} for ${format(new Date(log.date), 'MMMM d, yyyy')}`);
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default StylePlanner;
