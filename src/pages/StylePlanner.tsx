import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import OutfitCalendar from '@/components/outfits/OutfitCalendar';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedLocationSelector from '@/components/weather/EnhancedLocationSelector';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { format } from 'date-fns';
import ScrollToTop from '@/components/ScrollToTop';
import { useAuth } from '@/hooks/useAuth';
import { useWardrobeData } from '@/hooks/useWardrobeData';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/shared/HeroSection';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const StylePlanner = () => {
  const { isAuthenticated, user } = useAuth();
  const { clothingItems, outfits, isLoadingItems, isLoadingOutfits } = useWardrobeData();
  
  const [location, setLocation] = useState<{ city: string; country: string }>({ city: '', country: '' });
  const [locationUpdated, setLocationUpdated] = useState(false);
  const isMobile = useIsMobile();
  const { savedLocation } = useLocationStorage();
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

  const handleLocationChange = (city: string, country: string) => {
    setLocation({ city, country });
  };

  const scrollToCalendar = () => {
    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show authentication notice if user is not logged in
  const renderAuthNotice = () => {
    if (!isAuthenticated) {
      return (
        <Alert variant="default" className="mb-6 bg-amber-900/20 border-amber-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to see your outfit calendar and plan your style.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };
  
  // Show empty state if authenticated but no items or outfits
  const renderEmptyNotice = () => {
    if (isAuthenticated && !isLoadingItems && !isLoadingOutfits && 
        (clothingItems.length === 0 || outfits.length === 0)) {
      return (
        <Alert variant="default" className="mb-6 bg-blue-900/20 border-blue-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{clothingItems.length === 0 ? 'Empty Wardrobe' : 'No Outfits Found'}</AlertTitle>
          <AlertDescription>
            {clothingItems.length === 0 
              ? 'Add some clothing items to your wardrobe to create outfits.' 
              : 'Create some outfits from your wardrobe items to plan your style.'}
          </AlertDescription>
        </Alert>
      );
    }
    return null;
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
        <div className="container mx-auto pt-6">
          {renderAuthNotice()}
          {renderEmptyNotice()}
        </div>
        
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
          
          {isAuthenticated && !isLoadingItems && !isLoadingOutfits && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full overflow-hidden rounded-2xl shadow-xl"
              ref={calendarRef}
            >
              <OutfitCalendar 
                outfits={outfits}
                clothingItems={clothingItems}
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
