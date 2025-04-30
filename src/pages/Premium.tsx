
import React from 'react';
import { motion } from 'framer-motion';
import { Wand, MessageCircle, Shirt, Clock, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import OptimizedImage from '@/components/ui/optimized-image';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const Premium = () => {
  const features = [
    {
      icon: <Shirt className="h-10 w-10 text-blue-400" />,
      title: "Outfit Try-On",
      subtitle: "Upload your photo and try on outfits virtually.",
      description: "See how new styles fit your body type before styling or shopping."
    },
    {
      icon: <Wand className="h-10 w-10 text-pink-400" />,
      title: "AI Outfit Generator",
      subtitle: "Get outfits generated based on your mood, event, or preferences.",
      description: "Olivia instantly suggests curated looks just for you."
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-purple-400" />,
      title: "Chat with Olivia",
      subtitle: "Ask Olivia for personalized advice.",
      description: "Have real-time conversations with your AI stylist for any fashion need."
    },
    {
      icon: <Clock className="h-10 w-10 text-amber-400" />,
      title: "Exclusive Early Access",
      subtitle: "Be the first to access new collections.",
      description: "Get early access to premium features, AI tools, and limited fashion drops."
    }
  ];

  const pricingPlans = [
    {
      name: "Weekly Plan",
      price: "€2.99",
      interval: "week",
      features: [
        "Unlimited outfit suggestions",
        "Chat with Olivia",
        "Try-on technology"
      ],
      popular: false
    },
    {
      name: "Monthly Plan",
      price: "€8.99",
      interval: "month",
      features: [
        "Everything in the Weekly Plan",
        "Advanced outfit generator",
        "Early feature access",
        "Premium community access"
      ],
      popular: true
    }
  ];

  const testimonials = [
    {
      name: "Lotte",
      age: 32,
      role: "Fashion Enthusiast",
      quote: "Olivia has transformed how I dress! The outfit try-on feature saves me so much time and money on returns.",
      rating: 5,
      image: "/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png"
    },
    {
      name: "Marco",
      age: 27,
      role: "Creative Professional",
      quote: "The AI outfit generator is amazing - I get compliments every time I wear something Olivia suggested.",
      rating: 5,
      image: "/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png"
    },
    {
      name: "Sophia",
      age: 35,
      role: "Working Mom",
      quote: "With Olivia's help, I finally feel confident in my style choices. Premium is worth every euro!",
      rating: 5,
      image: "/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png"
    }
  ];

  const handleUpgradeClick = () => {
    // This would handle the subscription flow
    console.log("User clicked upgrade button");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pt-20">
        {/* Header Section */}
        <motion.section 
          className="text-center max-w-4xl mx-auto mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-400 mr-3" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300">
              Go Premium & Unlock the Full Power of Olivia
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/80 mt-4 max-w-3xl mx-auto">
            Upgrade your style journey with exclusive AI-powered tools and early fashion drops curated just for you.
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="glass-dark rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/5 hover:shadow-lg"
              >
                <div className="flex items-center justify-center mb-5">
                  <div className="p-3 rounded-full bg-white/10">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
                <h4 className="text-md font-medium text-center text-white/90 mb-3">{feature.subtitle}</h4>
                <p className="text-white/70 text-center text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Choose your plan & start styling smarter
          </h2>

          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto justify-center">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, translateY: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-1 relative"
              >
                <Card className={`overflow-hidden h-full backdrop-blur-sm ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-slate-800/95 to-purple-950/95 border-yellow-500/30' 
                    : 'bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-white/10'
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 left-0">
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold py-1 px-3 text-center">
                        BEST VALUE
                      </div>
                    </div>
                  )}

                  <CardContent className={`p-6 ${plan.popular ? 'pt-8' : 'pt-6'}`}>
                    <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-5">
                      <span className="text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-lg text-white/70 ml-1">/{plan.interval}</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="mr-2 text-green-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-white/60 text-sm text-center mb-6">
                      Cancel anytime. No commitment.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleUpgradeClick} 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20 py-6 px-8 text-lg rounded-xl"
                size="lg"
              >
                <Crown className="mr-2 h-5 w-5" /> Upgrade to Premium Now
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            What our premium members say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ translateY: -5 }}
                className="glass-dark rounded-xl p-6 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4 overflow-hidden rounded-full h-12 w-12 bg-slate-800 flex-shrink-0">
                    {testimonial.image && (
                      <OptimizedImage
                        src={testimonial.image}
                        alt={`${testimonial.name} avatar`}
                        className="object-cover h-full w-full"
                        width={48}
                        height={48}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}, {testimonial.age}</h4>
                    <p className="text-sm text-white/70">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-white/80 text-sm italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Premium;
