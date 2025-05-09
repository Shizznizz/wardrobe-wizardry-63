
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import OutfitCalendar from '@/components/outfits/OutfitCalendar';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedLocationSelector from '@/components/weather/EnhancedLocationSelector';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { format } from 'date-fns';
import ScrollToTop from '@/components/ScrollToTop';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/shared/HeroSection';
import { Button } from '@/components/ui/button';

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
  const calendarRef = useRef<HTMLDivElement>(null);

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

  const scrollToCalendar = () => {
    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-x-hidden max-w-[100vw]">
      <ScrollToTop />
      
      <HeroSection
        title="Your Style Planner & Insights"
        subtitle="Let's look at your fashion evolution and unlock your ideal style — with Olivia's guidance."
        image={{
          src: "/lovable-uploads/e1aaa230-1623-42c4-ab9f-eb7c5f103ebe.png",
          alt: "Olivia your AI Fashion Assistant"
        }}
        buttons={[
          {
            label: "Show Me My Style Timeline",
            onClick: scrollToCalendar,
            variant: "primary",
            className: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300"
          }
        ]}
      >
        {profile?.first_name && (
          <p className="text-white/80 mb-4">
            Hi {profile.first_name}, here's your outfit planner!
          </p>
        )}
      </HeroSection>
      
      <main className="w-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <motion.div 
          className="space-y-8 md:space-y-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Add soft arc background to location selector */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-md"></div>
              <EnhancedLocationSelector 
                onLocationChange={handleLocationChange}
                initialCity={location.city}
                initialCountry={location.country}
                className="p-4 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-white/10"
              />
            </div>
          </motion.div>
          
          {!isLoading && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full overflow-hidden rounded-2xl shadow-xl"
              ref={calendarRef}
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
