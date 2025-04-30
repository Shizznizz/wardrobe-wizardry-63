
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { ArrowRight, Upload, Calendar, Sparkles, MessageCircle, Shirt, Wand, Clock, Instagram, Pin } from 'lucide-react';

import Header from '@/components/Header';
import BackgroundShapes from '@/components/BackgroundShapes';
import HeroSection from '@/components/home/HeroSection';
import OptimizedImage from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import SectionDivider from '@/components/SectionDivider';
import HomepagePremiumTeaser from '@/components/HomepagePremiumTeaser';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };
  
  // Counter animation refs
  const counterRef = React.useRef(null);
  const isCounterInView = useInView(counterRef, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Counter animation state
  const [countWardrobe, setCountWardrobe] = useState(0);
  const [countOutfits, setCountOutfits] = useState(0);
  const [countHappy, setCountHappy] = useState(0);
  
  // Run counter animation when in view
  useEffect(() => {
    if (isCounterInView && !hasAnimated) {
      const wardrobeInterval = setInterval(() => {
        setCountWardrobe(prev => {
          const nextValue = prev + 100;
          if (nextValue >= 10000) {
            clearInterval(wardrobeInterval);
            return 10000;
          }
          return nextValue;
        });
      }, 20);
      
      const outfitsInterval = setInterval(() => {
        setCountOutfits(prev => {
          const nextValue = prev + 2500;
          if (nextValue >= 250000) {
            clearInterval(outfitsInterval);
            return 250000;
          }
          return nextValue;
        });
      }, 20);
      
      const happyInterval = setInterval(() => {
        setCountHappy(prev => {
          const nextValue = prev + 1;
          if (nextValue >= 98) {
            clearInterval(happyInterval);
            return 98;
          }
          return nextValue;
        });
      }, 20);
      
      setHasAnimated(true);
      
      return () => {
        clearInterval(wardrobeInterval);
        clearInterval(outfitsInterval);
        clearInterval(happyInterval);
      };
    }
  }, [isCounterInView, hasAnimated]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-hidden">
      <BackgroundShapes />
      <Header />
      
      <main className="relative z-10">
        {/* 1. Hero Section - Using our updated component */}
        <HeroSection />

        {/* 2. Meet Olivia Section - Updated copy */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full md:w-2/5 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-30"></div>
                  <OptimizedImage
                    src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png"
                    alt="Olivia, AI Fashion Stylist"
                    className="rounded-full shadow-xl relative z-10 border-4 border-white/20"
                    width={320}
                    height={320}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-3/5 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Hi, I'm Olivia 👋
                </h2>
                <p className="text-xl text-blue-100/90 mb-8 leading-relaxed">
                  I'm your AI fashion assistant here to make your style journey effortless and fun.
                  Get personalized outfits that reflect who you are — every single day.
                </p>
                <Button 
                  onClick={() => navigate('/fitting-room')}
                  className="coral-button text-lg px-8 py-3"
                >
                  Get My Looks
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. How It Works Section */}
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                How It Works
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </motion.div>

            <motion.div 
              className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Step 1 */}
              <motion.div 
                className="card-futuristic flex flex-col items-center text-center relative z-10"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-5 shadow-lg">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Your Wardrobe</h3>
                <p className="text-blue-100/80">Snap photos of your clothes or add from suggestions</p>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div 
                className="card-futuristic flex flex-col items-center text-center relative z-10"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-5 shadow-lg">
                  <Calendar className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Get Daily Outfit Ideas</h3>
                <p className="text-blue-100/80">Based on your preferences, weather & calendar</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 4. Style Preview Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Style Preview
              </h2>
              <p className="text-lg text-blue-100/80 max-w-3xl mx-auto">
                From weather-based recommendations to mood-matching outfits, Olivia has you covered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-6xl mx-auto"
            >
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {/* Weather Based Look */}
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="h-64 bg-gradient-to-b from-blue-500/50 to-indigo-600/50 relative overflow-hidden">
                        <OptimizedImage
                          src="/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png"
                          alt="Rainy Day Chic"
                          className="object-cover w-full h-full mix-blend-overlay"
                          width={400}
                          height={300}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold mb-1">Rainy Day Chic</h3>
                          <p className="text-sm text-blue-100/70">Weather-inspired outfit</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-blue-100/80 mb-4">Stay stylish while staying dry with this perfect rainy day ensemble.</p>
                        <Button 
                          variant="outline" 
                          className="w-full border-white/10 hover:bg-white/10"
                          onClick={() => navigate('/fitting-room')}
                        >
                          Style Me Now
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Mood Based Look */}
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="h-64 bg-gradient-to-b from-pink-500/50 to-purple-600/50 relative overflow-hidden">
                        <OptimizedImage
                          src="/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png"
                          alt="Brunch Mood"
                          className="object-cover w-full h-full mix-blend-overlay"
                          width={400}
                          height={300}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold mb-1">Brunch Mood</h3>
                          <p className="text-sm text-blue-100/70">Mood-matching outfit</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-blue-100/80 mb-4">Feeling social and relaxed? This brunch-perfect outfit matches your mood.</p>
                        <Button 
                          variant="outline" 
                          className="w-full border-white/10 hover:bg-white/10"
                          onClick={() => navigate('/quizzes')}
                        >
                          Match My Vibe
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  
                  {/* Date Night Look */}
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="h-64 bg-gradient-to-b from-purple-500/50 to-indigo-600/50 relative overflow-hidden">
                        <OptimizedImage
                          src="/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png"
                          alt="Date Night Glam"
                          className="object-cover w-full h-full mix-blend-overlay"
                          width={400}
                          height={300}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold mb-1">Date Night Glam</h3>
                          <p className="text-sm text-blue-100/70">Evening elegance</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-blue-100/80 mb-4">Make an impression with this perfect date night ensemble that exudes confidence.</p>
                        <Button 
                          variant="outline" 
                          className="w-full border-white/10 hover:bg-white/10"
                          onClick={() => navigate('/fitting-room')}
                        >
                          Style Me Now
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex justify-center mt-6">
                  <CarouselPrevious className="static translate-y-0 mr-2" />
                  <CarouselNext className="static translate-y-0 ml-2" />
                </div>
              </Carousel>
            </motion.div>
          </div>
        </section>

        {/* 5. Community Looks Section */}
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Community Looks
              </h2>
              <p className="text-lg text-blue-100/80 max-w-3xl mx-auto">
                See how others are styling their looks with Olivia's help.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
            >
              {[
                { id: 1, user: '@sophie.style', img: '4e16d86c-652b-4717-958f-b48ce5663c9b.png' },
                { id: 2, user: '@annaloveslayers', img: 'f1154816-6766-4478-ba89-6342580bc85b.png' },
                { id: 3, user: '@mia.fashion', img: 'e4bf2134-0936-46f8-8d70-adcc220e50be.png' },
                { id: 4, user: '@style.by.julia', img: '28e5664c-3c8a-4b7e-9c99-065ad489583f.png' }
              ].map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <div 
                      className="aspect-square bg-slate-800/60 rounded-xl overflow-hidden relative shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    >
                      <OptimizedImage
                        src={`/lovable-uploads/${item.img}`}
                        alt={`Community Style by ${item.user}`}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        width={300}
                        height={300}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/90 to-transparent">
                        <p className="text-sm font-medium text-white/90">{item.user}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/75 transition-opacity duration-300">
                        <Button 
                          variant="outline"
                          className="border-white/20 bg-slate-900/50 backdrop-blur-sm"
                        >
                          View Outfit Details
                        </Button>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700">
                    <div className="grid gap-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={`/lovable-uploads/${item.img}`} />
                          <AvatarFallback>{item.user.substring(1, 3).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{item.user}</h3>
                          <p className="text-sm text-white/70">Styled by Olivia</p>
                        </div>
                      </div>
                      <div className="aspect-square relative rounded-md overflow-hidden">
                        <OptimizedImage
                          src={`/lovable-uploads/${item.img}`}
                          alt={`Community Style by ${item.user}`}
                          className="w-full h-full object-cover"
                          width={500}
                          height={500}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/shop-and-try')}
                          className="border-white/20"
                        >
                          Try This On Me
                        </Button>
                        <Button 
                          onClick={() => navigate('/fitting-room')}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                        >
                          Style Me Like This
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* 6. Testimonials Section */}
        <TestimonialsCarousel />

        {/* 7. Join the Style Movement */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div ref={counterRef} className="flex flex-wrap justify-center gap-6 md:gap-16 mb-12">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-400">
                    {countWardrobe.toLocaleString()}+
                  </p>
                  <p className="text-sm text-blue-100/70 mt-1">Wardrobes Styled</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-purple-400">
                    {countOutfits.toLocaleString()}+
                  </p>
                  <p className="text-sm text-blue-100/70 mt-1">Outfits Created</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-pink-400">
                    {countHappy}%
                  </p>
                  <p className="text-sm text-blue-100/70 mt-1">Happy Users</p>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Join the Style Movement
              </h2>
              
              <p className="text-xl text-blue-100/80 mb-10 max-w-3xl mx-auto">
                Start your styling journey today and transform the way you dress with AI-powered fashion advice.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="btn-futuristic text-lg px-12 py-7 group"
                >
                  Join for Free
                  <ArrowRight className="ml-2 h-5 w-5 duration-300 group-hover:translate-x-1" />
                </Button>
                
                <div className="flex items-center gap-3 text-blue-100/90 bg-slate-800/40 p-3 rounded-lg border border-white/10">
                  <Avatar className="h-12 w-12 border-2 border-pink-400/30 relative">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                    <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></span>
                  </Avatar>
                  <div className="relative">
                    <div className="absolute -left-2 top-0 w-2 h-2 bg-slate-800/40 transform rotate-45"></div>
                    <div className="bg-slate-800/70 px-4 py-2 rounded-lg">
                      <span className="text-sm">I'm ready when you are! 💫</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 8. Upcoming Collections Section */}
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full md:w-1/2 relative">
                <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                  <OptimizedImage
                    src="/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png"
                    alt="Upcoming Collection"
                    className="w-full h-full object-cover blur-sm filter"
                    width={500}
                    height={375}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/30 flex flex-col items-center justify-center p-6">
                    <h3 className="text-2xl font-bold mb-3 text-center">Summer Collection</h3>
                    <div className="flex gap-4 mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-md py-2 px-4 text-center">
                        <span className="block text-2xl font-bold">14</span>
                        <span className="text-xs text-blue-100/70">Days</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-md py-2 px-4 text-center">
                        <span className="block text-2xl font-bold">06</span>
                        <span className="text-xs text-blue-100/70">Hours</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-md py-2 px-4 text-center">
                        <span className="block text-2xl font-bold">32</span>
                        <span className="text-xs text-blue-100/70">Minutes</span>
                      </div>
                    </div>
                    <Button
                      className="coral-button"
                      onClick={() => navigate('/premium')}
                    >
                      Unlock Early Access
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Be the First to Style the New Drop 💥
                </h2>
                <p className="text-xl text-blue-100/80 mb-6">
                  Get early access to Olivia's Summer Collection.
                  Click below to unlock your front-row seat.
                </p>
                <p className="text-blue-100/70 mb-8">
                  Premium members get early access to all new collections and advanced AI styling features.
                </p>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => navigate('/premium')}
                >
                  Learn More About Premium
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Premium Section - Now using the HomepagePremiumTeaser component */}
        <HomepagePremiumTeaser />
        
      </main>
    </div>
  );
};

export default Index;
