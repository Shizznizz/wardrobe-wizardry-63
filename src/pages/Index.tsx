
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Calendar, Sparkles, MessageCircle, Shirt, Wand, Clock } from 'lucide-react';

import Header from '@/components/Header';
import BackgroundShapes from '@/components/BackgroundShapes';
import HeroSection from '@/components/home/HeroSection';
import OptimizedImage from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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
        {/* 1. Hero Section - Using our new component */}
        <HeroSection />

        {/* 2. Meet Olivia Section */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Weather Based Look */}
                <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
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

                {/* Mood Based Look */}
                <div className="bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
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
              </div>
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

        {/* 9. Premium Features Section */}
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
                Premium Features
              </h2>
              <p className="text-lg text-blue-100/80 max-w-3xl mx-auto">
                Unlock the full power of Olivia with our premium features.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div className="card-futuristic" variants={fadeInUp}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-5 mx-auto">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Chat with Olivia</h3>
                <p className="text-blue-100/70 text-center">Get personalized style advice anytime.</p>
              </motion.div>
              
              <motion.div className="card-futuristic" variants={fadeInUp}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-5 mx-auto">
                  <Shirt className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Outfit Try-On</h3>
                <p className="text-blue-100/70 text-center">Visualize how outfits look on you.</p>
              </motion.div>
              
              <motion.div className="card-futuristic" variants={fadeInUp}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-coral-500 flex items-center justify-center mb-5 mx-auto">
                  <Wand className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">AI Outfit Generator</h3>
                <p className="text-blue-100/70 text-center">Create unique looks with AI magic.</p>
              </motion.div>
              
              <motion.div className="card-futuristic" variants={fadeInUp}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center mb-5 mx-auto">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Exclusive Early Access</h3>
                <p className="text-blue-100/70 text-center">Be the first to try new features.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 10. Pricing Section */}
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
                Choose Your Plan
              </h2>
              <p className="text-lg text-blue-100/80 max-w-3xl mx-auto">
                Unlock premium features with a subscription that fits your needs.
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Weekly Plan */}
              <Card className="w-full bg-slate-800/70 border-white/10 text-white">
                <CardHeader className="text-center">
                  <h3 className="text-2xl font-bold">Weekly</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$4.99</span>
                    <span className="text-sm text-blue-100/70 ml-1">/ week</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-coral-500 mr-3 flex items-center justify-center text-xs">✓</div>
                      <span>Unlimited outfit suggestions</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-coral-500 mr-3 flex items-center justify-center text-xs">✓</div>
                      <span>Chat with Olivia</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-coral-500 mr-3 flex items-center justify-center text-xs">✓</div>
                      <span>Try-on technology</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600"
                    onClick={() => navigate('/premium')}
                  >
                    Upgrade to Premium Now
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Monthly Plan */}
              <Card className="w-full bg-slate-800/70 border-white/10 text-white relative">
                <div className="absolute -top-2.5 right-6 bg-gradient-to-r from-coral-400 to-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
                <CardHeader className="text-center">
                  <h3 className="text-2xl font-bold">Monthly</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$14.99</span>
                    <span className="text-sm text-blue-100/70 ml-1">/ month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-coral-500 mr-3 flex items-center justify-center text-xs">✓</div>
                      <span>Everything in Weekly plan</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-coral-500 mr-3 flex items-center justify-center text-xs">✓</div>
                      <span>Advanced outfit generator</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-coral-500 mr-3 flex items-center justify-center text-xs">✓</div>
                      <span>Early access to new features</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-coral-500 mr-3 flex items-center justify-center text-xs">✓</div>
                      <span>Premium community access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full btn-futuristic"
                    onClick={() => navigate('/premium')}
                  >
                    Upgrade to Premium Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Removed the Footer component that was here */}
    </div>
  );
};

export default Index;
