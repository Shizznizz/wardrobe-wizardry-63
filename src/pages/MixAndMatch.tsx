import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import WeatherSummary from '@/components/weather/WeatherSummary';
import OliviaRecommendation from '@/components/outfits/OliviaRecommendation';
import StyleContextDrawer from '@/components/outfits/StyleContextDrawer';
import OutfitCollectionPreview from '@/components/outfits/OutfitCollectionPreview';
import { sampleOutfits, sampleClothingItems } from '@/lib/wardrobeData';
import { WeatherInfo } from '@/lib/types';

const MixAndMatch = () => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  
  const personalOutfits = sampleOutfits.filter(outfit => outfit.favorite);
  const popularOutfits = sampleOutfits.slice().sort(() => 0.5 - Math.random());
  
  const handleWeatherUpdate = (weatherData: { temperature: number; condition: string }) => {
    setWeather({
      temperature: weatherData.temperature,
      condition: weatherData.condition,
      icon: weatherData.condition.toLowerCase().includes('cloud') ? 'cloud' :
            weatherData.condition.toLowerCase().includes('rain') ? 'rain' :
            weatherData.condition.toLowerCase().includes('snow') ? 'snow' :
            'sun',
      city: 'San Francisco',
      country: 'USA'
    });
  };
  
  const handleSituationChange = (newSituation: string) => {
    setSituation(newSituation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
            Style Mixer
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Tell Olivia about your plans, and she'll craft the perfect outfit suggestion for your day.
          </p>
        </motion.div>
        
        {/* Weather Summary Component */}
        <div className="mb-6">
          <WeatherSummary onWeatherUpdate={handleWeatherUpdate} />
        </div>
        
        {/* Context Customization */}
        <div className="flex justify-end mb-6">
          <StyleContextDrawer 
            onWeatherChange={handleWeatherUpdate}
            onSituationChange={handleSituationChange}
          />
        </div>
        
        {/* Olivia's Recommendation */}
        <section className="mb-12">
          <OliviaRecommendation weather={weather || undefined} situation={situation || undefined} />
        </section>
        
        {/* Personal Collection */}
        <section>
          <OutfitCollectionPreview
            title="My Outfit Collection"
            description="Outfits you've created and saved"
            outfits={personalOutfits.length ? personalOutfits : sampleOutfits.slice(0, 4)}
            clothingItems={sampleClothingItems}
            viewAllLink="/outfits"
          />
        </section>
        
        {/* Popular Outfits */}
        <section>
          <OutfitCollectionPreview
            title="Popular Today"
            description="Trending outfits loved by the community"
            outfits={popularOutfits.slice(0, 4)}
            clothingItems={sampleClothingItems}
          />
        </section>
      </main>
    </div>
  );
};

export default MixAndMatch;
