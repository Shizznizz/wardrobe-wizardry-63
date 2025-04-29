
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Calendar, Sparkles } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackgroundShapes from '@/components/BackgroundShapes';
import OptimizedImage from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import SectionDivider from '@/components/SectionDivider';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const Index: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white overflow-hidden">
      <BackgroundShapes />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-28 pb-16 lg:pt-36 lg:pb-24">
          <motion.div 
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Discover Your Perfect Look — Powered by AI
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-blue-100/90 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Olivia helps you style smarter, based on your wardrobe, the weather and your vibe.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
              variants={fadeInUp}
            >
              <Button 
                onClick={() => navigate('/my-wardrobe')}
                className="btn-futuristic text-lg group"
              >
                Start Your Style Journey
                <ArrowRight className="ml-2 h-5 w-5 duration-300 group-hover:translate-x-1" />
              </Button>
              
              <Button 
                onClick={() => navigate('/quizzes')}
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg"
              >
                Take a Style Quiz
              </Button>
            </motion.div>

            {/* Olivia Avatar */}
            <motion.div
              className="flex flex-col items-center justify-center mt-8"
              variants={fadeInUp}
            >
              <Avatar className="h-24 w-24 border-4 border-pink-500/30 shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform duration-300">
                <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
              </Avatar>
              <p className="mt-3 text-sm font-medium text-blue-100/80">Meet Olivia, your AI stylist.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
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
              className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Connection Line */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent hidden md:block"></div>
              
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
              
              {/* Step 3 */}
              <motion.div 
                className="card-futuristic flex flex-col items-center text-center relative z-10"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-coral-500 flex items-center justify-center mb-5 shadow-lg">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Try Looks On Instantly</h3>
                <p className="text-blue-100/80">Visualize outfits on yourself or on Olivia</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Meet Olivia Section */}
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
                  Meet Olivia
                </h2>
                <p className="text-xl text-blue-100/90 mb-8 leading-relaxed">
                  Olivia personalizes fashion advice for your unique style journey, helping you discover 
                  outfit combinations that express your personality and fit perfectly for every occasion.
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

        {/* Style Preview Section */}
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
                opts={{
                  align: "start",
                  loop: true
                }}
                className="w-full"
              >
                <CarouselContent>
                  {/* Weather Based Look */}
                  <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3 pl-6">
                    <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl h-full hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
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
                          Try This Look
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Mood Based Look */}
                  <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3 pl-6">
                    <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl h-full hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
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
                          Match My Mood
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Occasion Based Look */}
                  <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3 pl-6">
                    <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl h-full hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
                      <div className="h-64 bg-gradient-to-b from-indigo-500/50 to-blue-600/50 relative overflow-hidden">
                        <OptimizedImage
                          src="/lovable-uploads/44448809-be5b-44da-a910-3f9b0e36264b.png"
                          alt="Meeting Ready"
                          className="object-cover w-full h-full mix-blend-overlay"
                          width={400}
                          height={300}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold mb-1">Meeting Ready</h3>
                          <p className="text-sm text-blue-100/70">Occasion-based outfit</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-blue-100/80 mb-4">Make an impression with this perfect ensemble for your important meetings.</p>
                        <Button 
                          variant="outline" 
                          className="w-full border-white/10 hover:bg-white/10"
                          onClick={() => navigate('/style-planner')}
                        >
                          Plan My Outfit
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </div>
              </Carousel>
            </motion.div>
          </div>
        </section>

        {/* Community Looks Section */}
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
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item} 
                  className="aspect-square bg-slate-800/60 rounded-xl overflow-hidden relative shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <OptimizedImage
                    src={`/lovable-uploads/${item === 1 ? '4e16d86c-652b-4717-958f-b48ce5663c9b.png' : 
                           item === 2 ? 'f1154816-6766-4478-ba89-6342580bc85b.png' : 
                           item === 3 ? 'e4bf2134-0936-46f8-8d70-adcc220e50be.png' : 
                           '28e5664c-3c8a-4b7e-9c99-065ad489583f.png'}`}
                    alt={`Community Style ${item}`}
                    className="w-full h-full object-cover opacity-80"
                    width={300}
                    height={300}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-slate-900/75 transition-opacity duration-300">
                    <Button 
                      variant="outline"
                      className="border-white/20 bg-slate-900/50 backdrop-blur-sm"
                      onClick={() => navigate('/shop-and-try')}
                    >
                      Try This On Me
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section - Added back */}
        <TestimonialsCarousel />

        {/* Early Access Section */}
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
                  Upcoming Collections
                </h2>
                <p className="text-xl text-blue-100/80 mb-6">
                  Be the first to get exclusive access to our upcoming style collections and features before they're released.
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

        {/* Join the Style Movement */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap justify-center gap-6 md:gap-16 mb-12">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-400">10,000+</p>
                  <p className="text-sm text-blue-100/70 mt-1">Wardrobes Styled</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-purple-400">250,000+</p>
                  <p className="text-sm text-blue-100/70 mt-1">Outfits Created</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-pink-400">98%</p>
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
                
                <div className="flex items-center gap-3 text-blue-100/90">
                  <Avatar className="h-12 w-12 border-2 border-pink-400/30">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                    <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Olivia can't wait to style you!</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
