
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import OutfitCalendar from '@/components/outfits/OutfitCalendar';
import { useOutfitState } from '@/hooks/useOutfitState';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { useAuth } from '@/hooks/useAuth';
import { useWardrobeData } from '@/hooks/useWardrobeData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, CalendarIcon, CalendarDays, Clock, Users, Sparkles, Activity, PieChart } from 'lucide-react';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import CollapsibleOliviaSection from '@/components/outfits/CollapsibleOliviaSection';
import MissedOpportunitiesSection from '@/components/outfits/calendar/MissedOpportunitiesSection';
import OutfitPreviewCard from '@/components/outfits/OutfitPreviewCard';

const StylePlanner = () => {
  const { outfits, clothingItems, isLoadingOutfits, isLoadingItems } = useWardrobeData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { outfitLogs, addOutfitLog } = useOutfitState();
  const { savedLocation } = useLocationStorage();
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const isMobile = useIsMobile();

  const handleShowTimeline = () => {
    setShowTimeline(true);
    const timelineSection = document.getElementById('style-timeline');
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChatClick = () => {
    console.log("Chat with Olivia clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Plan, Track & Analyze Your Style"
        subtitle="Visualize your fashion journey, review insights, and plan outfits with Olivia's help."
        image={{
          src: "/lovable-uploads/56943e49-b4d1-47fe-adf7-ee221134ef60.png",
          alt: "Woman in light beige pantsuit with gold belt and sunglasses",
          variant: "standing"
        }}
        buttons={[
          {
            label: "Show Me My Style Timeline",
            onClick: handleShowTimeline,
            variant: "lavender"
          }
        ]}
      />
      
      {/* My Style Calendar Section */}
      <section className="container mx-auto px-4 pt-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-purple-200">My Style Calendar</h2>
            <p className="text-purple-200/80">Track, plan and analyze your outfits over time</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-500/20 shadow-lg">
            <OutfitCalendar 
              outfits={outfits} 
              clothingItems={clothingItems}
              onAddLog={addOutfitLog}
              location={savedLocation}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Enhanced Olivia Chat Section */}
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <CollapsibleOliviaSection 
            onChatClick={handleChatClick} 
            selectedDate={selectedDate}
          />
        </motion.div>
      </section>
      
      {/* Outfit Preview Cards Section */}
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-purple-200">Today's Style Inspiration</h2>
            <p className="text-purple-200/80">Curated outfit ideas perfect for your day</p>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">Sign in to see your personalized outfit recommendations</p>
              <Button onClick={() => navigate('/auth')} variant="hero-primary">
                Sign In
              </Button>
            </div>
          ) : isLoadingOutfits || isLoadingItems ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-slate-900/70 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-pulse">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-800/50 rounded-lg" />
                    ))}
                  </div>
                  <div className="h-4 bg-slate-800/50 rounded mb-2" />
                  <div className="h-3 bg-slate-800/50 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : outfits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">No outfits found. Create your first outfit to see recommendations!</p>
              <Button onClick={() => navigate('/mix-match')} variant="hero-primary">
                Create Outfit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.slice(0, 6).map((outfit) => (
                <OutfitPreviewCard
                  key={outfit.id}
                  outfit={outfit}
                  clothingItems={clothingItems}
                  weather={{
                    temperature: 22,
                    condition: 'Partly Cloudy',
                    city: savedLocation?.city || 'Your City'
                  }}
                  activitySuggestion="casual day out"
                  onCardClick={(outfit) => {
                    console.log('Outfit clicked:', outfit.name);
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>
      
      {/* Missed Opportunities Section */}
      <section className="container mx-auto px-4 py-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-purple-200">Missed Opportunities</h2>
            <p className="text-purple-200/80">Days where you had activities but didn't record an outfit</p>
          </div>

          <MissedOpportunitiesSection 
            outfits={outfits} 
            outfitLogs={outfitLogs} 
            clothingItems={clothingItems}
          />
        </motion.div>
      </section>
    </div>
  );
};

export default StylePlanner;
