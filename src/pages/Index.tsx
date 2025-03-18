
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, ShoppingBag, CloudSun, Bell, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { WeatherInfo } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';

const Index = () => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWeatherChange = (weatherData: WeatherInfo) => {
    setWeather(weatherData);
  };

  const handleWearOutfit = (outfitId: string) => {
    console.log('Wearing outfit:', outfitId);
    // In a real app, this would update the outfit wear count
  };

  const handleRefreshOutfit = () => {
    console.log('Refreshing outfit suggestion');
    // In a real app, this would generate a new outfit suggestion
  };

  const handleLikeOutfit = () => {
    console.log('Liked outfit');
    // In a real app, this would update user preferences
  };

  const handleDislikeOutfit = () => {
    console.log('Disliked outfit');
    // In a real app, this would update user preferences
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
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
      <Header weather={weather ? weather : undefined} />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="flex flex-col space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Section */}
          <motion.section 
            className="flex flex-col lg:flex-row items-center lg:items-start justify-between py-12 gap-8"
            variants={itemVariants}
          >
            <div className="lg:max-w-xl space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-2">
                Your Personal Wardrobe Assistant
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Organize your wardrobe, <span className="text-primary">effortlessly</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your clothes, discover outfits, and get personalized suggestions based on your style and the weather.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="group">
                  <Link to="/wardrobe">
                    Get Started
                    <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/outfits">Explore Outfits</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border shadow-soft">
                <img 
                  src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800" 
                  alt="Organized wardrobe" 
                  className="w-full sm:w-[450px] object-cover"
                  width={450}
                  height={500}
                />
              </div>
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section variants={itemVariants} className="py-12">
            <h2 className="text-3xl font-bold text-center mb-12">Smart Features for Your Wardrobe</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-xl border hover:border-primary/40 bg-white shadow-soft transition-all hover:shadow-hover">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shirt className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Organize Clothes</h3>
                <p className="text-muted-foreground">
                  Categorize your garments by type, color, season, and more.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-xl border hover:border-primary/40 bg-white shadow-soft transition-all hover:shadow-hover">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Outfits</h3>
                <p className="text-muted-foreground">
                  Mix and match your clothes to create and save perfect outfits.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-xl border hover:border-primary/40 bg-white shadow-soft transition-all hover:shadow-hover">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CloudSun className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Weather Smart</h3>
                <p className="text-muted-foreground">
                  Get outfit suggestions based on current weather conditions.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-xl border hover:border-primary/40 bg-white shadow-soft transition-all hover:shadow-hover">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Daily Reminders</h3>
                <p className="text-muted-foreground">
                  Receive daily outfit suggestions and reminders.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Today's Outfit Section */}
          <motion.section variants={itemVariants} className="py-12">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold">Today's Outfit</h2>
              <WeatherWidget 
                className="w-full max-w-[220px]"
                onWeatherChange={handleWeatherChange}
              />
            </div>
            
            <OutfitSuggestion
              outfit={sampleOutfits[0]}
              items={sampleClothingItems}
              weather={weather || undefined}
              onWear={handleWearOutfit}
              onRefresh={handleRefreshOutfit}
              onLike={handleLikeOutfit}
              onDislike={handleDislikeOutfit}
            />
          </motion.section>

          {/* CTA Section */}
          <motion.section 
            variants={itemVariants}
            className="py-12 rounded-2xl border bg-gradient-to-r from-primary/5 to-primary/10 text-center p-8 lg:p-16"
          >
            <div className="max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <ThumbsUp className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-3xl font-bold">Ready to organize your wardrobe?</h2>
              <p className="text-lg text-muted-foreground">
                Start adding your clothes and create amazing outfits today.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link to="/wardrobe">Get Started</Link>
              </Button>
            </div>
          </motion.section>
        </motion.div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Wardrobe App. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
