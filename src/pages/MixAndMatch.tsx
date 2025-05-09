import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ClothingItem, Outfit } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';

import DailyOutfitSection from '@/components/outfits/mix-match/DailyOutfitSection';
import EnhancedWeatherSection from '@/components/outfits/mix-match/EnhancedWeatherSection';
import SuggestedOutfitsSection from '@/components/outfits/mix-match/SuggestedOutfitsSection';
import OliviaRecommendationSection from '@/components/outfits/mix-match/OliviaRecommendationSection';
import CreateOutfitSection from '@/components/outfits/mix-match/CreateOutfitSection';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/shared/HeroSection';

const MixAndMatch = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<{ first_name: string | null } | null>(null);
  const [temperature, setTemperature] = useState(72); // Default temperature
  const [weatherCondition, setWeatherCondition] = useState('clear'); // Default condition
  const [situation, setSituation] = useState('casual'); // Default situation
  
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
          if (JSON.parse(savedOutfits).length > 0) {
            setCurrentOutfit(JSON.parse(savedOutfits)[0]);
          }
        } else {
          setOutfits(sampleOutfits);
          if (sampleOutfits.length > 0) {
            setCurrentOutfit(sampleOutfits[0]);
          }
          localStorage.setItem('wardrobeOutfits', JSON.stringify(sampleOutfits));
        }
      } catch (error) {
        console.error("Failed to load wardrobe data:", error);
        setItems(sampleClothingItems);
        setOutfits(sampleOutfits);
        if (sampleOutfits.length > 0) {
          setCurrentOutfit(sampleOutfits[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleStyleMe = () => {
    setShowRecommendation(true);
    toast.success("Generating outfit recommendations...");
    
    // Scroll to recommendation section
    setTimeout(() => {
      const recommendationSection = document.getElementById('olivia-recommendation');
      if (recommendationSection) {
        recommendationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  };

  // Add handler functions for weather section
  const handleWeatherUpdate = (weatherInfo: any) => {
    if (weatherInfo.temperature) {
      setTemperature(weatherInfo.temperature);
    }
    if (weatherInfo.condition) {
      setWeatherCondition(weatherInfo.condition.toLowerCase());
    }
  };

  const handleSituationChange = (newSituation: string) => {
    setSituation(newSituation);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <HeroSection
        title="Your Daily Style, Curated by Olivia"
        subtitle="Get AI-powered outfits based on your style, mood, and local weather."
        image={{
          src: "/lovable-uploads/e1aaa230-1623-42c4-ab9f-eb7c5f103ebe.png",
          alt: "Olivia your AI Fashion Assistant"
        }}
        buttons={[
          {
            label: "Let Olivia Style Me Today",
            onClick: handleStyleMe,
            variant: "primary",
            className: "bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0] hover:opacity-90 transition-opacity"
          }
        ]}
      />
      
      <div className="container mx-auto px-4 space-y-10 pt-6 pb-20">
        <EnhancedWeatherSection 
          onWeatherUpdate={handleWeatherUpdate}
          onSituationChange={handleSituationChange}
          onTemperatureChange={setTemperature}
          onWeatherConditionChange={setWeatherCondition}
          temperature={temperature}
          weatherCondition={weatherCondition}
        />
        
        <DailyOutfitSection 
          clothingItems={items} 
          currentOutfit={currentOutfit} 
        />
        
        <SuggestedOutfitsSection 
          clothingItems={items} 
          outfits={outfits}
          weather={{
            temperature,
            condition: weatherCondition
          }}
        />
        
        {showRecommendation && (
          <div id="olivia-recommendation">
            <OliviaRecommendationSection 
              weather={{
                temperature,
                condition: weatherCondition
              }}
              situation={situation}
            />
          </div>
        )}
        
        <CreateOutfitSection 
          clothingItems={items}
          isPremium={isAuthenticated}
        />
      </div>
    </div>
  );
};

export default MixAndMatch;
